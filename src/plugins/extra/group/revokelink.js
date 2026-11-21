
let handler = async (m, { conn }) => {
  try {
    let newCode = await conn.groupRevokeInvite(m.chat)
    let link = `https://chat.whatsapp.com/${newCode}`
    await m.reply(`*LINK GRUP BERHASIL DIRESET*\n\nLink baru:\n${link}`)
  } catch (err) {
    await m.reply(`Gagal mereset link grup: ${err.message || err}`)
  }
}

handler.help = ['revokelink']
handler.tags = ['group']
handler.command = /^(revokelink|revoke|resetlink)$/i
handler.group = true
handler.admin = true
handler.botadmin = true

export default handler
