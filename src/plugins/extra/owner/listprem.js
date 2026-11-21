
import { getPremiumUsers } from '../../../lib/extra/utils.js'

let handler = async (m, { usedPrefix, command }) => {
  const dbPremiums = getPremiumUsers()

  if (dbPremiums.length === 0) {
    await m.reply('Belum ada pengguna premium yang terdaftar di database.')
    return
  }

  const p = usedPrefix || '.'
  let text = `乂 *PREMIUM USERS LIST*\n\n`
  text += `Total: *${dbPremiums.length}* user(s)\n\n`

  dbPremiums.forEach((user, index) => {
    text += `> ${index + 1}. @${user.replace(/[^0-9]/g, '')}\n`
  })

  text += `\n_Gunakan ${p}addprem / ${p}delprem untuk mengelola._`

  await m.reply(text.trim())
}

handler.command = ['listprem', 'listpremium']
handler.owner = true
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
