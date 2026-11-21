
import sharp from 'sharp'

let handler = async (m, { sock, conn, usedPrefix, command }) => {
  const client = conn || sock
  const quoted = m.quoted || m
  const mime = quoted.mimetype || m.mimetype || ''

  if (!/webp/i.test(mime)) {
    return m.reply(`Balas (reply) stiker statis dengan command:\n${usedPrefix}${command}`)
  }

  let buffer
  try {
    buffer = typeof quoted.download === 'function' ? await quoted.download() : await m.download()
  } catch (e) {
    return m.reply(`Gagal mengunduh stiker: ${e.message || e}`)
  }

  if (!buffer || !Buffer.isBuffer(buffer)) {
    return m.reply('Buffer stiker tidak valid.')
  }

  try {
    const pngBuffer = await sharp(buffer).png().toBuffer()
    return await client.sendMessage(
      m.chat,
      {
        image: pngBuffer,
        caption: '✓ Konversi Stiker ke Gambar Sukses'
      },
      { quoted: m.raw }
    )
  } catch (e) {
    return m.reply(`Gagal mengonversi stiker ke gambar: ${e.message || e}`)
  }
}

handler.command = ['toimg', 'toimage', 'topng']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
