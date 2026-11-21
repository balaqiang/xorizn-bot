// .instalookup — profil Instagram publik dari Insta Stories Viewer (data bisa terlambat / berupa cache)
// Sumber ide: RennZSync. Perintah `igstalk` sudah dipakai plugin lain, jadi di sini: instalookup / igprofil.
const cheerio = require('cheerio')
const richui = require('../../lib/richui')
const { fetchPublic } = require('../../lib/safeurl')

const SOURCE = 'https://insta-stories-viewer.com'

async function lookup(username) {
  const src = `${SOURCE}/${encodeURIComponent(username)}/`
  const { buffer } = await fetchPublic(src, { maxBytes: 2 * 1024 * 1024, timeout: 20000, headers: { Accept: 'text/html', 'Accept-Language': 'en-US,en;q=0.9' } })
  const $ = cheerio.load(buffer.toString('utf8'))
  const got = ($('.profile__tabs').first().attr('data-username') || '').trim().toLowerCase()
  if (got !== username) throw new Error('profil belum tersedia / butuh verifikasi browser')
  const t = (sel, n = 1500) => $(sel).first().text().replace(/\s+/g, ' ').trim().slice(0, n)
  let pic = ''
  const raw = $('.profile__avatar-pic').first().attr('src')?.trim()
  if (raw) {
    try {
      const u = new URL(raw, src)
      if (u.protocol === 'https:' && !u.username && !u.password) pic = u.href
    } catch {}
  }
  return { username: got, url: `https://www.instagram.com/${got}/`, pic, bio: t('.profile__description'), posts: t('.profile__stats-posts', 80), followers: t('.profile__stats-followers', 80), following: t('.profile__stats-follows', 80) }
}

module.exports = {
  name: 'instalookup',
  command: ['instalookup', 'instalookupai', 'igprofil'],
  category: 'tools',
  emoji: '🔎',
  desc: 'Lihat profil Instagram publik (pengikut, postingan, bio)',
  usage: '<username>',
  run: async ({ sock, msg, from, args, prefix, command, reply }) => {
    const username = String(args[0] || '').replace(/^@/, '').toLowerCase()
    if (!username) return reply(`Masukkan username Instagram.\nContoh: ${prefix}${command} rennz_dev`)
    if (!/^[a-z0-9._]{1,30}$/.test(username) || username.startsWith('.') || username.endsWith('.') || username.includes('..')) {
      return reply('Username tidak valid. Kirim username saja, bukan link atau teks tambahan.')
    }
    let p
    try {
      p = await lookup(username)
    } catch (err) {
      console.log('[INSTALOOKUP]', username, err.message)
      return reply('❌ Gagal mengambil profil. Data mungkin belum tersedia, sumber sedang bermasalah, atau butuh verifikasi browser. Coba lagi nanti.')
    }
    let photo = null
    if (p.pic) {
      try {
        const r = await fetchPublic(p.pic, { maxBytes: 5 * 1024 * 1024, timeout: 20000 })
        if (/^image\//i.test(r.contentType)) photo = r.buffer
      } catch {}
    }
    const rows = [['Postingan', p.posts || '-'], ['Pengikut', p.followers || '-'], ['Mengikuti', p.following || '-'], ['Profil', p.url]]
    const caption = [`🔎 PROFIL INSTAGRAM`, `Username: @${p.username}`, ...rows.map(([k, v]) => `${k}: ${v}`), p.bio ? `\nBio: ${p.bio.slice(0, 500)}` : '', '\nData dari Insta Stories Viewer, bisa terlambat.'].join('\n')
    await richui.sendEntity(
      sock,
      from,
      { icon: '🔎', eyebrow: 'Profil Instagram', name: `@${p.username}`, sub: 'Insta Stories Viewer • data bisa terlambat', avatar: photo ? await richui.avatarUri(photo) : '', text: p.bio.slice(0, 400), rows: rows.map(([k, v]) => ({ k, v })) },
      { quoted: msg, buffer: photo, caption, copy: [{ label: 'Salin link', value: p.url }, { label: 'Salin username', value: p.username }] }
    )
  }
}
