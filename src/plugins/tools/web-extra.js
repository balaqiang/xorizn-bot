// plugins/tools/web-extra.js — pencarian & info internet: playstore, happymod, webtoon, douyin, grup WA, applemusic, jobstreet, gambar, berita, KBBI, doa, wikipedia ID, lirik
const axios = require('axios')
const zt = require('../../lib/engine/pulse-zt')

const DL = 'https://api.deline.web.id'
const FAA = 'https://api-faa.my.id'
const fail = (m) => Object.assign(new Error(m), { userMessage: m })
const get = async (url, params) => (await axios.get(url, { params, headers: { 'User-Agent': zt.UA }, timeout: 30000 })).data

const arr = (d) => {
  for (const k of ['data', 'result', 'results', 'items', 'list']) { const v = d?.[k]; if (Array.isArray(v)) return v; if (v && typeof v === 'object') { const r = arr(v); if (r.length) return r } }
  return Array.isArray(d) ? d : []
}
const pick = (o, keys) => { for (const k of keys) if (o?.[k] !== undefined && o[k] !== null && o[k] !== '' && typeof o[k] !== 'object') return String(o[k]) }
const TITLE = ['title', 'name', 'judul', 'nama', 'position', 'headline', 'trackName', 'app_name']
const LINKK = ['link', 'url', 'href', 'permalink']
const EXTRA = { author: 'Pembuat', developer: 'Developer', company: 'Perusahaan', location: 'Lokasi', rating: 'Rating', genre: 'Genre', size: 'Ukuran', version: 'Versi', date: 'Tanggal', time: 'Waktu', artist: 'Artis', salary: 'Gaji', description: 'Deskripsi', desc: 'Deskripsi', snippet: 'Ringkasan' }

function listCard(head, items, tip) {
  const rows = items.slice(0, 10).map((it, i) => {
    const t = pick(it, TITLE) || '(tanpa judul)'
    const extra = Object.entries(EXTRA).map(([k, l]) => pick(it, [k]) && `   ▬ ${l}: ${String(pick(it, [k])).slice(0, 90)}`).filter(Boolean).filter((v, idx, a) => a.indexOf(v) === idx).slice(0, 4)
    const link = pick(it, LINKK)
    return [`${i + 1}. *${t}*`, ...extra, link && `   🔗 ${link}`].filter(Boolean).join('\n')
  })
  return [head, '', ...rows, tip ? `\n💡 ${tip}` : ''].join('\n')
}

const SEARCH = {
  playstoresearch: ['playstore', '🤖 PLAY STORE', 'aplikasi', ['playstore', 'pssearch', 'searchplaystore']],
  happymodsearch: ['happymod', '🎮 HAPPYMOD', 'game/aplikasi mod', ['happymod2']],
  webtoonsearch: ['webtoon', '📚 WEBTOON', 'komik', ['wtsearch']],
  douyinsearch: ['douyin', '🎬 DOUYIN', 'video douyin', ['dysearch']],
  grupwasearch: ['grubwa', '👥 GRUP WHATSAPP', 'nama grup', ['carigrup', 'searchgrupwa']],
  applemusicsearch: ['applemusic', '🍎 APPLE MUSIC', 'lagu/artis', ['amsearch']],
  jobstreetsearch: ['jobstreet', '💼 LOWONGAN KERJA', 'posisi kerja', ['lowongan', 'carikerja']]
}
const NEWS = { antara: ['/berita/antara', '📰 ANTARA NEWS'], cnbc: ['/berita/cnbc', '💹 CNBC INDONESIA'] }

