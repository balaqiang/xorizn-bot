// Hook grup: antitagall, antitagsw, antivirtex, bungkam, adminonly, blacklist (auto kick), pesan promote/demote
const A = require('../../lib/engine/lumen_group')
const { userOf, isBot } = require('../../lib/utils')

const ZALGO = /[̀-ͯ҉​-‏⁠؜]{20,}/
const BUG = /(‮|‭){3,}|[؀-ۿݐ-ݿ]{800,}|.{20000,}/s

module.exports = {
  name: 'anya-group-hook',
  hook: true,
  passive: async ({ sock, msg, from, sender, isGroup, body, prefix, isOwner }) => {
    if (!isGroup || msg.key.fromMe || !sender) return false
    const g = A.st.data.g[from]
    if (!g) return false
    const m = msg.message || {}
    const need = (g.antitagall || g.antitagsw || g.antivirtex || g.muted?.length || g.adminonly)
    if (!need) return false
    if (isOwner) return false

    // bungkam: hapus pesan anggota yang dibungkam (admin tidak bisa dibungkam saat ditandai)
    if (g.muted?.includes(userOf(sender))) { const i = await A.admins(sock, from).catch(() => null); if (i?.botAdmin) { A.del(sock, from, msg); return true } }

    if (g.adminonly && body.startsWith(prefix)) {
      const info = await A.admins(sock, from).catch(() => null)
      if (info && !info.admins.has(userOf(sender))) { await sock.sendMessage(from, { text: '🔒 Mode *adminonly* aktif: bot hanya melayani admin grup ini.' }, { quoted: msg }); return true }
    }

    let violation = null
    if (g.antitagsw && (m.groupStatusMentionMessage || m.groupStatusMentionMessageV2 || m.messageContextInfo?.groupStatusMention)) violation = 'tag status grup'
    if (!violation && g.antitagall) {
      const ci = (m.extendedTextMessage || m.imageMessage || m.videoMessage || m.documentMessage || {}).contextInfo
      const n = ci?.mentionedJid?.length || 0
      if (n >= 15 || (n >= 5 && ci?.groupMentions?.length)) violation = 'tag semua anggota'
    }
    if (!violation && g.antivirtex && body && (body.length > 8000 || ZALGO.test(body) || BUG.test(body))) violation = 'pesan virus/teks berat'
    if (!violation) return false

    const info = await A.admins(sock, from).catch(() => null)
    if (!info || info.admins.has(userOf(sender))) return false
    if (info.botAdmin) {
      A.del(sock, from, msg)
      await sock.sendMessage(from, { text: `🚫 @${userOf(sender)} terdeteksi melakukan *${violation}*. Pesan dihapus.`, mentions: [sender] })
      return true
    }
    return false
  },
  onParticipants: async (sock, ev) => {
    const g = A.st.data.g[ev.id]
    if (!g) return
    const jids = ev.participants.map((p) => (typeof p === 'string' ? p : p.id || p.jid)).filter(Boolean)
    if (ev.action === 'add' && g.blacklist?.length) {
      const hit = jids.filter((j) => g.blacklist.includes(userOf(j)))
      if (hit.length && (await A.admins(sock, ev.id).catch(() => ({}))).botAdmin) {
        await sock.groupParticipantsUpdate(ev.id, hit, 'remove').catch(() => {})
        await sock.sendMessage(ev.id, { text: `🚫 ${hit.map((j) => '@' + userOf(j)).join(', ')} ada di *blacklist* grup dan dikeluarkan.`, mentions: hit })
      }
    }
    if (ev.action === 'add' && g.intro) for (const j of jids) if (!isBot(sock, j)) await sock.sendMessage(ev.id, { text: `👋 @${userOf(j)}\n\n${g.intro}`, mentions: [j] }).catch(() => {})
    const t = ev.action === 'promote' ? g.promoteText : ev.action === 'demote' ? g.demoteText : ''
    if (t) for (const j of jids) await sock.sendMessage(ev.id, { text: t.replace(/@user\b/gi, `@${userOf(j)}`), mentions: [j] }).catch(() => {})
  }
}
