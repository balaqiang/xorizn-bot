
import { databaseApi } from '../../../lib/extra/database.js'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `Format penggunaan:\n*${usedPrefix + command} <teks>*\n\n` +
      `Contoh:\n*${usedPrefix + command} Halo @user, selamat datang di @grup!*\n\n` +
      `Variabel yang tersedia:\n` +
      `• *@user* : Mention member baru\n` +
      `• *@grup* : Nama grup\n` +
      `• *@bio* : Deskripsi grup`
    )
  }

  const dbInst = databaseApi
  dbInst.setGroup(m.chat, { welcomeText: text })
  const group = dbInst.getGroup(m.chat)

  return m.reply(`Berhasil mengubah teks welcome grup.\n\n*Status Welcome:* ${group.welcome ? 'Aktif' : 'Nonaktif (ketik .on welcome untuk mengaktifkan)'}\n\n*Teks:*\n${text}`)
}

handler.command = ['setwelcome', 'setwel']
handler.group = true
handler.admin = true
handler.owner = false
handler.premium = false
handler.private = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
