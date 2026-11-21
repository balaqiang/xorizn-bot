
let handler = async (m, { conn, text }) => {
  let target = m.mentionedJid && m.mentionedJid.length > 0
    ? m.mentionedJid[0]
    : m.quoted
      ? m.quoted.sender
      : text
        ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        : null

  if (!target || !target.includes('@s.whatsapp.net')) {
    return m.reply('Tag, reply pesan, atau masukkan nomor member yang ingin dinaikkan menjadi admin!')
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [target], 'promote')
    await m.reply(`Berhasil menaikkan jabatan @${target.split('@')[0]} menjadi Admin Grup.`, {
      mentions: [target]
    })
  } catch (err) {
    await m.reply(`Gagal menaikkan jabatan: ${err.message || err}`)
  }
}

handler.help = ['promote @user']
handler.tags = ['group']
handler.command = /^(promote|admin)$/i
handler.group = true
handler.admin = true
handler.botadmin = true

export default handler
