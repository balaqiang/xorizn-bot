
let handler = async (m, { conn, args, text }) => {
  let target = m.mentionedJid && m.mentionedJid.length > 0
    ? m.mentionedJid[0]
    : m.quoted
      ? m.quoted.sender
      : text
        ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        : null

  if (!target || !target.includes('@s.whatsapp.net')) {
    return m.reply('Tag, reply pesan, atau masukkan nomor member yang ingin dikeluarkan!')
  }

  let botJid = conn.user?.id ? (await conn.decodeJid(conn.user.id)) : ''
  if (target === botJid) {
    return m.reply('Tidak bisa mengeluarkan bot sendiri.')
  }

  try {
    let res = await conn.groupParticipantsUpdate(m.chat, [target], 'remove')
    if (res && res[0]?.status === '200') {
      await m.reply(`Berhasil mengeluarkan @${target.split('@')[0]} dari grup.`, {
        mentions: [target]
      })
    } else {
      await m.reply(`Berhasil memproses pengeluaran @${target.split('@')[0]}.`, {
        mentions: [target]
      })
    }
  } catch (err) {
    await m.reply(`Gagal mengeluarkan member: ${err.message || err}`)
  }
}

handler.help = ['kick @user']
handler.tags = ['group']
handler.command = /^(kick|tendang|dor)$/i
handler.group = true
handler.admin = true
handler.botadmin = true

export default handler
