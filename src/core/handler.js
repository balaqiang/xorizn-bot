/**
 * Alur pemrosesan setiap pesan masuk:
 *   serialize → simpan statistik → fitur pasif (moderasi, AFK, auto-respon, hook pack)
 *   → parse perintah → cek izin → jalankan plugin (native / vanxone / rubby)
 */
import bot from './bot.js'
import logger from '../logger.js'
import { serialize } from './serialize.js'
import { getGroup, getUser, isOwner, isPremium } from './models.js'
import { participantMatches, userPart } from './jid.js'
import { moderate } from '../features/moderation.js'
import { handleAfk } from '../features/afk.js'
import { autoRespond } from '../features/autoresponder.js'
import { autoSticker } from '../features/sticker.js'

const log = logger.child('handler')
const seen = new Set()
const cooldowns = new Map()

export const MESSAGES = {
  owner: '🔒 Perintah ini khusus *Owner Bot*.',
  premium: '💎 Perintah ini khusus pengguna *Premium*.',
  group: '👥 Perintah ini hanya bisa dipakai di *grup*.',
  private: '💬 Perintah ini hanya bisa dipakai di *chat pribadi*.',
  admin: '🛡️ Perintah ini khusus *admin grup*.',
  botAdmin: '🤖 Jadikan bot sebagai *admin grup* dulu.',
  nsfw: '🔞 Fitur NSFW belum diaktifkan di grup ini. Admin bisa mengaktifkannya lewat dashboard atau *.nsfw on*.',
  disabled: '⛔ Perintah ini sedang dinonaktifkan.',
  error: '❌ Terjadi kesalahan saat menjalankan perintah ini.'
}

/** Info admin grup untuk pesan ini (memakai cache metadata). */
export async function groupContext(sock, m, force = false) {
  if (!m.isGroup) return { metadata: null, participants: [], isAdmin: false, isBotAdmin: false }
  let metadata = null
  try {
    metadata = await bot.groupCache.get(sock, m.chat, force)
  } catch (err) {
    log.debug('gagal ambil metadata grup', m.chat, err.message)
  }
  if (metadata?.subject) {
    const doc = bot.db.get('groups', m.chat)
    if (doc && doc.name !== metadata.subject) doc.name = metadata.subject
  }
  const participants = metadata?.participants || []
  const isAdminP = (p) => p?.admin === 'admin' || p?.admin === 'superadmin'
  const me = participants.find((p) => participantMatches(p, [sock.user?.id, sock.user?.lid]))
  const user = participants.find((p) => participantMatches(p, [m.sender, m.senderLid, m.key.participant]))
  return { metadata, participants, isAdmin: isAdminP(user), isBotAdmin: isAdminP(me) }
}

export function parseCommand(text, settings) {
  const t = String(text || '').trim()
  if (!t) return null
  const prefixes = [...(settings.prefixes || ['.'])].filter(Boolean).sort((a, b) => b.length - a.length)
  let prefix = null
  for (const p of prefixes) {
    if (t.startsWith(p)) {
      prefix = p
      break
    }
  }
  let rest
  if (prefix !== null) rest = t.slice(prefix.length).trimStart()
  else if (settings.noPrefix) {
    prefix = ''
    rest = t
  } else return null
  const command = (rest.split(/\s+/)[0] || '').toLowerCase()
  if (!command) return null
  if (prefix === '' && !bot.registry.has(command)) return null
  const argText = rest.slice(command.length).trim()
  return { prefix, command, text: argText, args: argText ? argText.split(/\s+/) : [] }
}

function dedupe(id) {
  if (!id) return false
  if (seen.has(id)) return true
  seen.add(id)
  if (seen.size > 3000) seen.delete(seen.values().next().value)
  return false
}

function bump(stat, key, n = 1) {
  const doc = bot.db.ensure('stats', stat, {})
  doc[key] = (doc[key] || 0) + n
}

