// plugins/downloader/dl-extra.js — downloader tambahan: tt2/tt3/tt4, ttsearch, douyin, aio2, videy, sfile, bypass
const axios = require('axios')
const zt = require('../../lib/engine/pulse-zt')
const dl = require('../../lib/downloader')

const H = { 'User-Agent': zt.UA }
const TT = /https?:\/\/(?:[\w-]+\.)?tiktok\.com\/\S+/i
const abs = (u) => (u && u.startsWith('/') ? `https://www.tikwm.com${u}` : u)
const fail = (m) => Object.assign(new Error(m), { userMessage: m })
const get = async (url, params, extra = {}) => (await axios.get(url, { params, headers: H, timeout: 30000, ...extra })).data

async function tikwm(url) {
  const d = await get('https://www.tikwm.com/api/', { url, hd: 1 })
  if (!d?.data) throw fail(d?.msg || 'Video TikTok tidak ditemukan / akun privat.')
  return d.data
}
const ttCap = (d, mode) => zt.caption(`TIKTOK ${mode}`, [['Judul', d.title], ['Uploader', d.author?.nickname || d.author?.unique_id], ['Durasi', d.duration ? `${d.duration} detik` : ''], ['Views', zt.n(d.play_count)], ['Like', zt.n(d.digg_count)], ['Komentar', zt.n(d.comment_count)], ['Share', zt.n(d.share_count)]])

async function sendMany(sock, from, msg, urls, cap) {
  const max = Math.min(urls.length, dl.maxItems ? dl.maxItems() : 10)
  for (let i = 0; i < max; i++) await zt.sendUrl(sock, from, msg, abs(urls[i]), { kind: 'image', filename: `slide-${i + 1}.jpg`, caption: i === 0 ? cap : undefined })
}

const MODES = {
  tt2: async ({ sock, from, msg }, url) => {
    const d = await tikwm(url)
    if (d.images?.length) throw fail('Ini TikTok slide, pakai tt4 untuk mengunduh fotonya.')
    return zt.sendUrl(sock, from, msg, abs(d.play), { kind: 'video', filename: 'tiktok.mp4', caption: ttCap(d, 'RINGAN (SD)') })
  },
  tt3: async ({ sock, from, msg }, url) => {
    const d = await tikwm(url)
    if (d.images?.length) throw fail('Ini TikTok slide, pakai tt4 untuk mengunduh fotonya.')
    return zt.sendUrl(sock, from, msg, abs(d.hdplay || d.play), { kind: 'video', filename: 'tiktok-hd.mp4', caption: ttCap(d, 'HD') })
  },
  tt4: async ({ sock, from, msg }, url) => {
    const d = await tikwm(url)
    if (!d.images?.length) throw fail('Ini bukan TikTok slide (foto). Pakai tt2 / tt3 untuk video.')
    await sendMany(sock, from, msg, d.images, ttCap(d, `SLIDE (${d.images.length} foto)`))
    const m = abs(d.music_info?.play || d.music)
    if (m) await zt.sendUrl(sock, from, msg, m, { kind: 'audio', filename: 'musik.mp3' }).catch(() => {})
  }
}

