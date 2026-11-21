const { userOf } = require('../../lib/utils')

const last = new Map() // anti-spam laporan

module.exports = {
  name: 'report',
  command: ['report', 'lapor', 'bug', 'saran'],
  category: 'info',
  desc: 'Kirim laporan bug/saran ke owner',
  usage: '<pesan>',
  run: async ({ sock, from, sender, isGroup, text, config, prefix, reply }) => {
    if (text.length < 5) return reply(`Tulis laporanmu.\nContoh: ${prefix}report fitur ssweb tidak jalan`)
    if (text.length > 1000) return reply('Laporan maksimal 1000 karakter.')

    const wait = (last.get(sender) || 0) + 60000 - Date.now()
    if (wait > 0) return reply(`Tunggu ${Math.ceil(wait / 1000)} detik sebelum mengirim laporan lagi.`)
    last.set(sender, Date.now())

    let where = 'chat pribadi'
    if (isGroup) {
      try { where = `grup ${(await sock.groupMetadata(from)).subject}` } catch { where = 'grup' }
    }
    await sock.sendMessage(`${config.ownerNumber}@s.whatsapp.net`, {
      text: `📩 *LAPORAN BARU*\n\n▬ *Dari:* @${userOf(sender)}\n▬ *Lokasi:* ${where}\n\n${text}`,
      mentions: [sender]
    })
    await reply('Laporanmu sudah dikirim ke owner. Terima kasih!')
  }
}
