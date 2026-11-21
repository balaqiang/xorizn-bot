
let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const input = text || m.quoted?.text || ''

  if (!input.trim()) {
    return m.reply(`Format penggunaan:\n*${usedPrefix + command} <nama | lobby(1-30)>*\n\nContoh:\n*${usedPrefix + command} Kyzz | 5*`)
  }

  const parts = input.split('|').map(s => s.trim()).filter(Boolean)
  const username = parts[0] || 'Kyzz'
  const lobby = parts[1] || '1'

  await m.reply('Sedang membuat fake ff lobby...')

  try {
    const apiUrl = global.API('kyzz', '/api/canvas/fake-ff', {
      username,
      lobby
    }, 'apikey')

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

    const buffer = Buffer.from(await res.arrayBuffer())

    await client.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: `Fake FF Lobby: *${username}* (Lobby ${lobby}) ✨`
      },
      { quoted: m.raw || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : undefined) }
    )
  } catch (err) {
    return m.reply(`Gagal membuat fake ff lobby:\n${err.message || err}`)
  }
}

handler.command = ['fakeff', 'fflobby']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
