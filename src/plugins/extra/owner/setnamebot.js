
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let handler = async (m, { text, usedPrefix, command }) => {
  const input = (text || '').trim()

  if (!input) {
    return m.reply(`Harap masukkan nama bot baru!\nContoh:\n${usedPrefix}${command} xorizn-bot`)
  }

  try {
    // [core] disimpan di pengaturan bot (database), bukan lagi di setting.js
    global.__core.bot.saveSettings({ botName: input })
    global.botName = input
    return m.reply(`✓ Sukses mengubah Nama Bot menjadi:
*${input}*`)
  } catch (e) {
    return m.reply(`Gagal menyimpan pengaturan:
${e.message || e}`)
  }
}

handler.command = ['setnamebot', 'setbotname', 'setnamabot']
handler.owner = true
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
