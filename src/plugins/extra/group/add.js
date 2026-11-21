
let handler = async (m, { conn, text }) => {
  let target = m.quoted
    ? m.quoted.sender
    : text
      ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
      : null

  if (!target || !target.includes('@s.whatsapp.net') || target.length < 15) {
    return m.reply('Masukkan nomor yang valid atau reply pesan orang yang ingin ditambahkan!')
  }

  try {
    let res = await conn.groupParticipantsUpdate(m.chat, [target], 'add')
    let status = res?.[0]?.status

    if (status === '200') {
      await m.reply(`Berhasil menambahkan @${target.split('@')[0]} ke dalam grup.`, {
        mentions: [target]
      })
    } else if (status === '403' || status === '408' || status === '409') {
      let code = await conn.groupInviteCode(m.chat)
      let inviteLink = `https://chat.whatsapp.com/${code}`
      await m.reply(`Tidak dapat menambahkan langsung karena privasi target. Mengirimkan link undangan grup ke nomor tersebut...`)
      await conn.sendMessage(target, {
        text: `Halo! Kamu diundang untuk bergabung ke grup via link undangan berikut:\n${inviteLink}`
      })
    } else {
      await m.reply(`Status penambahan: ${status || 'Diproses'}`)
    }
  } catch (err) {
    await m.reply(`Gagal menambahkan nomor: ${err.message || err}`)
  }
}

handler.help = ['add <nomor>']
handler.tags = ['group']
handler.command = /^(add|tambah|\+)$/i
handler.group = true
handler.admin = true
handler.botadmin = true

export default handler
