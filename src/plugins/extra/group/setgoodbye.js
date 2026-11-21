
import { databaseApi } from '../../../lib/extra/database.js'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `Format penggunaan:\n*${usedPrefix + command} <teks>*\n\n` +
      `Contoh:\n*${usedPrefix + command} Selamat tinggal @user dari @grup!*\n\n` +
      `Variabel yang tersedia:\n` +
      `• *@user* : Mention member yang keluar\n` +
      `• *@grup* : Nama grup\n` +
      `• *@bio* : Deskripsi grup`
    )
  }

  const dbInst = databaseApi
  dbInst.setGroup(m.chat, { goodbyeText: text })
  const group = dbInst.getGroup(m.chat)

  return m.reply(`Berhasil mengubah teks goodbye grup.\n\n*Status Goodbye:* ${group.goodbye ? 'Aktif' : 'Nonaktif (ketik .on goodbye untuk mengaktifkan)'}\n\n*Teks:*\n${text}`)
}

handler.command = ['setgoodbye', 'setbye', 'setleave']
handler.group = true
handler.admin = true
handler.owner = false
handler.premium = false
handler.private = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
