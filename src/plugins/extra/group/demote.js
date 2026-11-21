
let handler = async (m, { conn, text }) => {
  let target = m.mentionedJid && m.mentionedJid.length > 0
    ? m.mentionedJid[0]
    : m.quoted
      ? m.quoted.sender
      : text
        ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        : null

  if (!target || !target.includes('@s.whatsapp.net')) {
    return m.reply('Tag, reply pesan, atau masukkan nomor admin yang ingin diturunkan!')
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [target], 'demote')
    await m.reply(`Berhasil menurunkan jabatan @${target.split('@')[0]} menjadi Member biasa.`, {
      mentions: [target]
    })
  } catch (err) {
    await m.reply(`Gagal menurunkan jabatan: ${err.message || err}`)
  }
}

handler.help = ['demote @user']
handler.tags = ['group']
handler.command = /^(demote|unadmin)$/i
handler.group = true
handler.admin = true
handler.botadmin = true

export default handler
