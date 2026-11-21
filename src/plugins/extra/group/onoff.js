
import { databaseApi } from '../../../lib/extra/database.js'

let handler = async (m, { text, args, usedPrefix, command }) => {
  const isEnable = command === 'on' || command === 'enable'
  const feature = (args[0] || text || '').toLowerCase().trim()

  const availableFeatures = ['welcome', 'goodbye', 'bye']

  if (!availableFeatures.includes(feature)) {
    return m.reply(
      `Pilihan fitur tidak valid!\n\n` +
      `*Penggunaan:*\n` +
      `• *${usedPrefix + command} welcome*\n` +
      `• *${usedPrefix + command} goodbye*\n\n` +
      `*Contoh:*\n` +
      `• *${usedPrefix}on welcome*\n` +
      `• *${usedPrefix}off welcome*`
    )
  }

  const targetKey = (feature === 'goodbye' || feature === 'bye') ? 'goodbye' : 'welcome'
  const dbInst = databaseApi
  const group = dbInst.getGroup(m.chat)

  if (group[targetKey] === isEnable) {
    return m.reply(`Fitur *${targetKey}* sudah *${isEnable ? 'AKTIF' : 'NONAKTIF'}* di grup ini sebelumnya.`)
  }

  dbInst.setGroup(m.chat, { [targetKey]: isEnable })

  return m.reply(`Fitur *${targetKey}* berhasil *${isEnable ? 'DIAKTIFKAN' : 'DINONAKTIFKAN'}* untuk grup ini.`)
}

handler.command = ['on', 'off', 'enable', 'disable']
handler.group = true
handler.admin = true
handler.owner = false
handler.premium = false
handler.private = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
