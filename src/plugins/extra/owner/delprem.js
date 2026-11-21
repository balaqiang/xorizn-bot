
import { getPremiumUsers, savePremiumUsers, normalizeNumber } from '../../../lib/extra/utils.js'

let handler = async (m, { text, args, usedPrefix, command }) => {
  let target = ''
  if (m.quoted?.sender) {
    target = normalizeNumber(m.quoted.sender)
  } else if (m.mentionedJid && m.mentionedJid.length > 0) {
    target = normalizeNumber(m.mentionedJid[0])
  } else if (args[0]) {
    target = normalizeNumber(args[0])
  }

  if (!target) {
    await m.reply(`Tag, balas pesan pengguna, atau masukkan nomor yang ingin dihapus dari premium.\nContoh: *${usedPrefix}${command} 6281234567890*`)
    return
  }

  const list = getPremiumUsers()
  if (!list.includes(target)) {
    await m.reply(`Nomor *@${target}* tidak ditemukan di daftar pengguna premium.`)
    return
  }

  const updatedList = list.filter(num => num !== target)
  savePremiumUsers(updatedList)

  await m.reply(`Berhasil menghapus *@${target}* dari daftar pengguna premium.`)
}

handler.command = ['delprem', 'delpremium']
handler.owner = true
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
