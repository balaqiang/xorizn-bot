
let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const quoted = m.quoted ? m.quoted : m
  const mime = quoted.mimetype || ''

  if (!mime.startsWith('image/')) {
    return m.reply(`Kirim atau balas (reply) foto dengan caption:\n*${usedPrefix + command} <nama | durasi>*\n\nContoh:\n*${usedPrefix + command} My Heart ❤️ | 01:00:39*`)
  }

  const parts = (text || '').split('|').map(s => s.trim()).filter(Boolean)
  const name = parts[0] || 'My Heart ❤️'
  const duration = parts[1] || '01:00:39'

  await m.reply('Sedang membuat fake call...')

  try {
    const buffer = typeof quoted.download === 'function' ? await quoted.download() : await m.download()
    if (!buffer) return m.reply('Gagal mengunduh foto.')

    const formData = new FormData()
    formData.append('profile', new Blob([buffer], { type: 'image/jpeg' }), 'profile.jpg')
    formData.append('nama', name)
    formData.append('durasi', duration)

    const apiUrl = global.API('kyzz', '/api/canvas/fake-call', {}, 'apikey')
    const res = await fetch(apiUrl, { method: 'POST', body: formData })

    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

    const resultBuffer = Buffer.from(await res.arrayBuffer())

    await client.sendMessage(
      m.chat,
      {
        image: resultBuffer,
        caption: `Fake Call: *${name}* (${duration}) ✨`
      },
      { quoted: m.raw || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : undefined) }
    )
  } catch (err) {
    return m.reply(`Gagal membuat fake call:\n${err.message || err}`)
  }
}

handler.command = ['fakecall', 'callfake']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
