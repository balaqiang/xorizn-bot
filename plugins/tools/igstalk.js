const axios = require('axios')
const cheerio = require('cheerio')
const zt = require('../../lib/engine/pulse-zt')

const SRC = 'https://insta-stories-viewer.com'

async function lookup(user) {
  const { data: html } = await axios.get(`${SRC}/${encodeURIComponent(user)}/`, { timeout: 20000, responseType: 'text', maxContentLength: 2 * 1024 * 1024, headers: { 'User-Agent': zt.UA, 'Accept-Language': 'en-US,en;q=0.9' } })
  const $ = cheerio.load(String(html))
  const got = ($('.profile__tabs').first().attr('data-username') || '').trim().toLowerCase()
  if (got !== user) throw new Error('profil tidak ditemukan atau terproteksi')
  const t = (s, max = 1500) => $(s).first().text().replace(/\s+/g, ' ').trim().slice(0, max)
  let pic = ''
  try {
    const u = new URL($('.profile__avatar-pic').first().attr('src')?.trim() || '', SRC)
    if (u.protocol === 'https:') pic = u.href
  } catch {}
  return { user: got, pic, bio: t('.profile__description'), posts: t('.profile__stats-posts', 80), followers: t('.profile__stats-followers', 80), following: t('.profile__stats-follows', 80) }
}

module.exports = {
  name: 'igstalk',
  command: ['igstalk', 'stalkig', 'igprofile', 'igcek'],
  category: 'tools',
  emoji: '📸',
  desc: 'Lihat profil Instagram publik (pengikut, postingan, bio)',
  usage: '<username>',
  run: async ({ sock, msg, from, args, prefix, command, reply }) => {
    const user = zt.input(msg, args).replace(/^@/, '').toLowerCase().split(/\s+/)[0]
    if (!/^[a-z0-9._]{1,30}$/.test(user || '')) return reply(`Masukkan username Instagram.\nContoh: ${prefix}${command} instagram`)
    await reply('⏳ Mencari profil Instagram...')
    try {
      const p = await lookup(user)
      const link = `https://www.instagram.com/${p.user}/`
      await zt.profileCard(sock, from, msg, {
        icon: '📸', eyebrow: 'Profil Instagram', name: `@${p.user}`, sub: 'Data bisa terlambat', photo: p.pic, text: p.bio,
        rows: [['Postingan', p.posts || '-'], ['Pengikut', p.followers || '-'], ['Mengikuti', p.following || '-'], ['Profil', link]],
        copy: [{ label: 'Salin link', value: link }, { label: 'Salin username', value: p.user }]
      })
    } catch (err) {
      console.log('[IGSTALK]', user, err.message)
      await reply('❌ Gagal mengambil profil. Data mungkin belum tersedia atau sumber sedang bermasalah.')
    }
  }
}
