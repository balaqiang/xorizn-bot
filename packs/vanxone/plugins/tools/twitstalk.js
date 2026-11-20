const axios = require('axios')
const zt = require('../../lib/engine/pulse-zt')

// Butuh apikey kyzz: isi global.apiKeys = { kyzz: '...' } di settings.js
module.exports = {
  name: 'twitstalk',
  command: ['twitstalk', 'twitterstalk', 'xstalk', 'stalktwitter', 'stalkx'],
  category: 'tools',
  emoji: '🐦',
  desc: 'Lihat profil akun Twitter/X',
  usage: '<username>',
  run: async ({ sock, msg, from, args, prefix, reply }) => {
    const user = zt.input(msg, args).replace(/^@/, '').split(/\s+/)[0]
    if (!/^\w{1,15}$/.test(user || '')) return reply(`Masukkan username Twitter/X.\nContoh: ${prefix}twitstalk elonmusk`)
    const key = global.apiKeys?.kyzz
    if (!key) return reply('❌ Fitur ini butuh apikey kyzz. Owner: isi `global.apiKeys = { kyzz: "..." }` di settings.js.')
    await reply('⏳ Mencari akun Twitter/X...')
    try {
      const { data } = await axios.get('https://api.kyzzz.xyz/api/stalker/twitter', { params: { username: user, apikey: key }, headers: { 'User-Agent': zt.UA }, timeout: 30000 })
      if (!data?.status || !data?.result) return reply(`❌ Akun *@${user}* tidak ditemukan.`)
      const p = data.result.profile || data.result
      const handle = p.handle || p.username || user
      const avatar = String(p.avatar || p.profile_image_url || p.image || '').replace('_normal.', '.')
      await zt.profileCard(sock, from, msg, {
        icon: '🐦', eyebrow: 'Profil Twitter / X', name: p.name || handle, sub: `@${handle}`, photo: avatar, text: p.bio || '',
        chips: p.isVerified || p.verified ? ['✅ Terverifikasi'] : [],
        rows: [['Lokasi', p.location], ['Pengikut', zt.n(p.followers)], ['Mengikuti', zt.n(p.following)], ['Profil', `https://x.com/${handle}`]],
        copy: [{ label: 'Salin link', value: `https://x.com/${handle}` }]
      })
    } catch (err) {
      await reply(`❌ Gagal mengambil profil: ${err.response?.data?.message || err.message}`)
    }
  }
}
