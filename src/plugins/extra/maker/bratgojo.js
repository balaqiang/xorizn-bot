
import { createSticker } from '../../../lib/extra/exif.js'

let handler = async (m, { sock, conn, text, usedPrefix, command }) => {
  const client = conn || sock
  const input = text || m.quoted?.text || ''

  if (!input.trim()) {
    return m.reply(
      `Format penggunaan:\n*${usedPrefix + command} <teks>*\n\n` +
      `Contoh:\n*${usedPrefix + command} Satoru Gojo*`
    )
  }

  await m.reply('Sedang membuat sticker brat gojo...')

  try {
    const apiUrl = global.API('kyzz', '/api/maker/brat-gojo', {
      text: input.trim()
    }, 'apikey')

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
    return m.reply(`Gagal membuat brat gojo:\n${e.message || e}`)
  }
}

handler.command = ['bratgojo']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
