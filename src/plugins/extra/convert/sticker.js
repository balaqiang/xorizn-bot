
import { createSticker } from '../../../lib/extra/exif.js'

let handler = async (m, { sock, conn, text, usedPrefix, command }) => {
  const client = conn || sock
  const quoted = m.quoted || m
  const mime = quoted.mimetype || m.mimetype || ''

  const isImage = /image/i.test(mime)
  const isVideo = /video/i.test(mime)

  if (!isImage && !isVideo) {
    return m.reply(`Kirim atau balas (reply) gambar/video dengan command:\n${usedPrefix}${command} [packname|author]`)
  }

  let packName = global.packname || global.botName || 'xorizn-bot'
  let packPublish = global.author || global.botCreator || 'xorizn-bot'

  if (text) {
    const parts = text.split('|')
    if (parts[0]) packName = parts[0].trim()
    if (parts[1]) packPublish = parts[1].trim()
  }

  let buffer
  try {
    buffer = typeof quoted.download === 'function' ? await quoted.download() : await m.download()
  } catch (e) {
    return m.reply(`Gagal mengunduh media: ${e.message || e}`)
  }

  if (!buffer || !Buffer.isBuffer(buffer)) {
    return m.reply('Buffer media tidak valid.')
  }

  try {
    const stickerBuffer = await createSticker(buffer, {
      packName,
      packPublish,
      isVideo
    })

    return await client.sendMessage(
      m.chat,
      {
        sticker: stickerBuffer
      },
      { quoted: m.raw }
    )
  } catch (e) {
    return m.reply(`Gagal membuat stiker:\n${e.message || e}`)
  }
}

handler.command = ['sticker', 's', 'stiker', 'sgif']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
