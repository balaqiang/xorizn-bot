
let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const input = text || m.quoted?.text || ''

  if (!input.trim()) {
    return m.reply(`Format penggunaan:\n*${usedPrefix + command} <teks | nama | background(1-10)>*\n\nContoh:\n*${usedPrefix + command} Semua manusia hanyalah alat | xorizn-bot | 1*`)
  }

  const parts = input.split('|').map(s => s.trim()).filter(Boolean)
  const qText = parts[0] || input.trim()
  const qName = parts[1] || m.pushName || 'User'
  const qBg = parts[2] || Math.floor(Math.random() * 10) + 1

  await m.reply('Sedang membuat anime quote...')

  try {
    const apiUrl = global.API('kyzz', '/api/canvas/anime-quotes', {
      text: qText,
      username: qName,
      background: qBg
    }, 'apikey')

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

    const buffer = Buffer.from(await res.arrayBuffer())

    await client.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: 'Anime Quote ✨'
      },
      { quoted: m.raw || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : undefined) }
    )
  } catch (err) {
    return m.reply(`Gagal membuat anime quote:\n${err.message || err}`)
  }
}

handler.command = ['animequote', 'animequotes']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
