
import { ephoto } from '../../../scrape/ephoto.js'

let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const input = text || m.quoted?.text || ''

  if (!input.trim()) {
    return m.reply(`Format penggunaan:\n*${usedPrefix + command} <teks>*\n\nContoh:\n*${usedPrefix + command} xorizn-bot*`)
  }

  await m.reply('Sedang membuat efek ${item.name}... Mohon tunggu sebentar.')

  try {
    const res = await ephoto('${item.url}', [input.trim()])
    if (!res?.buffer) throw new Error('Gagal mendapatkan gambar dari Ephoto360')

    await client.sendMessage(
      m.chat,
      {
        image: res.buffer,
        caption: `Berhasil membuat efek *${item.name}* ✨`
      },
      { quoted: m.raw || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : undefined) }
    )
  } catch (err) {
    return m.reply(`Gagal memproses efek:\n${err.message || err}`)
  }
}

handler.command = ['horror']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