export async function onMessagesUpsert({ messages, type }) {
  const sock = bot.sock
  for (const raw of messages) {
    try {
      if (!raw?.message || !raw.key?.remoteJid) continue
      const jid = raw.key.remoteJid
      if (jid === 'status@broadcast' || jid.endsWith('@newsletter') || jid.endsWith('@broadcast')) continue
      bot.messageStore.add(raw)

      // 'append' = riwayat / sinkronisasi. Hanya tekanan tombol yang masih baru yang diproses.
      const age = Date.now() / 1000 - Number(raw.messageTimestamp || 0)
      if (type === 'append') {
        const c = raw.message
        const tap = c?.interactiveResponseMessage || c?.buttonsResponseMessage || c?.listResponseMessage || c?.templateButtonReplyMessage
        if (!tap || age > 120) continue
      }
      if (age > 600) continue // pesan lama yang tertunda saat bot offline
      if (raw.key.fromMe && bot.sentIds.has(raw.key.id)) continue // balasan bot sendiri
      if (dedupe(raw.key.id)) continue

      await processMessage(sock, raw)
    } catch (err) {
      bot.runtime.errors++
      log.error('error memproses pesan:', err)
    }
  }
}

/** Jalankan ulang pipeline dengan teks lain (mis. balasan angka ke kartu menu → perintah). */
export async function dispatchText(m, body) {
  const raw = {
    ...m.raw,
    key: { ...m.raw.key, id: `${m.raw.key.id}_r` },
    message: { conversation: String(body) }
  }
  return processMessage(bot.sock, raw)
}

