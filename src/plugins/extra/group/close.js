
let handler = async (m, { conn }) => {
  try {
    await conn.groupSettingUpdate(m.chat, 'announcement')
    await m.reply('Berhasil menutup grup. Hanya admin yang dapat mengirim pesan.')
  } catch (err) {
    await m.reply(`Gagal menutup grup: ${err.message || err}`)
  }
}

handler.help = ['close']
handler.tags = ['group']
handler.command = /^(close|tutup)$/i
handler.group = true
handler.admin = true
handler.botadmin = true

export default handler
