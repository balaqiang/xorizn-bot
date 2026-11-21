
let handler = async (m, { conn }) => {
  if (!m.quoted) {
    return m.reply('Reply pesan yang ingin dihapus!')
  }

  try {
    let key = {
      remoteJid: m.chat,
      fromMe: m.quoted.fromMe,
      id: m.quoted.key?.id || m.quoted.id,
      participant: m.quoted.key?.participant || m.quoted.sender
    }
    await conn.sendMessage(m.chat, { delete: key })
  } catch (err) {
    await m.reply(`Gagal menghapus pesan: ${err.message || err}`)
  }
}

handler.help = ['del']
handler.tags = ['group']
handler.command = /^(del|delete|d|hapus)$/i
handler.group = true
handler.admin = true
handler.botadmin = true

export default handler
