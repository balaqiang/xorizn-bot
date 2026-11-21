
let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const quoted = m.quoted ? m.quoted : m
  const mime = quoted.mimetype || ''

  const parts = (text || quoted.text || '').split('|').map(s => s.trim()).filter(Boolean)
  const qText = parts[0] || 'Halo apa kabar'
  const qTime = parts[1] || 'SAB 15.28'

  await m.reply('Sedang membuat IG Quote Card...')

  try {
    const formData = new FormData()
    if (mime.startsWith('image/')) {
      const buffer = typeof quoted.download === 'function' ? await quoted.download() : await m.download()
      if (buffer) {
        formData.append('image', new Blob([buffer], { type: 'image/jpeg' }), 'image.jpg')
      }
    }
    formData.append('text', qText)
    formData.append('time', qTime)

    const apiUrl = global.API('kyzz', '/api/canvas/igqc', {}, 'apikey')
    const res = await fetch(apiUrl, { method: 'POST', body: formData })

    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

    const buffer = Buffer.from(await res.arrayBuffer())

    await client.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: 'IG Quote Card ✨'
      },
      { quoted: m.raw || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : undefined) }
    )
  } catch (err) {
    return m.reply(`Gagal membuat IG Quote:\n${err.message || err}`)
  }
}

handler.command = ['igqc']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
