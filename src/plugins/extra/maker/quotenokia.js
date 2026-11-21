
let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const input = text || m.quoted?.text || ''

  if (!input.trim()) {
    return m.reply(`Format penggunaan:\n*${usedPrefix + command} <pesan | sender | tanggal | waktu>*\n\nContoh:\n*${usedPrefix + command} Jangan menyerah | Kyzz | 06/05/2025 | 20:00*`)
  }

  const parts = input.split('|').map(s => s.trim()).filter(Boolean)
  const message = parts[0] || 'Jangan pernah menyerah'
  const sender = parts[1] || m.pushName || 'Kyzz'
  const date = parts[2] || '06/05/2025'
  const time = parts[3] || '20:00'

  await m.reply('Sedang membuat quote nokia...')

  try {
    const apiUrl = global.API('kyzz', '/api/canvas/quote-nokia', {
      message,
      sender,
      date,
      time
    }, 'apikey')

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

    const buffer = Buffer.from(await res.arrayBuffer())

    await client.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: 'Nokia Quote ✨'
      },
      { quoted: m.raw || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : undefined) }
    )
  } catch (err) {
    return m.reply(`Gagal membuat quote nokia:\n${err.message || err}`)
  }
}

handler.command = ['quotenokia', 'nokiatro', 'nokiaquote']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
