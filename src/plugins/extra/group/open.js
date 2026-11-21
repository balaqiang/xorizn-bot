
let handler = async (m, { conn }) => {
  try {
    await conn.groupSettingUpdate(m.chat, 'not_announcement')
    await m.reply('Berhasil membuka grup. Seluruh anggota sekarang dapat mengirim pesan.')
  } catch (err) {
    await m.reply(`Gagal membuka grup: ${err.message || err}`)
  }
}

handler.help = ['open']
handler.tags = ['group']
handler.command = /^(open|buka)$/i
handler.group = true
handler.admin = true
handler.botadmin = true

export default handler
