
let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const saldo = (text || '150000').trim().replace(/[^0-9]/g, '') || '150000'

  await m.reply('Sedang membuat bukti fake dana...')

  try {
    const apiUrl = global.API('kyzz', '/api/canvas/fake-dana', { saldo }, 'apikey')
    const res = await fetch(apiUrl)

    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

    const buffer = Buffer.from(await res.arrayBuffer())

    await client.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: `Fake Dana (Rp ${parseInt(saldo).toLocaleString('id-ID')}) ✨`
      },
      { quoted: m.raw || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : undefined) }
    )
  } catch (err) {
    return m.reply(`Gagal membuat fake dana:\n${err.message || err}`)
  }
}

handler.command = ['fakedana', 'dananotif']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
