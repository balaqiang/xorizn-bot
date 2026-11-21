
let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const input = text || m.quoted?.text || ''

  if (!input.trim()) {
    return m.reply(`Format penggunaan:\n*${usedPrefix + command} <nama / teks>*\n\nContoh:\n*${usedPrefix + command} Pemain Epep Tolol*`)
  }

  await m.reply('Sedang membuat sertifikat tolol...')

  try {
    const apiUrl = global.API('kyzz', '/api/canvas/sertifikat-tolol', { name: input.trim() }, 'apikey')
    const res = await fetch(apiUrl)

    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

    const buffer = Buffer.from(await res.arrayBuffer())

    await client.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: `Sertifikat Tolol: *${input.trim()}* 😹`
      },
      { quoted: m.raw || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : undefined) }
    )
  } catch (err) {
    return m.reply(`Gagal membuat sertifikat tolol:\n${err.message || err}`)
  }
}

handler.command = ['sertifikattolol', 'sertitolol']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
