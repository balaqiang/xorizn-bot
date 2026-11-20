const axios = require('axios')
const zt = require('../../lib/engine/pulse-zt')

const wib = (iso) => (iso ? new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }) : '-')

module.exports = {
  name: 'githubstalk',
  command: ['githubstalk', 'ghstalk', 'stalkgithub'],
  category: 'tools',
  emoji: '🐙',
  desc: 'Lihat profil & statistik akun GitHub',
  usage: '<username>',
  run: async ({ sock, msg, from, args, prefix, reply }) => {
    const user = zt.input(msg, args).replace(/^@/, '').split(/\s+/)[0]
    if (!/^[A-Za-z0-9-]{1,39}$/.test(user || '')) return reply(`Masukkan username GitHub.\nContoh: ${prefix}githubstalk torvalds`)
    await reply('⏳ Mencari akun GitHub...')
    try {
      const { data: d } = await axios.get(`https://api.github.com/users/${encodeURIComponent(user)}`, { headers: { 'User-Agent': 'vanXone-Bot', Accept: 'application/vnd.github.v3+json' }, timeout: 20000, validateStatus: (s) => s < 500 })
      if (d.message === 'Not Found') return reply(`❌ Akun GitHub *${user}* tidak ditemukan.`)
      if (!d.login) throw new Error(d.message || 'respons GitHub tidak valid')
      await zt.profileCard(sock, from, msg, {
        icon: '🐙', eyebrow: 'Profil GitHub', name: d.name || d.login, sub: `@${d.login}`, photo: d.avatar_url, text: d.bio || '',
        rows: [['Perusahaan', d.company], ['Lokasi', d.location], ['Website', d.blog], ['Repo publik', zt.n(d.public_repos)], ['Gist', zt.n(d.public_gists)], ['Pengikut', zt.n(d.followers)], ['Mengikuti', zt.n(d.following)], ['Dibuat', wib(d.created_at)], ['Update', wib(d.updated_at)], ['Profil', d.html_url]],
        copy: [{ label: 'Salin link', value: d.html_url }]
      })
    } catch (err) {
      await reply(`❌ Gagal mengambil data GitHub: ${err.message}`)
    }
  }
}
