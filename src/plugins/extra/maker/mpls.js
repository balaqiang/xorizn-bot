
let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const quoted = m.quoted ? m.quoted : m
  const mime = quoted.mimetype || ''

  if (!mime.startsWith('image/')) {
    return m.reply(`Kirim atau balas (reply) foto dengan caption *${usedPrefix + command}*`)
  }

  await m.reply('Sedang membuat MPLS card...')

  try {
    const buffer = typeof quoted.download === 'function' ? await quoted.download() : await m.download()
    if (!buffer) return m.reply('Gagal mengunduh foto.')

    const formData = new FormData()
    formData.append('image', new Blob([buffer], { type: 'image/jpeg' }), 'image.jpg')
    formData.append('url', '')

    const apiUrl = global.API('kyzz', '/api/canvas/mpls', {}, 'apikey')
    const res = await fetch(apiUrl, { method: 'POST', body: formData })

    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

    const resultBuffer = Buffer.from(await res.arrayBuffer())

    await client.sendMessage(
      m.chat,
      {
        image: resultBuffer,
        caption: 'MPLS Card ✨'
      },
      { quoted: m.raw || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : undefined) }
    )
  } catch (err) {
    return m.reply(`Gagal membuat MPLS:\n${err.message || err}`)
  }
}

handler.command = ['mpls', 'twibbonmpls']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
