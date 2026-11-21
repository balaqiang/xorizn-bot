
let handler = async (m, { sock, usedPrefix, command }) => {
  await m.reply(`xorizn-bot aktif! [${usedPrefix}${command}]`)
}

handler.command = ['tes']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
