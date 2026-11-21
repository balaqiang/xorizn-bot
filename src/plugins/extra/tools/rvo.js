
let handler = async (m, { sock, conn, usedPrefix, command }) => {
  const client = conn || sock
  const quoted = m.quoted

  if (!quoted) {
    return m.reply(`Balas (reply) pesan View Once (sekali lihat) dengan:\n${usedPrefix}${command}`)
  }

  let buffer
  try {
    buffer = typeof quoted.download === 'function' ? await quoted.download() : null
  } catch (e) {
    return m.reply(`Gagal mengunduh pesan View Once: ${e.message || e}`)
  }

  if (!buffer || !Buffer.isBuffer(buffer)) {
    return m.reply('Gagal membaca media View Once. Pastikan Anda membalas pesan View Once!')
  }

  const mime = quoted.mimetype || ''
  const caption = quoted.caption || quoted.text || ''

  try {
    if (/video/i.test(mime)) {
      return await client.sendMessage(
        m.chat,
        {
          video: buffer,
          caption: caption ? `[RVO]\n${caption}` : '[RVO]',
          mimetype: mime
        },
        { quoted: m.raw }
      )
    }

    if (/audio/i.test(mime)) {
      return await client.sendMessage(
        m.chat,
        {
          audio: buffer,
          mimetype: mime,
          ptt: false
        },
        { quoted: m.raw }
      )
    }

    return await client.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: caption ? `[RVO]\n${caption}` : '[RVO]',
        mimetype: mime || 'image/jpeg'
      },
      { quoted: m.raw }
    )
  } catch (e) {
    return m.reply(`Gagal mengirim kembali media: ${e.message || e}`)
  }
}

handler.command = ['rvo', 'readviewonce', 'readvo']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
