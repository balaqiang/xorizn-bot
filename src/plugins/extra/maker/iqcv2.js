
let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const input = text || m.quoted?.text || ''

  if (!input.trim()) {
    return m.reply(`Format penggunaan:\n*${usedPrefix + command} <teks | waktu>*\n\nContoh:\n*${usedPrefix + command} xorizn sigma | 20:00*`)
  }

  const parts = input.split('|').map(s => s.trim()).filter(Boolean)
  const qText = parts[0] || 'xorizn-bot Sigma'
  const qTime = parts[1] || '20:00'

  await m.reply('Sedang membuat IQC Pink...')

  try {
    const apiUrl = global.API('kyzz', '/api/canvas/iqc-pink', {
      text: qText,
      time: qTime
    }, 'apikey')

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

    const buffer = Buffer.from(await res.arrayBuffer())

    await client.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: 'IQC Pink ✨'
      },
      { quoted: m.raw || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : undefined) }
    )
  } catch (err) {
    return m.reply(`Gagal membuat IQC v2:\n${err.message || err}`)
  }
}

handler.command = ['iqcv2', 'iqcpink']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
