
let handler = async (m, { sock, text, usedPrefix, command }) => {
  const groupMetadata = await sock.groupMetadata(m.chat)
  const participants = groupMetadata?.participants || []
  const users = participants.map(u => u.id)
  const message = text || 'Pengumuman Group'

  await sock.sendMessage(m.chat, {
    text: message,
    mentions: users
  })
}

handler.command = ['hidetag', 'h']
handler.owner = false
handler.premium = false
handler.group = true
handler.private = false
handler.admin = true
handler.botadmin = false
handler.noJadiBot = false

export default handler
