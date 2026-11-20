/** AFK: pengguna yang AFK otomatis kembali saat mengirim pesan; yang menyebut/membalasnya diberi tahu. */
import bot from '../core/bot.js'
import { findUser, getUser } from '../core/models.js'
import { userPart } from '../core/jid.js'

export function formatDuration(ms) {
  const s = Math.floor(ms / 1000)
  const parts = [[Math.floor(s / 86400), 'hari'], [Math.floor((s % 86400) / 3600), 'jam'], [Math.floor((s % 3600) / 60), 'menit'], [s % 60, 'detik']]
  return parts.filter(([v]) => v > 0).slice(0, 2).map(([v, l]) => `${v} ${l}`).join(' ') || 'baru saja'
}

export async function handleAfk(sock, m) {
  const me = findUser(m.sender)
  const prefixes = bot.settings.prefixes || ['.']
  const isAfkCmd = prefixes.some((p) => m.text?.toLowerCase().startsWith(`${p}afk`))
  if (me && me.afk > -1 && !isAfkCmd) {
    const dur = formatDuration(Date.now() - me.afk)
    me.afk = -1
    me.afkReason = ''
    bot.db.save()
    await m.reply(`👋 @${userPart(m.sender)} kembali setelah AFK selama ${dur}.`)
  }

  const targets = new Set([...(m.mentionedJid || []), m.quoted?.sender].filter(Boolean))
  for (const jid of targets) {
    if (jid === m.sender) continue
    const u = findUser(jid)
    if (u && u.afk > -1) {
      await m.reply(`💤 @${userPart(jid)} sedang AFK${u.afkReason ? `: _${u.afkReason}_` : ''}\nSejak ${formatDuration(Date.now() - u.afk)} lalu.`)
    }
  }
}

export function setAfk(jid, reason = '') {
  const u = getUser(jid)
  u.afk = Date.now()
  u.afkReason = reason
  bot.db.save()
}
