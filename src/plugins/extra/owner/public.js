
let handler = async (m, { usedPrefix, command }) => {
  global.mode = 'public'
  await m.reply(`Mode bot berhasil diubah ke *PUBLIC* via *${usedPrefix}${command}*.`)
}

handler.command = ['public']
handler.owner = true
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
