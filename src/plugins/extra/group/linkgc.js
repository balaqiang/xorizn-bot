
let handler = async (m, { conn }) => {
  try {
    let code = await conn.groupInviteCode(m.chat)
    let link = `https://chat.whatsapp.com/${code}`
    await m.reply(`*LINK GRUP*\n\n${link}`)
  } catch (err) {
    await m.reply(`Gagal mengambil link grup: ${err.message || err}`)
  }
}

handler.help = ['linkgc']
handler.tags = ['group']
handler.command = /^(linkgc|linkgrup|linkgroup|link)$/i
handler.group = true
handler.botadmin = true

export default handler
