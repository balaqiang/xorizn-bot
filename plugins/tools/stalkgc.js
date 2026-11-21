const zt = require('../../lib/engine/pulse-zt')

module.exports = {
  name: 'stalkgc',
  command: ['stalkgc', 'stalkgroup'],
  category: 'tools',
  emoji: '👥',
  desc: 'Lihat info grup WhatsApp dari link undangannya',
  usage: '<link grup>',
  run: async ({ sock, msg, from, args, prefix, reply }) => {
    const code = (zt.input(msg, args).match(/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i) || [])[1]
    if (!code) return reply(`Masukkan link grup WhatsApp.\nContoh: ${prefix}stalkgc https://chat.whatsapp.com/xxxx`)
    await reply('⏳ Membaca info grup...')
    try {
      const r = await sock.groupGetInviteInfo(code)
      const owner = r.owner ? `@${r.owner.split('@')[0].split(':')[0]}` : 'Disembunyikan'
      const made = r.creation ? new Date(r.creation * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'
      await zt.profileCard(sock, from, msg, {
        icon: '👥', eyebrow: 'Info Grup', name: r.subject, sub: `${zt.n(r.size)} anggota`, text: r.desc || '',
        rows: [['Pembuat', owner], ['Dibuat', made], ['Anggota', zt.n(r.size)], ['ID', r.id], ['Link', `https://chat.whatsapp.com/${code}`]],
        copy: [{ label: 'Salin link', value: `https://chat.whatsapp.com/${code}` }]
      })
    } catch (err) {
      console.log('[STALKGC]', err.message)
      await reply('❌ Gagal membaca grup. Link mungkin sudah kedaluwarsa, di-reset, atau dibatalkan admin.')
    }
  }
}
