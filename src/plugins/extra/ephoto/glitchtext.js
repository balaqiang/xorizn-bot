
import { ephoto } from '../../../scrape/ephoto.js'

let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const input = text || m.quoted?.text || ''

  if (!input.trim()) {
    return m.reply(`Format penggunaan:\n*${usedPrefix + command} <teks1 | teks2>*\n\nContoh:\n*${usedPrefix + command} xorizn-bot | MD*`)
  }

  const parts = input.split('|').map(s => s.trim()).filter(Boolean)
  const textArr = parts.length > 1 ? [parts[0], parts.slice(1).join(' ')] : [parts[0], '']

  await m.reply('Sedang membuat efek ${item.name}... Mohon tunggu sebentar.')

  try {
    const res = await ephoto('${item.url}', textArr)
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

handler.command = ['glitchtext']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
