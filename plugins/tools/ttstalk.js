const axios = require('axios')
const zt = require('../../lib/engine/pulse-zt')

module.exports = {
  name: 'ttstalk',
  command: ['ttstalk', 'tiktokstalk', 'stalktt'],
  category: 'tools',
  emoji: '🎵',
  desc: 'Lihat profil & statistik akun TikTok',
  usage: '<username>',
  run: async ({ sock, msg, from, args, prefix, reply }) => {
    const user = zt.input(msg, args).replace(/^@/, '').split(/\s+/)[0]
    if (!/^[\w.]{1,40}$/.test(user || '')) return reply(`Masukkan username TikTok.\nContoh: ${prefix}ttstalk tiktok`)
    await reply('⏳ Mencari akun TikTok...')
    try {
      const { data } = await axios.get('https://api.deline.web.id/stalker/ttstalk', { params: { username: user }, headers: { 'User-Agent': zt.UA }, timeout: 25000 })
      if (!data?.status || !data?.result) return reply(`❌ Akun TikTok *${user}* tidak ditemukan.`)
      const u = data.result.user || {}
      const s = data.result.stats || {}
      await zt.profileCard(sock, from, msg, {
        icon: '🎵', eyebrow: 'Profil TikTok', name: u.nickname || user, sub: `@${u.uniqueId || user}`, photo: u.avatarLarger || u.avatarMedium || u.avatarThumb, text: u.signature || '',
        chips: [u.verified ? '✅ Terverifikasi' : '', u.privateAccount ? '🔒 Privat' : ''].filter(Boolean),
        rows: [['Region', u.region], ['Pengikut', zt.n(s.followerCount)], ['Mengikuti', zt.n(s.followingCount)], ['Total like', zt.n(s.heartCount)], ['Total video', zt.n(s.videoCount)], ['Profil', `https://www.tiktok.com/@${u.uniqueId || user}`]],
        copy: [{ label: 'Salin link', value: `https://www.tiktok.com/@${u.uniqueId || user}` }]
      })
    } catch (err) {
      await reply(`❌ Gagal mengambil profil TikTok: ${err.response?.data?.message || err.message}`)
    }
  }
}
