
let handler = async (m, { conn, text }) => {
  let groupMetadata = await conn.groupMetadata(m.chat)
  let participants = groupMetadata?.participants || []
  let mentions = participants.map(p => p.id)

  let messageText = `*TAG ALL MEMBER*\n`
  messageText += `*Grup:* ${groupMetadata.subject || 'Grup'}\n`
  messageText += `*Member:* ${participants.length}\n`
  if (text) messageText += `*Pesan:* ${text}\n`
  messageText += `\n`

  for (let mem of participants) {
    messageText += `◈ @${mem.id.split('@')[0]}\n`
  }

  await conn.sendMessage(m.chat, {
    text: messageText,
    mentions
  }, { quoted: m })
}

handler.help = ['tagall [pesan]']
handler.tags = ['group']
handler.command = /^(tagall|everyone|all)$/i
handler.group = true
handler.admin = true

export default handler
