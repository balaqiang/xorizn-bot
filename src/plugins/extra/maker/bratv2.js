
import { createSticker } from '../../../lib/extra/exif.js'

let handler = async (m, { sock, conn, text, usedPrefix, command }) => {
  const client = conn || sock
  const input = text || m.quoted?.text || ''

  if (!input.trim()) {
    return m.reply(
      `Format penggunaan:\n*${usedPrefix + command} <teks1 | teks2 | teks3>*\n\n` +
      `Contoh:\n*${usedPrefix + command} Baris Satu | Baris Dua | Baris Tiga*`
    )
  }

  await m.reply('Sedang membuat sticker brat v2...')

  try {
    const parts = input.split('|').map(s => s.trim()).filter(Boolean)
    const query = {
      text1: parts[0] || input.trim(),
      theme: 'white'
    }
    if (parts[1]) query.text2 = parts[1]
    if (parts[2]) query.text3 = parts[2]

    const apiUrl = global.API('kyzz', '/api/maker/brat-v2', query, 'apikey')

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

    const buffer = Buffer.from(await res.arrayBuffer())
    const stickerBuffer = await createSticker(buffer, {
      packName: global.botName || 'xorizn-bot',
      packPublish: global.botCreator || 'xorizn-bot',
      isVideo: false
    })

    await client.sendMessage(m.chat, {
      sticker: stickerBuffer
    }, { quoted: m.raw })
  } catch (e) {
    return m.reply(`Gagal membuat brat v2:\n${e.message || e}`)
  }
}

handler.command = ['bratv2']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