const OTHER = {
  gimg: async ({ sock, from, msg }, q) => {
    const d = await get(`${FAA}/faa/google-image`, { query: q })
    const urls = arr(d).map((x) => (typeof x === 'string' ? x : pick(x, ['url', 'image', 'link']))).filter((u) => /^https?:\/\//.test(u || ''))
    if (!urls.length) throw fail(`Gambar "${q}" tidak ditemukan.`)
    let ok = 0
    for (const u of urls.slice(0, 5)) { try { await zt.sendUrl(sock, from, msg, u, { kind: 'image', filename: 'gimg.jpg', caption: ok ? undefined : `🖼️ *${q}*` }); ok++ } catch {} }
    if (!ok) throw fail('Semua gambar gagal diunduh, coba kata kunci lain.')
  },
  kbbi: async ({ reply }, q) => {
    const d = await get(`${FAA}/faa/kbbi`, { q })
    const r = d?.result ?? d?.data
    if (!r || (Array.isArray(r) && !r.length)) throw fail(`Kata "${q}" tidak ada di KBBI.`)
    const txt = typeof r === 'string' ? r : Array.isArray(r) ? r.map((x, i) => `${i + 1}. ${typeof x === 'string' ? x : JSON.stringify(x)}`).join('\n') : Object.entries(r).map(([k, v]) => `▬ *${k}:* ${typeof v === 'object' ? JSON.stringify(v) : v}`).join('\n')
    return reply(`📖 *KBBI: ${q}*\n\n${txt.slice(0, 3000)}`)
  },
  doa: async ({ reply }, q) => {
    const d = await get(`${FAA}/faa/doa`, { q })
    const r = arr(d)[0] || d?.result
    if (!r || typeof r !== 'object') throw fail(`Doa "${q}" tidak ditemukan.`)
    const t = pick(r, ['judul', 'title', 'name', 'doa'])
    return reply([`🤲 *${t || 'DOA'}*`, '', pick(r, ['arab', 'ayat', 'arabic']), '', pick(r, ['latin', 'transliteration']) && `_${pick(r, ['latin', 'transliteration'])}_`, '', pick(r, ['artinya', 'arti', 'indo', 'terjemah', 'translation']) && `📝 ${pick(r, ['artinya', 'arti', 'indo', 'terjemah', 'translation'])}`].filter((x) => x !== undefined && x !== null && x !== false).join('\n'))
  },
  wikiid: async ({ reply }, q) => {
    const d = await get('https://id.wikipedia.org/w/api.php', { action: 'query', format: 'json', prop: 'extracts|info', exintro: 1, explaintext: 1, inprop: 'url', redirects: 1, titles: q, origin: '*' })
    const p = Object.values(d?.query?.pages || {})[0]
    if (!p || p.missing !== undefined || !p.extract) throw fail(`"${q}" tidak ditemukan di Wikipedia Indonesia.`)
    return reply(`📚 *${p.title}*\n\n${p.extract.slice(0, 1800)}${p.extract.length > 1800 ? '…' : ''}\n\n🔗 ${p.fullurl}`)
  },
  lirik: async ({ reply }, q) => {
    const d = await get('https://lrclib.net/api/search', { q })
    const t = (Array.isArray(d) ? d : []).find((x) => x.plainLyrics)
    if (!t) throw fail(`Lirik "${q}" tidak ditemukan.`)
    const lyr = t.plainLyrics.trim()
    return reply(`🎵 *${t.trackName}*\n👤 ${t.artistName}${t.albumName ? `\n💿 ${t.albumName}` : ''}\n\n${lyr.slice(0, 3500)}${lyr.length > 3500 ? '\n…' : ''}`)
  }
}
const OTHER_ALIAS = { googleimage: 'gimg', gambar: 'gimg', kamus: 'kbbi', doaharian: 'doa', wikipediaid: 'wikiid', wikiindo: 'wikiid', liriklagu: 'lirik', lyrics: 'lirik' }

const ALIAS = {}
const NAMES = new Set([...Object.keys(OTHER), ...Object.keys(OTHER_ALIAS), ...Object.keys(NEWS), ...Object.keys(SEARCH)])
for (const [k, v] of Object.entries(SEARCH)) for (const a of v[3]) { ALIAS[a] = k; NAMES.add(a) }
const DESCR = { gimg: 'Cari & kirim gambar Google', kbbi: 'Arti kata KBBI', doa: 'Cari doa harian', wikiid: 'Ringkasan Wikipedia Indonesia', lirik: 'Cari lirik lagu' }

module.exports = {
  name: 'web-extra',
  command: [...NAMES],
  category: 'tools',
  emoji: '🌐',
  desc: 'Pencarian: playstore, happymod, webtoon, jobstreet, applemusic, grup WA, gambar, berita, KBBI, doa, wikiid, lirik',
  usage: '<kata kunci>',
  run: async (ctx) => {
    const { msg, args, command, prefix, reply } = ctx
    const c0 = ALIAS[command] || OTHER_ALIAS[command] || command
    const q = zt.input(msg, args)
    try {
      if (NEWS[c0]) {
        await reply('⏳ Mengambil berita...')
        const items = arr(await get(DL + NEWS[c0][0]))
        if (!items.length) throw fail('Berita kosong / sumber sedang bermasalah.')
        return reply(listCard(`*${NEWS[c0][1]}*`, items))
      }
      if (!q) return reply(`🔎 *${(DESCR[c0] || (SEARCH[c0] && `Cari ${SEARCH[c0][2]}`) || c0).toUpperCase()}*\n\nContoh: ${prefix}${command} <kata kunci>`)
      await reply('⏳ Mencari...')
      if (SEARCH[c0]) {
        const items = arr(await get(`${DL}/search/${SEARCH[c0][0]}`, { q }))
        if (!items.length) throw fail(`Tidak ada hasil untuk "${q}".`)
        return reply(listCard(`*${SEARCH[c0][1]}: ${q}*`, items))
      }
      return await OTHER[c0](ctx, q)
    } catch (e) {
      return reply('❌ ' + (e.userMessage || `Gagal: ${e.response?.status ? 'server API ' + e.response.status : e.message}`))
    }
  }
}