async function processMessage(sock, raw) {
  const m = await serialize(sock, raw)
  const settings = bot.settings
  const owner = isOwner(m.sender, m.senderLid) || m.fromMe
  const user = getUser(m.sender)
  user.name = m.pushName || user.name
  user.lastSeen = Date.now()
  if (m.senderLid) user.lid = m.senderLid
  bot.db.save()

  const group = m.isGroup ? getGroup(m.chat) : null
  if (group) group.stats.messages++
  bump('daily', new Date().toISOString().slice(0, 10))

  if (settings.autoRead) sock.readMessages([m.key]).catch(() => {})

  // Stiker yang dipetakan ke perintah (.setcmd)
  if (m.type === 'stickerMessage' && m.msg?.fileSha256) {
    const sha = Buffer.from(m.msg.fileSha256).toString('base64')
    const mapped = settings.stickerCommands?.[sha]
    if (mapped) m.text = m.body = `${settings.prefixes?.[0] || '.'}${mapped}`
  }

  // Info admin hanya diambil bila diperlukan
  let gctx = null
  const getGctx = async (force = false) => (gctx && !force ? gctx : (gctx = await groupContext(sock, m, force)))

  // ---------- Fitur pasif ----------
  if (m.isGroup && !m.fromMe && !owner) {
    if (await moderate(sock, m, group, getGctx)) return
  }
  if (!m.fromMe) await handleAfk(sock, m)

  const base = { sock, bot, settings, isOwner: owner, user, group, getGroupContext: getGctx }

  for (const hook of bot.nativeHooks || []) {
    if (typeof hook.before !== 'function') continue
    try {
      if (await hook.before(m, base)) return
    } catch (err) {
      log.error(`hook ${hook.file}:`, err.message)
    }
  }
  for (const pack of Object.values(bot.packs)) {
    try {
      if (pack.passive && (await pack.passive(m, base))) return
    } catch (err) {
      log.error(`passive ${pack.name}:`, err.message)
    }
  }

  const parsed = parseCommand(m.text, settings)
  if (!parsed) {
    if (!m.fromMe && (await autoRespond(sock, m, group))) return
    if (m.isGroup && group?.autoSticker && !m.fromMe) await autoSticker(sock, m)
    return
  }

  const entry = bot.registry.resolve(parsed.command)
  if (!entry) return

  // ---------- Gerbang akses ----------
  const mode = settings.mode || 'public'
  if (!owner) {
    if (mode === 'self') return
    if (mode === 'group' && !m.isGroup) return
    if (mode === 'private' && m.isGroup) return
    if (user.banned) return
  }
  if (m.isGroup && !owner && (!group.botEnabled || group.onlyAdmin || (group.muted || []).includes(userPart(m.sender)))) {
    const { isAdmin } = await getGctx()
    if (!isAdmin) return
  }

  const flags = entry.flags || {}
  const names = new Set(entry.aliases)
  const disabled = [...(settings.disabledCommands || []), ...(group?.disabledCommands || [])]
  if (!owner && disabled.some((d) => names.has(d) || d === entry.id)) return m.reply(MESSAGES.disabled)
  if (flags.owner && !owner) return m.reply(MESSAGES.owner)
  if (flags.premium && !isPremium(m.sender)) return m.reply(MESSAGES.premium)
  if (flags.group && !m.isGroup) return m.reply(MESSAGES.group)
  if (flags.private && m.isGroup) return m.reply(MESSAGES.private)
  if (flags.nsfw && m.isGroup && !group.nsfw) return m.reply(MESSAGES.nsfw)

  let gc = { metadata: null, participants: [], isAdmin: false, isBotAdmin: false }
  if (m.isGroup) {
    gc = await getGctx()
    if ((flags.admin || flags.botAdmin) && !gc.participants.length) gc = await getGctx(true)
    if (flags.admin && !gc.isAdmin && !owner) return m.reply(MESSAGES.admin)
    if (flags.botAdmin && !gc.isBotAdmin) return m.reply(MESSAGES.botAdmin)
  } else if (flags.admin || flags.botAdmin) {
    return m.reply(MESSAGES.group)
  }

  // Jeda antar-perintah per pengguna (anti spam)
  if (!owner) {
    const wait = Number(entry.cooldown ?? settings.cooldown ?? 0) * 1000
    const last = cooldowns.get(m.sender) || 0
    if (wait && Date.now() - last < wait) return
    cooldowns.set(m.sender, Date.now())
    if (cooldowns.size > 5000) cooldowns.delete(cooldowns.keys().next().value)
  }

  const ctx = {
    ...base,
    entry,
    registry: bot.registry,
    db: bot.db,
    command: parsed.command,
    prefix: parsed.prefix,
    usedPrefix: parsed.prefix,
    args: parsed.args,
    text: parsed.text,
    groupMetadata: gc.metadata,
    participants: gc.participants,
    isAdmin: gc.isAdmin || owner,
    isBotAdmin: gc.isBotAdmin,
    isPremium: isPremium(m.sender),
    reply: (t, o) => m.reply(t, o),
    react: (e) => m.react(e)
  }

  if (settings.autoTyping) sock.sendPresenceUpdate('composing', m.chat).catch(() => {})
  const started = Date.now()
  let ok = true
  try {
    await entry.exec(m, ctx)
  } catch (err) {
    ok = false
    bot.runtime.errors++
    log.error(`[${entry.source}] ${parsed.command} gagal:`, err)
    await m.reply(`${MESSAGES.error}\n\n\`${String(err?.message || err).slice(0, 300)}\``).catch(() => {})
  } finally {
    if (settings.autoTyping) sock.sendPresenceUpdate('paused', m.chat).catch(() => {})
  }

  const ms = Date.now() - started
  bot.runtime.commands++
  user.commands = (user.commands || 0) + 1
  if (group) group.stats.commands++
  bump('commands', entry.name)
  bump('daily', `${new Date().toISOString().slice(0, 10)}:cmd`)
  const where = m.isGroup ? group?.name || m.chat : 'PC'
  log.cmd(`${ok ? '✓' : '✗'} ${parsed.prefix}${parsed.command} [${entry.source}] oleh ${m.pushName || userPart(m.sender)} di ${where} (${ms}ms)`)
  bot.emit('command', { name: parsed.command, source: entry.source, sender: userPart(m.sender), chat: m.chat, ok, ms, time: Date.now() })
}
