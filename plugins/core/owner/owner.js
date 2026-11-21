import { getTarget, mention, onOff, dashboardUrl } from '../../../src/utils/helpers.js'
import { getUser, findUser } from '../../../src/core/models.js'
import { digits, userPart, toPnJid } from '../../../src/core/jid.js'
import { loadNativePlugins } from '../../../src/core/loader.js'
import { restart } from '../../../src/core/lifecycle.js'

const DURATION = { m: 60_000, h: 3_600_000, j: 3_600_000, d: 86_400_000, hari: 86_400_000, w: 604_800_000, mg: 604_800_000, bln: 2_592_000_000, mo: 2_592_000_000 }
function parseDuration(s) {
  const m = /^(\d+)\s*([a-z]+)?$/i.exec(String(s || '').trim())
  if (!m) return 0
  return Number(m[1]) * (DURATION[(m[2] || 'd').toLowerCase()] || DURATION.d)
}

const ownerCmd = (def) => ({ category: 'owner', owner: true, ...def })

export default [
  ownerCmd({
    command: ['self', 'public', 'mode'],
    description: 'Mode bot: public (semua) | self (owner saja) | group (grup saja) | private (chat pribadi saja)',
    usage: '[public|self|group|private]',
    async run(m, { bot, command, args }) {
      const mode = command === 'mode' ? (args[0] || '').toLowerCase() : command
      if (!['public', 'self', 'group', 'private'].includes(mode)) return m.reply(`Mode sekarang: *${bot.settings.mode}*\nPilihan: public, self, group, private`)
      bot.saveSettings({ mode })
      return m.reply(`✅ Mode bot: *${mode}*`)
    }
  }),
  ownerCmd({
    command: ['setprefix', 'prefix'],
    description: 'Atur prefix (pisahkan spasi). "none" = tanpa prefix ikut aktif',
    usage: '<. ! # /> | none on/off',
    async run(m, { bot, args }) {
      if (!args.length) return m.reply(`Prefix: ${bot.settings.prefixes.join(' ')}\nTanpa prefix: ${bot.settings.noPrefix ? 'aktif' : 'mati'}`)
      if (args[0] === 'none') {
        const v = onOff(args[1])
        bot.saveSettings({ noPrefix: v ?? !bot.settings.noPrefix })
        return m.reply(`✅ Mode tanpa prefix ${bot.settings.noPrefix ? 'aktif' : 'mati'}.`)
      }
      bot.saveSettings({ prefixes: [...new Set(args.map((a) => a.trim()).filter(Boolean))].slice(0, 10) })
      return m.reply(`✅ Prefix: ${bot.settings.prefixes.join(' ')}`)
    }
  }),
  ownerCmd({
    command: ['addowner', 'delowner', 'listowner'],
    description: 'Kelola owner bot',
    usage: '@user | nomor',
    async run(m, { bot, command, text }) {
      const owners = new Set(bot.settings.owners)
      if (command === 'listowner') return m.reply(`👑 *Owner*\n${[...owners].map((n, i) => `${i + 1}. @${n}`).join('\n') || '-'}`)
      const target = getTarget(m, text)
      if (!target) return m.reply('Tag, reply, atau tulis nomornya.')
      const n = userPart(target)
      command === 'addowner' ? owners.add(n) : owners.delete(n)
      bot.saveSettings({ owners: [...owners] })
      return m.reply({ text: `✅ ${mention(target)} ${command === 'addowner' ? 'ditambahkan sebagai' : 'dihapus dari'} owner.`, mentions: [target] })
    }
  }),
  ownerCmd({
    command: ['addprem', 'addpremium'],
    description: 'Jadikan user premium. Durasi: 7d, 12h, 1mo (kosong = permanen)',
    usage: '@user [durasi]',
    async run(m, { db, text, args }) {
      const target = getTarget(m, text)
      if (!target) return m.reply('Tag, reply, atau tulis nomornya.')
      const durArg = args.find((a) => /^\d+[a-z]+$/i.test(a))
      const dur = parseDuration(durArg)
      const u = getUser(target)
      u.premium = true
      u.premiumTime = dur ? Math.max(Date.now(), u.premiumTime || 0) + dur : 0
      db.save()
      return m.reply({ text: `💎 ${mention(target)} sekarang premium ${dur ? `sampai ${new Date(u.premiumTime).toLocaleString('id-ID')}` : 'permanen'}.`, mentions: [target] })
    }
  }),
  ownerCmd({
    command: ['delprem', 'delpremium'],
    description: 'Cabut premium',
    usage: '@user',
    async run(m, { db, text }) {
      const target = getTarget(m, text)
      const u = target && findUser(target)
      if (!u) return m.reply('User tidak ditemukan.')
      u.premium = false
      u.premiumTime = 0
      db.save()
      return m.reply({ text: `✅ Premium ${mention(target)} dicabut.`, mentions: [target] })
    }
  }),
  {
    command: ['listprem', 'premlist'],
    category: 'owner',
    description: 'Daftar user premium',
    async run(m, { db }) {
      const list = Object.entries(db.collection('users')).filter(([, u]) => u.premium)
      if (!list.length) return m.reply('Belum ada user premium.')
      return m.reply({
        text: `💎 *User premium (${list.length})*\n\n${list.map(([id, u], i) => `${i + 1}. @${userPart(id)} — ${u.premiumTime ? 'sampai ' + new Date(u.premiumTime).toLocaleDateString('id-ID') : 'permanen'}`).join('\n')}`,
        mentions: list.map(([id]) => id)
      })
    }
  },
  ownerCmd({
    command: ['ban', 'banned', 'unban', 'listban'],
    description: 'Blokir user dari memakai bot',
    usage: '@user [alasan]',
    async run(m, { db, command, text, args }) {
      if (command === 'listban') {
        const list = Object.entries(db.collection('users')).filter(([, u]) => u.banned)
        return m.reply({ text: `🚫 *User diblokir (${list.length})*\n${list.map(([id, u], i) => `${i + 1}. @${userPart(id)}${u.banReason ? ` — ${u.banReason}` : ''}`).join('\n') || '-'}`, mentions: list.map(([id]) => id) })
      }
      const target = getTarget(m, text)
      if (!target) return m.reply('Tag, reply, atau tulis nomornya.')
      const u = getUser(target)
      u.banned = command !== 'unban'
      u.banReason = u.banned ? args.filter((a) => !a.startsWith('@') && !/^\d{8,}$/.test(a)).join(' ') : ''
      db.save()
      return m.reply({ text: `${u.banned ? '🚫' : '✅'} ${mention(target)} ${u.banned ? 'diblokir dari bot' : 'tidak diblokir lagi'}.`, mentions: [target] })
    }
  }),
  ownerCmd({
    command: ['bc', 'broadcast', 'bcgc'],
    description: 'Kirim pesan ke semua grup (reply media untuk kirim gambar/video)',
    usage: '<teks>',
    async run(m, { sock, bot, text }) {
      if (!text && !m.quoted) return m.reply('Tulis pesan broadcast.')
      const groups = await bot.groupCache.all(sock)
      await m.reply(`📣 Mengirim ke ${groups.length} grup...`)
      let ok = 0
      let media = null
      if (m.quoted?.isMedia && ['imageMessage', 'videoMessage'].includes(m.quoted.type)) media = { type: m.quoted.type === 'imageMessage' ? 'image' : 'video', buffer: await m.quoted.download() }
      const body = `📣 *BROADCAST*\n\n${text || m.quoted?.text || ''}`
      for (const g of groups) {
        try {
          await sock.sendMessage(g.id, media ? { [media.type]: media.buffer, caption: body } : { text: body })
          ok++
        } catch {}
        await new Promise((r) => setTimeout(r, 2500))
      }
      return m.reply(`✅ Broadcast terkirim ke ${ok}/${groups.length} grup.`)
    }
  }),
  ownerCmd({
    command: ['join', 'masuk'],
    description: 'Bot masuk grup lewat link undangan',
    usage: '<link>',
    async run(m, { sock, text }) {
      const code = (text || m.quoted?.text || '').match(/chat\.whatsapp\.com\/([A-Za-z0-9]{10,})/)?.[1]
      if (!code) return m.reply('Kirim link grup WhatsApp yang valid.')
      const id = await sock.groupAcceptInvite(code)
      return m.reply(`✅ Berhasil masuk grup ${id || ''}`)
    }
  }),
  ownerCmd({
    command: ['leavegc', 'keluar', 'out'],
    description: 'Bot keluar dari grup ini (atau id grup)',
    usage: '[id grup]',
    async run(m, { sock, text }) {
      const id = text.endsWith('@g.us') ? text.trim() : m.chat
      if (!id.endsWith('@g.us')) return m.reply('Pakai di grup atau tulis id grupnya.')
      if (id === m.chat) await m.reply('👋 Sampai jumpa!')
      await sock.groupLeave(id)
      if (id !== m.chat) return m.reply('✅ Bot keluar dari grup.')
    }
  }),
  ownerCmd({
    command: ['block', 'unblock'],
    description: 'Blokir / buka blokir nomor di WhatsApp',
    usage: '@user | nomor',
    async run(m, { sock, command, text }) {
      const target = getTarget(m, text) || (m.isGroup ? '' : m.chat)
      if (!target) return m.reply('Tag, reply, atau tulis nomornya.')
      await sock.updateBlockStatus(toPnJid(target), command)
      return m.reply(`✅ ${command === 'block' ? 'Diblokir' : 'Blokir dibuka'}: ${userPart(target)}`)
    }
  }),
  ownerCmd({
    command: ['setbotname', 'setnamabot'],
    description: 'Ganti nama bot (dipakai di menu & kartu)',
    usage: '<nama>',
    async run(m, { bot, text }) {
      if (!text) return m.reply('Tulis nama baru.')
      bot.saveSettings({ botName: text.slice(0, 40) })
      return m.reply(`✅ Nama bot: ${bot.settings.botName}`)
    }
  }),
  ownerCmd({
    command: ['setbio', 'setstatus'],
    description: 'Ganti info/bio profil WhatsApp bot',
    usage: '<teks>',
    async run(m, { sock, text }) {
      await sock.updateProfileStatus(text || '')
      return m.reply('✅ Bio diganti.')
    }
  }),
  ownerCmd({
    command: ['setppbot', 'setpp'],
    description: 'Ganti foto profil bot (kirim/reply gambar)',
    async run(m, { sock }) {
      const src = m.type === 'imageMessage' ? m : m.quoted?.type === 'imageMessage' ? m.quoted : null
      if (!src) return m.reply('Kirim atau reply gambar.')
      await sock.updateProfilePicture(sock.user.id, await src.download())
      return m.reply('✅ Foto profil bot diganti.')
    }
  }),
  ownerCmd({
    command: ['disable', 'enable'],
    description: 'Nonaktifkan / aktifkan perintah untuk semua (kecuali owner)',
    usage: '<perintah>',
    async run(m, { bot, args, command }) {
      const name = (args[0] || '').toLowerCase().replace(/^[./!#]/, '')
      if (!name || !bot.registry.has(name)) return m.reply('Perintah tidak ditemukan.')
      const set = new Set(bot.settings.disabledCommands)
      command === 'disable' ? set.add(name) : set.delete(name)
      bot.saveSettings({ disabledCommands: [...set] })
      return m.reply(`✅ *${name}* ${command === 'disable' ? 'dinonaktifkan' : 'diaktifkan'}.`)
    }
  }),
  ownerCmd({
    command: ['provider', 'setprovider'],
    description: 'Pilih sumber perintah bila nama bentrok (native/vanxone/rubby)',
    usage: '<perintah> [sumber]',
    async run(m, { bot, args }) {
      const name = (args[0] || '').toLowerCase()
      if (!name) return m.reply('Tulis nama perintahnya.')
      const providers = bot.registry.providers(name)
      if (!providers.length) return m.reply('Perintah tidak ditemukan.')
      const want = (args[1] || '').toLowerCase()
      if (!want) return m.reply(`*${name}* disediakan oleh: ${providers.map((p) => p.source).join(', ')}\nAktif: *${bot.registry.resolve(name).source}*`)
      if (!providers.some((p) => p.source === want)) return m.reply(`Sumber tidak tersedia. Pilihan: ${providers.map((p) => p.source).join(', ')}`)
      bot.saveSettings({ commandProviders: { ...bot.settings.commandProviders, [name]: want } })
      return m.reply(`✅ *${name}* sekarang memakai versi *${want}*.`)
    }
  }),
  ownerCmd({
    command: ['reload', 'reloadplugin'],
    description: 'Muat ulang plugin native & pack tanpa restart',
    async run(m, { bot }) {
      const native = await loadNativePlugins(bot.config.paths.plugins)
      bot.registry.register('native', native.entries)
      bot.nativeHooks = native.hooks
      for (const pack of Object.values(bot.packs)) await pack.reload?.()
      return m.reply(`✅ Dimuat ulang. Total ${bot.registry.active().length} perintah aktif.`)
    }
  }),
  ownerCmd({
    command: ['restart', 'reboot'],
    description: 'Restart bot',
    async run(m) {
      await m.reply('♻️ Restart...')
      setTimeout(() => restart(), 500)
    }
  }),
  ownerCmd({
    command: ['web', 'webpanel', 'dashboardurl'],
    description: 'Alamat dashboard pengaturan bot',
    private: true,
    async run(m) {
      return m.reply(`🖥️ Dashboard: ${dashboardUrl()}\nPassword ada di config/config.json → dashboard.password`)
    }
  }),
  ownerCmd({
    command: ['setcmd', 'delcmd', 'listcmd'],
    description: 'Jadikan stiker sebagai pemicu perintah (reply stiker)',
    usage: '<perintah>',
    async run(m, { bot, args, command }) {
      const map = { ...bot.settings.stickerCommands }
      if (command === 'listcmd') return m.reply(`🎨 *Stiker perintah*\n${Object.values(map).map((c, i) => `${i + 1}. ${c}`).join('\n') || '-'}`)
      const sha = m.quoted?.type === 'stickerMessage' && m.quoted.msg?.fileSha256 ? Buffer.from(m.quoted.msg.fileSha256).toString('base64') : null
      if (!sha) return m.reply('Reply stikernya.')
      if (command === 'delcmd') delete map[sha]
      else {
        if (!args.length) return m.reply('Tulis perintahnya, contoh: .setcmd menu')
        map[sha] = args.join(' ').replace(/^[./!#]/, '')
      }
      bot.saveSettings({ stickerCommands: map })
      return m.reply(`✅ Stiker ${command === 'delcmd' ? 'dilepas dari perintah' : `dipetakan ke *${map[sha]}*`}.`)
    }
  })
]
