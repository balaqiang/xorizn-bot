/**
 * Perintah OpenCode: tanya AI (dengan lampiran gambar/stiker/audio/dokumen), pilih model,
 * effort (variant), agent, kelola sesi, dan jawab permintaan izin.
 */
import {
  opencode, ocConfig, userState, canUse, ensureSession, newSession, effectiveModel, modelInfo,
  runPrompt, friendlyError, status, startService, parseModel, modelKey, permissionModeFor, workspaceDir, OpenCodeError
} from '../../../src/features/opencode.js'
import { readMessageMedia, mediaSourcesOf, composePrompt } from '../../../src/features/media-reader.js'
import { isPremium } from '../../../src/core/models.js'
import { userPart } from '../../../src/core/jid.js'

const answers = new Map() // id pesan jawaban bot → jid pengguna (untuk balas-lanjut)
const busy = new Set()
const fmtAgo = (t) => {
  const s = Math.floor((Date.now() - t) / 1000)
  if (s < 60) return 'baru saja'
  if (s < 3600) return `${Math.floor(s / 60)} mnt lalu`
  if (s < 86400) return `${Math.floor(s / 3600)} jam lalu`
  return `${Math.floor(s / 86400)} hari lalu`
}
const caps = (x) => `${x.capabilities?.input?.includes('image') ? '🖼️' : ''}${x.capabilities?.input?.includes('audio') ? '🎧' : ''}${x.variants?.length ? '⚙️' : ''}`

function chunks(text, size = 3500) {
  const out = []
  let rest = text
  while (rest.length > size) {
    let cut = rest.lastIndexOf('\n', size)
    if (cut < size * 0.5) cut = size
    out.push(rest.slice(0, cut))
    rest = rest.slice(cut)
  }
  if (rest.trim()) out.push(rest)
  return out
}

