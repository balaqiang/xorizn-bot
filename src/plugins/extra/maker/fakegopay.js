
let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const parts = (text || '').split('|').map(s => s.trim()).filter(Boolean)

  const saldo = parts[0] || '890000'
  const koin = parts[1] || '159'
  const terpakai = parts[2] || '50000'
  const bulan = parts[3] || 'Mei'

  await m.reply('Sedang membuat fake gopay...')

  try {
    const apiUrl = global.API('kyzz', '/api/canvas/fake-gopay', {
      saldo,
      koin,
      terpakai,
      bulan
    }, 'apikey')

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

    const buffer = Buffer.from(await res.arrayBuffer())

    await client.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: `Fake GoPay: Saldo Rp ${saldo} | Koin ${koin} ✨`
      },
      { quoted: m.raw || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : undefined) }
    )
  } catch (err) {
    return m.reply(`Gagal membuat fake gopay:\n${err.message || err}`)
  }
}

handler.command = ['fakegopay', 'gopayfake']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
