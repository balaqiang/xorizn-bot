
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let handler = async (m, { text, usedPrefix, command }) => {
  const input = (text || '').trim()

  if (!input) {
    return m.reply(`Harap masukkan URL website baru!\nContoh:\n${usedPrefix}${command} https://api.kyzzz.xyz`)
  }

  if (!/^https?:\/\//i.test(input)) {
    return m.reply('Format URL tidak valid! Harus diawali dengan http:// atau https://')
  }

  try {
    // [core] disimpan di pengaturan bot (database), bukan lagi di setting.js
    global.__core.bot.saveSettings({ website: input })
    global.website = input
    return m.reply(`✓ Sukses mengubah website menjadi:
${input}`)
  } catch (e) {
    return m.reply(`Gagal menyimpan pengaturan:
${e.message || e}`)
  }
}

handler.command = ['setweb', 'setwebsite', 'setwebbot']
handler.owner = true
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
