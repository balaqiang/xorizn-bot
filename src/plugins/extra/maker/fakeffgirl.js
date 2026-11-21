
let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const input = text || m.quoted?.text || ''

  if (!input.trim()) {
    return m.reply(`Format penggunaan:\n*${usedPrefix + command} <nama | template(1-13)>*\n\nContoh:\n*${usedPrefix + command} Nana | random*`)
  }

  const parts = input.split('|').map(s => s.trim()).filter(Boolean)
  const username = parts[0] || 'Nana'
  const template = parts[1] || 'random'

  await m.reply('Sedang membuat fake ff girl...')

  try {
    const apiUrl = global.API('kyzz', '/api/canvas/ffgirl', {
      username,
      template
    }, 'apikey')

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

    const buffer = Buffer.from(await res.arrayBuffer())

    await client.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: `Fake FF Girl: *${username}* ✨`
      },
      { quoted: m.raw || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : undefined) }
    )
  } catch (err) {
    return m.reply(`Gagal membuat fake ff girl:\n${err.message || err}`)
  }
}

handler.command = ['fakeffgirl', 'fakeffgril', 'ffgirl']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
