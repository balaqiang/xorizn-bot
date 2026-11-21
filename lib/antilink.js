// Hapus pesan berisi link di grup yang mengaktifkan antilink
const config = require('../config')
const { getGroup } = require('./groups')
const { getGroupInfo, userOf } = require('./utils')

const WA_LINK = /chat\.whatsapp\.com\/[A-Za-z0-9]{8,}/i
const ANY_LINK = /(https?:\/\/|www\.)\S+|chat\.whatsapp\.com\/\S+/i

const warns = new Map() // `${grup}:${nomor}` -> jumlah pelanggaran (reset saat bot restart)

// return true kalau pesan ditindak (supaya tidak diproses lagi)
async function handleAntiLink(sock, msg, { from, sender, body, isOwner }) {
  const mode = getGroup(from).antilink
  if (mode === 'off' || !body) return false
  if (!(mode === 'all' ? ANY_LINK : WA_LINK).test(body)) return false
  if (isOwner) return false

  const info = await getGroupInfo(sock, from, sender)
  if (info.isAdmin || !info.isBotAdmin) return false // admin bebas; bot harus admin untuk menghapus

  await sock.sendMessage(from, { delete: msg.key })

  const maxWarn = config.antilink?.maxWarn ?? 3
  const key = `${from}:${userOf(sender)}`
  const count = (warns.get(key) || 0) + 1
  const tag = `@${userOf(sender)}`

  if (maxWarn > 0 && count >= maxWarn) {
    warns.delete(key)
    await sock.sendMessage(from, {
      text: `${tag} dikeluarkan karena mengirim link ${maxWarn}x.`,
      mentions: [sender]
    })
    await sock.groupParticipantsUpdate(from, [sender], 'remove')
  } else {
    warns.set(key, count)
    await sock.sendMessage(from, {
      text: `⚠️ ${tag}, dilarang mengirim link di grup ini!${maxWarn > 0 ? ` Peringatan ${count}/${maxWarn}.` : ''}`,
      mentions: [sender]
    })
  }
  return true
}

module.exports = { handleAntiLink }
