
let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const saldo = (text || '5000000').trim().replace(/[^0-9]/g, '') || '5000000'

  await m.reply('Sedang membuat fake OVO...')

  try {
    const apiUrl = global.API('kyzz', '/api/canvas/fake-ovo', { saldo }, 'apikey')
    const res = await fetch(apiUrl)

    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

    const buffer = Buffer.from(await res.arrayBuffer())

    await client.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: `Fake OVO: Saldo Rp ${parseInt(saldo).toLocaleString('id-ID')} ✨`
      },
      { quoted: m.raw || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : undefined) }
    )
  } catch (err) {
    return m.reply(`Gagal membuat fake OVO:\n${err.message || err}`)
  }
}

handler.command = ['fakeovo', 'ovofake']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
