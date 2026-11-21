
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
    await m.reply(`Tag, balas pesan pengguna, atau masukkan nomor yang ingin ditambahkan ke premium.\nContoh: *${usedPrefix}${command} 6281234567890*`)
    return
  }

  const list = getPremiumUsers()
  if (list.includes(target)) {
    await m.reply(`Nomor *@${target}* sudah terdaftar sebagai pengguna premium.`)
    return
  }

  list.push(target)
  savePremiumUsers(list)

  await m.reply(`Berhasil menambahkan *@${target}* ke daftar pengguna premium.`)
}

handler.command = ['addprem', 'addpremium']
handler.owner = true
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
