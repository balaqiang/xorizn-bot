module.exports = {
  name: 'infogc',
  command: ['infogrup'],
  category: 'group',
  desc: 'Info grup',
  group: true,
  run: async ({ sock, from, reply }) => {
    const m = await sock.groupMetadata(from)
    const admins = m.participants.filter((p) => p.admin).length
    const created = m.creation
      ? new Date(m.creation * 1000).toLocaleDateString('id-ID', {
          timeZone: 'Asia/Jakarta',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : '-'

    await reply(
      [
        '*INFO GRUP*',
        '',
        `▬ *Nama:* ${m.subject}`,
        `▬ *Dibuat:* ${created}`,
        `▬ *Member:* ${m.participants.length}`,
        `▬ *Admin:* ${admins}`,
        `▬ *Kirim pesan:* ${m.announce ? 'Hanya admin' : 'Semua member'}`,
        `▬ *Deskripsi:* ${m.desc || '-'}`
      ].join('\n')
    )
  }
}
