
let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const input = text || m.quoted?.text || ''

  if (!input.trim()) {
    return m.reply(`Format penggunaan:\n*${usedPrefix + command} <pertanyaan / teks>*\n\nContoh:\n*${usedPrefix + command} Apa hukumnya menikahi cewek anime?*`)
  }

  await m.reply('Sedang bertanya kepada Pak Ustadz...')

  try {
    const apiUrl = global.API('kyzz', '/api/canvas/pak-ustadz', { text: input.trim() }, 'apikey')
    const res = await fetch(apiUrl)

    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

    const buffer = Buffer.from(await res.arrayBuffer())

    await client.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: 'Tanya Pak Ustadz ✨'
      },
      { quoted: m.raw || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : undefined) }
    )
  } catch (err) {
    return m.reply(`Gagal memproses:\n${err.message || err}`)
  }
}

handler.command = ['pakustad', 'pakustadz', 'tanyapadanya']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
