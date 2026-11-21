
let handler = async (m, { sock, conn, text, usedPrefix, command }) => {
  const client = conn || sock
  const input = (text || '').trim()

  if (!input) {
    return m.reply(`Harap masukkan teks bio baru!\nContoh:\n${usedPrefix}${command} Bot WhatsApp Multi-Device`)
  }

  try {
    await client.updateProfileStatus(input)
    return m.reply(`✓ Sukses mengubah Bio / Status Bot menjadi:\n"${input}"`)
  } catch (e) {
    return m.reply(`Gagal mengubah Bio Bot:\n${e.message || e}`)
  }
}

handler.command = ['setbio', 'setstatus', 'setstatusbot', 'setbiobot']
handler.owner = true
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
