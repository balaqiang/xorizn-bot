
let handler = async (m, { usedPrefix, command }) => {
  global.mode = 'self'
  await m.reply(`Mode bot berhasil diubah ke *SELF* via *${usedPrefix}${command}*.`)
}

handler.command = ['self']
handler.owner = true
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
