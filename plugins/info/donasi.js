module.exports = {
  name: 'donasi', command: ['donasi', 'support', 'dukung'], category: 'info', emoji: '💝', desc: 'Dukung pengembangan bot', usage: '',
  run: async ({ config, reply }) => {
    const L = config.links || {}
    await reply(['💝 *DUKUNG VANXONE*', '', 'Terima kasih sudah memakai bot ini! Dukunganmu membuat server tetap menyala dan fitur terus bertambah.', '', `▬ *Kontak owner:* ${L.wa || '-'}`, `▬ *Telegram:* ${L.tg || '-'}`, `▬ *Instagram:* ${L.ig || '-'}`, '', '_Bisa juga dengan membagikan bot ke teman-temanmu 🙌_'].join('\n'))
  }
}
