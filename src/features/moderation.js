/**
 * Moderasi grup otomatis: anti-link dan anti-kata kasar dengan sistem peringatan.
 * Diatur per grup (dashboard → Grup, atau perintah .antilink / .antibadword).
 */
import bot from '../core/bot.js'
import { userPart } from '../core/jid.js'

const WA_LINK = /chat\.whatsapp\.com\/[A-Za-z0-9]{10,}|whatsapp\.com\/channel\/[A-Za-z0-9]+|wa\.me\/(?:qr|message)\//i
const ANY_LINK = /(https?:\/\/|www\.)[^\s]+|\b[a-z0-9-]+\.(com|net|org|id|io|co|me|xyz|link|ly|gg|tv|app|site|online|store|shop|info|biz)(\/[^\s]*)?\b/i

function hasBadword(text, list) {
  const lower = String(text || '').toLowerCase()
  return (list || []).some((w) => {
    const word = String(w).toLowerCase().trim()
    if (!word) return false
    return new RegExp(`(^|[^a-z0-9])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z0-9])`, 'i').test(lower)
  })
}

/** Tambah peringatan; kembalikan jumlah peringatan sekarang. */
export function addWarn(group, jid) {
  const id = userPart(jid)
  group.warns[id] = (group.warns[id] || 0) + 1
  bot.db.save()
  return group.warns[id]
}

export function resetWarn(group, jid) {
  delete group.warns[userPart(jid)]
  bot.db.save()
}

async function punish(sock, m, group, gctx, reason) {
  const { isBotAdmin } = gctx
  const tag = `@${userPart(m.sender)}`
  if (isBotAdmin) await sock.sendMessage(m.chat, { delete: m.key }).catch(() => {})
  const action = group.antilinkAction || 'delete'
  if (action === 'kick' && isBotAdmin) {
    await sock.sendMessage(m.chat, { text: `🚫 ${tag} dikeluarkan karena ${reason}.`, mentions: [m.sender] })
    await sock.groupParticipantsUpdate(m.chat, [m.senderLid || m.sender], 'remove').catch(() => {})
    return
  }
  if (action === 'warn' || action === 'kick') {
    const count = addWarn(group, m.sender)
    const limit = Number(group.warnLimit) || 3
    if (count >= limit && isBotAdmin) {
      resetWarn(group, m.sender)
      await sock.sendMessage(m.chat, { text: `🚫 ${tag} mencapai ${limit} peringatan (${reason}) dan dikeluarkan.`, mentions: [m.sender] })
      await sock.groupParticipantsUpdate(m.chat, [m.senderLid || m.sender], 'remove').catch(() => {})
      return
    }
    await sock.sendMessage(m.chat, { text: `⚠️ ${tag} ${reason}. Peringatan ${count}/${limit}.`, mentions: [m.sender] })
    return
  }
  await sock.sendMessage(m.chat, {
    text: isBotAdmin ? `⚠️ ${tag} ${reason}, pesan dihapus.` : `⚠️ ${tag} ${reason}. (Jadikan bot admin agar pesan bisa dihapus otomatis)`,
    mentions: [m.sender]
  })
}

/** Return true bila pesan ditindak (proses berhenti). */
export async function moderate(sock, m, group, getGctx) {
  if (!group || !m.text) return false
  const checkLink = group.antilink && group.antilink !== 'off'
  const checkBad = group.antiBadword && group.badwords?.length
  if (!checkLink && !checkBad) return false

  let reason = null
  if (checkLink) {
    const re = group.antilink === 'all' ? ANY_LINK : WA_LINK
    if (re.test(m.text)) {
      // link undangan grup ini sendiri diperbolehkan
      if (group.antilink === 'wa' && group.inviteCode && m.text.includes(group.inviteCode)) return false
      reason = group.antilink === 'all' ? 'mengirim link' : 'mengirim link grup/saluran WhatsApp'
    }
  }
  if (!reason && checkBad && hasBadword(m.text, group.badwords)) reason = 'memakai kata terlarang'
  if (!reason) return false

  const gctx = await getGctx()
  if (gctx.isAdmin) return false
  await punish(sock, m, group, gctx, reason)
  return true
}