/** Ubah markdown umum ke format WhatsApp. */
function toWhatsApp(md) {
  return md
    .replace(/\*\*(.+?)\*\*/g, '*$1*')
    .replace(/^#{1,6}\s+(.+)$/gm, '*$1*')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '$1 ($2)')
}

function who(m, ctx) {
  return { sender: m.sender, pushName: m.pushName, isOwner: ctx.isOwner, isPremium: ctx.isPremium ?? isPremium(m.sender) }
}

async function guard(m, ctx) {
  const cfg = ocConfig()
  if (cfg.enabled === false) {
    await m.reply('OpenCode dinonaktifkan di pengaturan bot.')
    return false
  }
  if (!canUse(who(m, ctx))) {
    await m.reply(cfg.access === 'premium' ? '💎 Fitur OpenCode khusus pengguna premium.' : '🔒 Fitur OpenCode khusus owner bot.')
    return false
  }
  return true
}

async function handleError(m, err) {
  if (err instanceof OpenCodeError) return m.reply(`❌ ${err.message}`)
  return m.reply(friendlyError(err))
}

/** Inti: kirim pertanyaan (+ lampiran) ke OpenCode dan balas jawabannya. */
export async function ask(m, ctx, text) {
  const { sock } = ctx
  const u = who(m, ctx)
  const key = userPart(m.sender)
  if (busy.has(key)) return m.reply('⏳ Permintaanmu sebelumnya masih diproses. Ketik *.ocstop* untuk menghentikan.')
  busy.add(key)
  const state = userState(m.sender)
  try {
    const model = await effectiveModel(state)
    const info = await modelInfo(model).catch(() => null)
    const inputs = info?.capabilities?.input || ['text', 'image']
    const hasMedia = mediaSourcesOf(m).length > 0
    if (!text && !hasMedia) {
      return m.reply(`Tulis pertanyaannya, contoh:\n*${ctx.prefix || '.'}oc jelaskan cara kerja async/await*\n\nKirim/reply gambar, stiker, voice note, PDF, DOCX, XLSX, dll. dengan caption *.oc* untuk dibaca AI.`)
    }
    await m.react('⏳')
    const media = hasMedia ? await readMessageMedia(m, { supports: { image: inputs.includes('image'), audio: inputs.includes('audio') } }) : { files: [], texts: [], notes: [] }
    if (hasMedia && !media.files.length && !media.texts.length) {
      await m.react('❌')
      return m.reply(media.notes.join('\n') || 'Lampiran tidak bisa dibaca.')
    }

    const session = await ensureSession(u)
    const want = model && { providerID: model.providerID, id: model.id, ...(model.variant ? { variant: model.variant } : {}) }
    const cur = session.model
    if (want && (!cur || modelKey(cur) !== modelKey(want) || (cur.variant || '') !== (want.variant || ''))) await opencode.switchModel(session.id, want)

    const prompt = composePrompt(text, media)
    let retryWarned = false
    const result = await runPrompt(session.id, { text: prompt, files: media.files }, {
      onRetry: async (retry) => {
        if (!retryWarned) {
          retryWarned = true
          await m.reply(`${friendlyError(retry.error)}\n_(OpenCode mencoba ulang otomatis…)_`)
        }
        if (retry.attempt >= 3 || /rate-limit|quota/i.test(retry.error?.type || retry.error?.message || '')) await opencode.interrupt(session.id).catch(() => {})
      },
      onPermission: async (p) => {
        state.pendingPermission = { sessionId: session.id, id: p.id, action: p.action, resources: p.resources }
        ctx.bot.db.save()
        await m.reply(`🔐 *OpenCode minta izin*\nAksi: *${p.action}*\n${(p.resources || []).map((r) => `• \`${String(r).slice(0, 200)}\``).join('\n')}${p.message ? `\n${p.message}` : ''}\n\nBalas: *.ocizin ya* (sekali) • *.ocizin selalu* • *.ocizin tolak*`)
      },
      onProgress: () => sock.sendPresenceUpdate('composing', m.chat).catch(() => {})
    })

    const notes = media.notes.length ? `\n\n_ℹ️ ${media.notes.join(' • ')}_` : ''
    if (result.error && !result.text) {
      await m.react('❌')
      return m.reply(friendlyError(result.error) + notes)
    }
    const tools = result.tools?.length ? `🔧 ${Object.entries(result.tools.reduce((a, t) => ((a[t.name] = (a[t.name] || 0) + 1), a), {})).map(([n, c]) => (c > 1 ? `${n}×${c}` : n)).join(', ')}\n` : ''
    const tokens = result.tokens ? result.tokens.input + result.tokens.output : 0
    const variant = result.model?.variant && result.model.variant !== 'default' ? `#${result.model.variant}` : ''
    const footer = `\n\n_${modelKey(result.model || model) || 'default'}${variant} •${(result.ms / 1000).toFixed(1)} dtk${tokens ? ` • ${tokens.toLocaleString('id-ID')} token` : ''}_`
    const body = toWhatsApp(result.text || '(tidak ada jawaban teks)')
    const parts = chunks(`${tools}${body}`)
    let sent
    for (const [i, part] of parts.entries()) sent = await m.reply(i === parts.length - 1 ? part + notes + footer : part)
    if (sent?.key?.id) {
      answers.set(sent.key.id, m.sender)
      if (answers.size > 500) answers.delete(answers.keys().next().value)
    }
    await m.react(result.error ? '⚠️' : '✅')
  } catch (err) {
    await m.react('❌')
    await handleError(m, err)
  } finally {
    busy.delete(key)
  }
}

const cmd = (def) => ({ category: 'ai', ...def })

export default [
  cmd({
    command: ['oc', 'opencode', 'ocask'],
    description: 'Tanya AI OpenCode (lewat 9router). Bisa membaca gambar, stiker, video, voice note, PDF, DOCX, XLSX, PPTX & file teks — kirim/reply medianya',
    usage: '<pertanyaan>',
    async run(m, ctx) {
      if (!(await guard(m, ctx))) return
      return ask(m, ctx, ctx.text)
    },
    /** Balas (reply) jawaban OpenCode tanpa perintah = lanjut bertanya di sesi yang sama. */
    async before(m, base) {
      if (!m.quoted?.id || !answers.has(m.quoted.id) || m.fromMe) return false
      const prefixes = base.settings.prefixes || ['.']
      if (prefixes.some((p) => m.text?.startsWith(p))) return false
      if (!m.text && !mediaSourcesOf(m).length) return false
      const ctx = { ...base, isPremium: isPremium(m.sender), prefix: prefixes[0] }
      if (ocConfig().enabled === false || !canUse(who(m, ctx))) return false
      await ask(m, ctx, m.text)
      return true
    }
  }),
  cmd({
    command: ['ocmodels', 'ocmodellist', 'modellist'],
    description: 'Daftar model OpenCode (🖼️ bisa baca gambar, 🎧 audio, ⚙️ punya pilihan effort)',
    usage: '[filter, mis. 9router]',
    async run(m, ctx) {
      if (!(await guard(m, ctx))) return
      try {
        const state = userState(m.sender)
        const current = modelKey(await effectiveModel(state))
        const q = ctx.text.toLowerCase().trim()
        const list = (await opencode.models()).filter((x) => x.enabled !== false && (!x.type || x.type === 'chat') && (!q || `${x.providerID}/${x.id} ${x.name}`.toLowerCase().includes(q)))
        if (!list.length) return m.reply('Model tidak ditemukan.')
        state.lastModels = list.map((x) => `${x.providerID}/${x.id}`)
        ctx.bot.db.save()
        const groups = {}
        list.forEach((x, i) => (groups[x.providerID] ||= []).push(`${String(i + 1).padStart(2)}. ${modelKey(x) === current ? '✅ ' : ''}${x.id} ${caps(x)}`))
        const body = Object.entries(groups).map(([p, rows]) => `*${p}* (${rows.length})\n${rows.join('\n')}`).join('\n\n')
        return m.reply(`🤖 *Model OpenCode* (${list.length})\nAktif: *${current || 'default'}*\n\n${body}\n\n🖼️ gambar • 🎧 audio • ⚙️ effort\nPilih: *.ocmodel <nomor>*`)
      } catch (err) {
        return handleError(m, err)
      }
    }
  }),
  cmd({
    command: ['ocmodel', 'ocsetmodel'],
    description: 'Lihat / pilih model OpenCode',
    usage: '[nomor | provider/model]',
    async run(m, ctx) {
      if (!(await guard(m, ctx))) return
      try {
        const state = userState(m.sender)
        const arg = ctx.text.trim()
        if (!arg) {
          const model = await effectiveModel(state)
          const info = await modelInfo(model)
          return m.reply(`🤖 Model aktif: *${modelKey(model) || 'default'}*${model?.variant ? ` (effort: ${model.variant})` : ''}\n${info ? `Input: ${info.capabilities.input.join(', ')}\nKonteks: ${info.limit?.context?.toLocaleString('id-ID') || '-'} token\nEffort: ${info.variants?.map((v) => v.id).join(', ') || 'tidak ada'}` : ''}\n\nGanti: *.ocmodel <nomor>* (lihat *.ocmodels*)`)
        }
        const list = await opencode.models()
        let pick = null
        if (/^\d+$/.test(arg) && state.lastModels?.[Number(arg) - 1]) pick = parseModel(state.lastModels[Number(arg) - 1])
        else if (arg.includes('/')) pick = parseModel(arg)
        else {
          const hits = list.filter((x) => `${x.providerID}/${x.id}`.toLowerCase().includes(arg.toLowerCase()))
          if (hits.length === 1) pick = { providerID: hits[0].providerID, id: hits[0].id }
          else if (hits.length > 1) return m.reply(`Ada ${hits.length} model cocok, perjelas:\n${hits.slice(0, 15).map((x) => `• ${x.providerID}/${x.id}`).join('\n')}`)
        }
        const info = pick && list.find((x) => x.providerID === pick.providerID && x.id === pick.id)
        if (!info) return m.reply('Model tidak ditemukan. Lihat daftar dengan *.ocmodels*')
        state.model = { providerID: info.providerID, id: info.id }
        if (pick.variant) state.variant = pick.variant
        if (state.variant && !info.variants?.some((v) => v.id === state.variant)) state.variant = ''
        ctx.bot.db.save()
        if (state.sessionId) await opencode.switchModel(state.sessionId, { ...state.model, ...(state.variant ? { variant: state.variant } : {}) }).catch(() => {})
        return m.reply(`✅ Model: *${modelKey(info)}* ${caps(info)}${info.variants?.length ? `\nEffort tersedia: ${info.variants.map((v) => v.id).join(', ')} (*.oceffort*)` : ''}`)
      } catch (err) {
        return handleError(m, err)
      }
    }
  }),
  cmd({
    command: ['oceffort', 'ocvariant', 'effort'],
    description: 'Atur reasoning effort (variant) model OpenCode',
    usage: '[low|medium|high|... | off]',
    async run(m, ctx) {
      if (!(await guard(m, ctx))) return
      try {
        const state = userState(m.sender)
        const model = await effectiveModel(state)
        const info = await modelInfo(model)
        const variants = info?.variants?.map((v) => v.id) || []
        const arg = ctx.text.trim().toLowerCase()
        if (!arg) {
          return m.reply(variants.length
            ? `⚙️ Effort *${modelKey(model)}*: *${state.variant || 'default'}*\nPilihan: ${variants.join(', ')}\n\nAtur: *.oceffort <pilihan>* • *.oceffort off*`
            : `Model *${modelKey(model)}* tidak punya pilihan effort.\nPilih model bertanda ⚙️ di *.ocmodels*, atau tambahkan \`capabilities.reasoning.effort\` untuk model ini di opencode.json.`)
        }
        if (['off', 'default', 'reset', 'none-default'].includes(arg)) state.variant = ''
        else if (!variants.includes(arg)) return m.reply(`Pilihan tidak tersedia. Effort model ini: ${variants.join(', ') || '-'}`)
        else state.variant = arg
        ctx.bot.db.save()
        if (state.sessionId && model) await opencode.switchModel(state.sessionId, { providerID: model.providerID, id: model.id, ...(state.variant ? { variant: state.variant } : {}) }).catch(() => {})
        return m.reply(`✅ Effort: *${state.variant || 'default'}*`)
      } catch (err) {
        return handleError(m, err)
      }
    }
  }),
  cmd({
    command: ['ocnew', 'ocnewsession', 'ocbaru'],
    description: 'Mulai sesi OpenCode baru',
    usage: '[judul]',
    async run(m, ctx) {
      if (!(await guard(m, ctx))) return
      try {
        const s = await newSession(who(m, ctx), ctx.text.trim() || undefined)
        return m.reply(`🆕 Sesi baru dibuat\n*${s.title}*\n🆔 ${s.id}\n🤖 ${modelKey(s.model) || 'default'}${s.model?.variant ? `#${s.model.variant}` : ''}\n\nKetik *.oc <pertanyaan>* untuk mulai.`)
      } catch (err) {
        return handleError(m, err)
      }
    }
  }),
  cmd({
    command: ['ocsessions', 'ocsesi', 'oclist'],
    description: 'Daftar sesi OpenCode terbaru',
    usage: '[cari]',
    async run(m, ctx) {
      if (!(await guard(m, ctx))) return
      try {
        const state = userState(m.sender)
        let list = await opencode.sessions(20, ctx.text.trim() || undefined)
        if (!ctx.isOwner) list = list.filter((s) => s.metadata?.user === userPart(m.sender))
        if (!list.length) return m.reply('Belum ada sesi. Buat dengan *.ocnew*')
        state.lastSessions = list.map((s) => s.id)
        ctx.bot.db.save()
        return m.reply(`🗂️ *Sesi OpenCode*\n\n${list.map((s, i) => `${i + 1}. ${s.id === state.sessionId ? '✅ ' : ''}*${(s.title || '(tanpa judul)').slice(0, 60)}*\n    ${fmtAgo(s.time.updated)} • ${modelKey(s.model) || '-'}${s.metadata?.source === 'bitch-bot' ? ' • WA' : ''}`).join('\n')}\n\nBuka: *.ocopen <nomor>*`)
      } catch (err) {
        return handleError(m, err)
      }
    }
  }),
  cmd({
    command: ['ocopen', 'ocbuka', 'ocswitch'],
    description: 'Buka / lanjutkan sesi OpenCode (nomor dari .ocsessions atau id sesi)',
    usage: '<nomor | id>',
    async run(m, ctx) {
      if (!(await guard(m, ctx))) return
      try {
        const state = userState(m.sender)
        const arg = ctx.text.trim()
        if (!arg) return m.reply('Tulis nomor dari *.ocsessions* atau id sesi.')
        const id = /^\d+$/.test(arg) ? state.lastSessions?.[Number(arg) - 1] : arg
        if (!id) return m.reply('Nomor tidak ada. Jalankan *.ocsessions* dulu.')
        const s = await opencode.session(id)
        if (!ctx.isOwner && s.metadata?.user !== userPart(m.sender)) return m.reply('Kamu hanya bisa membuka sesi milikmu sendiri.')
        state.sessionId = s.id
        if (s.model) {
          state.model = { providerID: s.model.providerID, id: s.model.id }
          state.variant = s.model.variant || ''
        }
        ctx.bot.db.save()
        const msgs = await opencode.messages(s.id, 10)
        const last = msgs.filter((x) => x.type === 'assistant' || x.type === 'user').slice(0, 2).reverse()
        const preview = last.map((x) => `${x.type === 'user' ? '👤' : '🤖'} ${(x.type === 'user' ? x.text : (x.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('')).slice(0, 300)}`).join('\n\n')
        return m.reply(`📂 Sesi dibuka: *${s.title || s.id}*\n🤖 ${modelKey(s.model) || 'default'}${s.model?.variant ? `#${s.model.variant}` : ''}\n${preview ? `\n${preview}\n` : ''}\nLanjutkan dengan *.oc <pertanyaan>*`)
      } catch (err) {
        return handleError(m, err)
      }
    }
  }),
  cmd({
    command: ['ocagent'],
    description: 'Pilih agent OpenCode (build = bisa kerja/ubah, plan = hanya analisis)',
    usage: '[build | plan]',
    async run(m, ctx) {
      if (!(await guard(m, ctx))) return
      try {
        const state = userState(m.sender)
        const agents = (await opencode.agents()).filter((a) => a.mode !== 'subagent' && !a.hidden)
        const arg = ctx.text.trim().toLowerCase()
        if (!arg) return m.reply(`🧭 Agent aktif: *${state.agent || ocConfig().defaultAgent || 'build'}*\nPilihan:\n${agents.map((a) => `• *${a.id}* — ${a.description || a.name}`).join('\n')}`)
        if (!agents.some((a) => a.id === arg)) return m.reply(`Agent tidak ada. Pilihan: ${agents.map((a) => a.id).join(', ')}`)
        state.agent = arg
        ctx.bot.db.save()
        if (state.sessionId) await opencode.switchAgent(state.sessionId, arg).catch(() => {})
        return m.reply(`✅ Agent: *${arg}*`)
      } catch (err) {
        return handleError(m, err)
      }
    }
  }),
  cmd({
    command: ['ocstop', 'ocabort', 'ocbatal'],
    description: 'Hentikan jawaban OpenCode yang sedang berjalan',
    async run(m, ctx) {
      if (!(await guard(m, ctx))) return
      const state = userState(m.sender)
      if (!state.sessionId) return m.reply('Tidak ada sesi aktif.')
      try {
        const r = await opencode.interrupt(state.sessionId)
        return m.reply(r?.interrupted ? '⏹️ Dihentikan.' : 'Tidak ada proses yang berjalan.')
      } catch (err) {
        return handleError(m, err)
      }
    }
  }),
  cmd({
    command: ['ocizin', 'ocallow', 'ocperm'],
    description: 'Jawab permintaan izin OpenCode (shell / edit file)',
    usage: 'ya | selalu | tolak',
    owner: true,
    async run(m, ctx) {
      const state = userState(m.sender)
      const p = state.pendingPermission
      if (!p) return m.reply('Tidak ada permintaan izin yang menunggu.')
      const map = { ya: 'once', y: 'once', once: 'once', sekali: 'once', selalu: 'always', always: 'always', tolak: 'reject', no: 'reject', reject: 'reject', tidak: 'reject' }
      const decision = map[ctx.text.trim().toLowerCase()]
      if (!decision) return m.reply('Pakai: *.ocizin ya* | *.ocizin selalu* | *.ocizin tolak*')
      try {
        await opencode.replyPermission(p.sessionId, p.id, decision)
        state.pendingPermission = null
        ctx.bot.db.save()
        return m.reply(decision === 'reject' ? '🚫 Ditolak.' : `✅ Diizinkan (${decision === 'always' ? 'selalu' : 'sekali'}).`)
      } catch (err) {
        return handleError(m, err)
      }
    }
  }),
  cmd({
    command: ['ocstart', 'ocserve'],
    description: 'Nyalakan server OpenCode di komputer bot (opencode service start)',
    owner: true,
    async run(m) {
      const before = await status()
      if (before.ok) return m.reply(`✅ Server OpenCode sudah berjalan (v${before.version}).`)
      await m.react('⏳')
      try {
        await startService()
        const st = await status()
        await m.react(st.ok ? '✅' : '❌')
        return m.reply(st.ok ? `✅ Server OpenCode menyala (v${st.version}) di ${st.url}` : `❌ Service dijalankan tapi belum bisa dihubungi: ${st.error}`)
      } catch (err) {
        await m.react('❌')
        return m.reply(`❌ ${err.message}`)
      }
    }
  }),
  cmd({
    command: ['ocstatus', 'ocinfo'],
    description: 'Status koneksi OpenCode & pengaturanmu',
    async run(m, ctx) {
      const st = await status()
      const state = userState(m.sender)
      const model = st.ok ? await effectiveModel(state).catch(() => null) : null
      return m.reply([
        `🧠 *OpenCode*`,
        `Server: ${st.ok ? `✅ v${st.version} (${st.url})` : `❌ ${st.error}`}`,
        `Model: *${modelKey(model) || 'default'}*${model?.variant ? `#${model.variant}` : ''}`,
        `Agent: ${state.agent || ocConfig().defaultAgent || 'build'}`,
        `Sesi: ${state.sessionId || '-'}`,
        `Izin: ${permissionModeFor(who(m, ctx))} • Akses: ${ocConfig().access}`,
        ctx.isOwner ? `Folder kerja: ${workspaceDir()}` : ''
      ].filter(Boolean).join('\n'))
    }
  }),
  cmd({
    command: ['ochelp', 'ocmenu'],
    description: 'Panduan perintah OpenCode',
    async run(m, ctx) {
      const p = ctx.prefix || '.'
      return m.reply([
        '🧠 *OPENCODE AI* (lewat 9router)',
        '',
        `${p}oc <pertanyaan> — tanya AI`,
        `   kirim / reply gambar, stiker, video, voice note, PDF, DOCX, XLSX, PPTX, file kode → dibaca AI`,
        `   reply jawaban bot = lanjut bertanya`,
        `${p}ocmodels [filter] — daftar model`,
        `${p}ocmodel <nomor> — pilih model`,
        `${p}oceffort <low|high|…> — reasoning effort`,
        `${p}ocagent <build|plan> — pilih agent`,
        `${p}ocnew [judul] — sesi baru`,
        `${p}ocsessions — daftar sesi`,
        `${p}ocopen <nomor> — buka sesi`,
        `${p}ocstop — hentikan jawaban`,
        `${p}ocizin ya|selalu|tolak — jawab izin (owner)`,
        `${p}ocstart — nyalakan server OpenCode (owner)`,
        `${p}ocstatus — status koneksi`
      ].join('\n'))
    }
  })
]
