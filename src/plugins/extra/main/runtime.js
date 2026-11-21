
import { formatRuntime } from '../../../lib/extra/utils.js'

let handler = async (m, { sock, usedPrefix, command }) => {
  const uptime = formatRuntime(Date.now() - (global.startTime || Date.now()))
  await m.reply(`*Bot Runtime:* ${uptime}\n*Invoked with:* ${usedPrefix}${command}`)
}

handler.command = ['runtime']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