const cmds = {
  ttsearch: async ({ reply }, q) => {
    const d = await get('https://www.tikwm.com/api/feed/search', { keywords: q, count: 8, cursor: 0, web: 1, hd: 1 })
    const v = d?.data?.videos || []
    if (!v.length) throw fail(`Tidak ada video untuk "${q}".`)
    return reply([`🔎 *TIKTOK: ${q}*`, '', ...v.slice(0, 8).map((x, i) => `${i + 1}. *${zt.clean(x.title) || '(tanpa judul)'}*\n   👤 ${x.author?.unique_id} · ▶️ ${zt.n(x.play_count)} · ❤️ ${zt.n(x.digg_count)}\n   🔗 https://www.tiktok.com/@${x.author?.unique_id}/video/${x.video_id}`), '', '💡 Salin link lalu kirim ke .tt3'].join('\n'))
  },
  douyin: async ({ sock, from, msg }, url) => {
    const d = await get('https://api-faa.my.id/faa/douyin-down', { url })
    const m = (d?.result?.medias || []).find((x) => /video/i.test(x.type)) || d?.result?.medias?.[0]
    if (!m?.url) throw fail('Video Douyin tidak ditemukan.')
    return zt.sendUrl(sock, from, msg, m.url, { kind: 'video', filename: 'douyin.mp4', caption: zt.caption('DOUYIN', [['Judul', d.result.title], ['Kualitas', m.quality]]) })
  },
  aio2: async ({ sock, from, msg }, url) => {
    const d = await get('https://api-faa.my.id/faa/aio', { url })
    const u = d?.result?.download_url
    if (!u) throw fail('Link tidak didukung / media tidak ditemukan.')
    return zt.sendUrl(sock, from, msg, u, { filename: 'media', caption: zt.caption('ALL-IN-ONE', [['Judul', d.result.title], ['Sumber', url]]) })
  },
  videy: async ({ sock, from, msg }, q) => {
    const id = (q.match(/[?&]id=([\w-]+)/) || q.match(/videy\.co\/(?:v\/)?([\w-]+)/) || q.match(/^([\w-]{6,})$/) || [])[1]
    if (!id) throw fail('Link Videy tidak valid. Contoh: https://videy.co/v?id=XXXXXXXX')
    return zt.sendUrl(sock, from, msg, `https://cdn.videy.co/${id}.mp4`, { kind: 'video', filename: `videy-${id}.mp4`, caption: zt.caption('VIDEY', [['ID', id]]) })
  },
  sfile: async ({ sock, from, msg, reply }, q) => {
    const cheerio = require('cheerio')
    if (!/^https?:\/\/sfile\.mobi\//i.test(q)) {
      const [kw, page] = q.split('|')
      const html = await get('https://sfile.mobi/search.php', { q: kw.trim(), page: parseInt(page) || 1 }, { responseType: 'text' })
      const $ = cheerio.load(html)
      const rows = []
      $('div.list').each((_, el) => {
        const a = $(el).find('a').first()
        if (a.attr('href')) rows.push(`• *${a.text().trim()}* ${(($(el).text().split('(')[1] || '').replace(')', '')).trim()}\n  🔗 ${a.attr('href')}`)
      })
      if (!rows.length) throw fail(`File "${kw}" tidak ditemukan di Sfile.`)
      return reply(`📁 *SFILE: ${kw}*\n\n${rows.slice(0, 10).join('\n\n')}\n\n💡 Salin link lalu kirim ke .sfile <link>`)
    }
    const $ = cheerio.load(await get(q, undefined, { responseType: 'text' }))
    const filename = $('img.intro').attr('alt') || 'sfile'
    const mime = ($('div.list').first().text().split(' - ')[1] || '').split('\n')[0].trim()
    const next = $('#download').attr('href')
    if (!next) throw fail('Tombol download Sfile tidak ditemukan.')
    const page2 = await get(next, undefined, { responseType: 'text' })
    const m = String(page2).replace(/\\\//g, '/').match(/https:\/\/download\d+\.sfile\.mobi\/downloadfile\/[^\s'"]+/i)
    if (!m) throw fail('Link unduhan final Sfile tidak ditemukan.')
    return zt.sendDoc(sock, from, msg, m[0], { filename, mime: mime || undefined, caption: zt.caption('SFILE', [['Nama', filename], ['Tipe', mime]]) })
  },
  bypass: async ({ reply }, url) => {
    if (!/^https?:\/\//i.test(url)) throw fail('Link harus diawali http(s)://')
    const HD = { ...H, accept: '*/*', Referer: 'https://bypass-links.com/' }
    const t = (await axios.get('https://bypass-links.com/api/token', { headers: HD, timeout: 20000 })).data?.token
    if (!t) throw fail('Token bypass tidak didapat.')
    const r = (await axios.post('https://bypass-links.com/api/bypass', { url, bypass_token: t }, { headers: { ...HD, 'content-type': 'application/json' }, timeout: 30000 })).data
    if (!r) throw fail('Tidak ada respon dari server bypass.')
    const rows = Object.entries(r).map(([k, v]) => `▬ *${k}:* ${typeof v === 'object' ? '```' + JSON.stringify(v) + '```' : v}`)
    return reply(`🔓 *BYPASS LINK*\n\n${rows.join('\n')}`)
  }
}
const ALIAS = { ttdl4: 'tt4', tiktok4: 'tt4', tiktok2: 'tt2', tiktok3: 'tt3', ttslide: 'tt4', tiktoksearch: 'ttsearch', douyindl: 'douyin', allinone2: 'aio2', videydl: 'videy', sfiledl: 'sfile', bypasslink: 'bypass', unlocklink: 'bypass' }
const NAMES = [...Object.keys(MODES), ...Object.keys(cmds), ...Object.keys(ALIAS)].filter((n) => n !== 'tt2' && n !== 'tiktok2') // tt2 / tiktok2 kini dari tiktok2.js (plugin baru)
const DESC = { tt2: 'TikTok video versi ringan (SD)', tt3: 'TikTok video HD tanpa watermark', tt4: 'TikTok slide/foto + musik', ttsearch: 'Cari video TikTok pakai kata kunci', douyin: 'Download video Douyin', aio2: 'Download semua-sosmed (mesin cadangan)', videy: 'Download video Videy', sfile: 'Cari / download file Sfile.mobi', bypass: 'Bypass/unlock link pendek (shortlink)' }
const USE = { tt2: '<link tiktok>', tt3: '<link tiktok>', tt4: '<link slide tiktok>', ttsearch: '<kata kunci>', douyin: '<link douyin>', aio2: '<link>', videy: '<link / id>', sfile: '<kata kunci | link sfile.mobi>', bypass: '<link>' }

module.exports = {
  name: 'dl-extra',
  command: NAMES,
  category: 'downloader',
  emoji: '📥',
  desc: 'Downloader tambahan: tt2/tt3/tt4, ttsearch, douyin, aio2, videy, sfile, bypass',
  usage: '<link>',
  run: async (ctx) => {
    const { msg, args, command, prefix, reply } = ctx
    const key = ALIAS[command] || command
    const q = zt.input(msg, args)
    if (!q) return reply(`📥 *${(DESC[key] || key).toUpperCase()}*\n\nContoh: ${prefix}${command} ${USE[key] || ''}`)
    if (MODES[key]) {
      const url = zt.match(q, TT)
      if (!url) return reply('❌ Link TikTok tidak valid.')
      await reply('⏳ Mengunduh...')
      try { return await MODES[key](ctx, url) } catch (e) { return reply('❌ ' + (e.userMessage || `Gagal: ${e.message}`)) }
    }
    await reply('⏳ Memproses...')
    try { return await cmds[key](ctx, q) } catch (e) { return reply('❌ ' + (e.userMessage || `Gagal: ${e.message}`)) }
  }
}
