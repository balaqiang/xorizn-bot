// Fasad download media: cobalt (kalau diisi owner) -> ytultra (khusus YouTube) -> yt-dlp (otomatis). Dipakai .ytmp3, .ytmp4, .ig, .play
const fs = require('fs')
const config = require('../config')
const dl = require('./downloader')
const ytdlp = require('./ytdlp')
const ytultra = require('./ytultra')
const cobaltpool = require('./cobaltpool')
const scrapers = require('./scrapers')
const scriptmind = require('./scriptmind')
const mediafix = require('./mediafix')
const tiktokmobile = require('./tiktokmobile')

const MIME = { mp3: 'audio/mpeg', m4a: 'audio/mp4', opus: 'audio/ogg; codecs=opus', ogg: 'audio/ogg', aac: 'audio/aac', webm: 'audio/webm' }
const safe = (s) => String(s || '').replace(/[\\/:*?"<>|\n\r]+/g, ' ').trim().slice(0, 80)

// Susun media yang sudah divalidasi: gabungkan video-saja + audio-saja, buang audio lepas, rapikan duplikat kualitas.
async function assemble(got, { single }) {
  const hasSound = (g) => g.info.type === 'video' && g.info.hasAudio !== false
  const videoOnly = got.filter((g) => g.info.type === 'video' && g.info.hasAudio === false)
  const audioOnly = got.filter((g) => g.info.type === 'audio')
  let mergedVideo = null
  if (!got.some(hasSound) && videoOnly.length) {
    mergedVideo = { buffer: videoOnly[0].buffer, kind: 'video' }
    if (audioOnly.length && mediafix.hasFfmpeg()) {
      try {
        mergedVideo = { buffer: await mediafix.mux(videoOnly[0].buffer, audioOnly[0].buffer), kind: 'video' }
      } catch (e) {
        console.log('[MEDIADL] gagal menggabungkan video+audio:', e.message)
      }
    }
  }
  const out = []
  let usedMerged = false
  for (const g of got) {
    if (g.info.type === 'image') out.push({ buffer: g.buffer, kind: 'image', ext: g.info.ext === 'jpg' ? 'jpg' : g.info.ext })
    else if (hasSound(g)) out.push({ buffer: g.buffer, kind: 'video' })
    else if (g.info.type === 'video' && mergedVideo && !usedMerged) {
      out.push(mergedVideo)
      usedMerged = true
    }
  }
  if (!single) return out
  // reel/story = satu media: ambil video terbesar (kualitas tertinggi), kalau tak ada ambil gambar pertama
  const vids = out.filter((o) => o.kind === 'video').sort((a, b) => b.buffer.length - a.buffer.length)
  return vids.length ? [vids[0]] : out.slice(0, 1)
}

// Kirim hasil unduhan ke chat. Mesin dicoba berurutan; semua kegagalan dikumpulkan untuk diagnosis.
// Urutan: cobalt milik owner -> ytultra (YouTube) -> cobalt komunitas -> yt-dlp
async function fetchAndSend(sock, from, msg, url, { audio = false, playlist = false, max = 10, caption } = {}) {
  const fails = []
  const isYt = dl.hostIs(url, ['youtube.com', 'youtu.be'])
  const sendUrl = async (u, filename, kind, { audioUrl } = {}) => {
    const { buffer } = await dl.fetchBuffer(u)
    if (buffer.length < 10000) throw new Error('file terlalu kecil, kemungkinan bukan media')
    const info = mediafix.inspect(buffer)
    if (info.type === 'invalid') throw new Error('berkas bukan media yang valid')
    const base = String(safe(filename) || 'media').replace(/\.[a-z0-9]{2,4}$/i, '')
    if (kind === 'audio') {
      const a = await mediafix.audio(buffer) // kenali format asli, ubah ke MP3 bila perlu
      return dl.sendBuffer(sock, from, msg, a.buffer, 'audio', { filename: `${base}.${a.ext}`, caption, mime: a.mime })
    }
    if (kind === 'video') {
      if (info.type !== 'video') throw new Error('berkas bukan video')
      let data = buffer
      // video tanpa suara + URL audio terpisah -> gabungkan
      if (info.hasAudio === false && audioUrl && mediafix.hasFfmpeg()) {
        try {
          const au = (await dl.fetchBuffer(audioUrl)).buffer
          if (mediafix.inspect(au).type === 'audio') data = await mediafix.mux(buffer, au)
        } catch (e) {
          console.log('[MEDIADL] gabung video+audio gagal:', e.message)
        }
      }
      const v = await mediafix.video(data)
      return dl.sendBuffer(sock, from, msg, v.buffer, 'video', { filename: `${base}.${v.ext}`, caption })
    }
    return dl.sendBuffer(sock, from, msg, buffer, kind, { filename: `${base}.jpg`, caption })
  }

  // 1) cobalt milik owner
  if (dl.hasCobalt()) {
    try {
      const { items } = await dl.cobalt(url, { audio })
      const list = items.slice(0, max)
      for (let i = 0; i < list.length; i++) await dl.sendItem(sock, from, msg, list[i], i === 0 ? caption : undefined)
      return list.length
    } catch (err) {
      fails.push(`cobalt: ${err.message}`)
    }
  }

  // 2a) scriptmind.co (khusus YouTube) — mesin utama
  if (isYt && config.downloader?.scriptmind !== false) {
    try {
      const r = await scriptmind.resolve(url)
      const target = audio ? r.audio : r.video
      if (!target) throw new Error(`tidak ada URL ${audio ? 'audio' : 'video'}`)
      await sendUrl(target, `${safe(r.title) || 'media'}.${audio ? 'mp3' : 'mp4'}`, audio ? 'audio' : 'video', { audioUrl: r.hasSeparate ? r.audio : null })
      return 1
    } catch (err) {
      fails.push(`scriptmind: ${err.message}`)
    }
  }

  // 2) ytultra (khusus YouTube)
  if (isYt && config.downloader?.ytultra !== false) {
    try {
      const { title, medias } = await ytultra.fetchMedias(url)
      const m = ytultra.pick(medias, { audio })
      if (!m) throw new Error(`tidak ada media ${audio ? 'audio' : 'video'} yang cocok`)
      await sendUrl(m.url, `${safe(title) || 'media'}.${ytultra.extOf(m) || (audio ? 'mp3' : 'mp4')}`, audio ? 'audio' : 'video')
      return 1
    } catch (err) {
      fails.push(`ytultra: ${err.message}`)
    }
  }

  // 2c) savetube (audio) & loader.to — cadangan tambahan khusus YouTube
  if (isYt) {
    const extra = []
    if (audio) extra.push(['savetube', async () => require('./savetube').audio(url)])
    extra.push(['loaderto', async () => require('./loaderto').get(url, audio ? 'mp3' : '720')])
    for (const [label, fn] of extra) {
      try {
        const r = await fn()
        await sendUrl(r.url, `${safe(r.title) || 'media'}.${audio ? 'mp3' : 'mp4'}`, audio ? 'audio' : 'video')
        return 1
      } catch (err) {
        fails.push(`${label}: ${err.message}`)
      }
    }
  }

  // 2b) scraper per situs: TikTok (mobile API, snaptik) / Instagram (savefromins, instaloadr)
  const tiktokEngine = async (u) => {
    const r = await tiktokmobile.scrape(u)
    const items = r.isSlideshow
      ? r.images.map((x) => ({ kind: 'image', urls: [x], headers: tiktokmobile.DOWNLOAD_HEADERS }))
      : [{ kind: 'video', urls: r.videoUrls, headers: tiktokmobile.DOWNLOAD_HEADERS }]
    return { items }
  }
  const siteEngines = scrapers.supports.tiktok(url)
    ? [['tiktok', tiktokEngine], ['snaptik', scrapers.snaptik]]
    : scrapers.supports.instagram(url)
      ? [['savefromins', scrapers.savefromins], ['instaloadr', scrapers.instaloadr]]
      : []
  if (config.downloader?.scrapers !== false && !audio) {
    for (const [label, engine] of siteEngines) {
      try {
        const { items } = await engine(url)
        const list = items.slice(0, Math.max(max, 1) + 3)
        const got = []
        for (const it of list) {
          let buffer = null
          let lastErr
          for (const candidate of it.urls || [it.url]) {
            try {
              const r = await dl.fetchBuffer(candidate, it.headers)
              if (r.buffer.length < 3000) throw new Error('file terlalu kecil')
              buffer = r.buffer
              break
            } catch (e) {
              lastErr = e
            }
          }
          if (!buffer) {
            if (!got.length && it === list[list.length - 1]) throw lastErr || new Error('semua URL unduhan gagal')
            continue
          }
          const info = mediafix.inspect(buffer) // buang HTML/JSON/berkas rusak
          if (info.type === 'invalid') {
            console.log(`[MEDIADL] ${label}: berkas bukan media (${buffer.length} byte), dilewati`)
            continue
          }
          if (got.some((g) => g.buffer.length === buffer.length && g.buffer.equals(buffer))) continue // duplikat persis
          got.push({ buffer, info })
        }
        const media = await assemble(got, { single: /instagram\.com\/(reel|reels|tv|stories)\//i.test(url) })
        if (!media.length) throw new Error('tidak ada media yang valid (hanya audio / berkas rusak)')
        const bufs = media.slice(0, max)
        for (let i = 0; i < bufs.length; i++) {
          const b = bufs[i]
          const payload = b.kind === 'video' ? await mediafix.video(b.buffer) : { buffer: b.buffer, ext: b.ext || 'jpg' }
          await dl.sendBuffer(sock, from, msg, payload.buffer, b.kind, { filename: `media-${i + 1}.${payload.ext}`, caption: i === 0 ? caption : undefined })
        }
        return bufs.length
      } catch (err) {
        fails.push(`${label}: ${err.message}`)
      }
    }
  }

  // 3) cobalt komunitas (jalan dari server lain, kebal blokir IP server bot)
  if (config.downloader?.cobaltPool !== false && cobaltpool.supports(url)) {
    try {
      const r = await cobaltpool.resolve(url, { audio })
      await sendUrl(r.url, r.filename, audio ? 'audio' : 'video')
      console.log(`[MEDIADL] berhasil lewat cobalt komunitas: ${r.instance}`)
      return 1
    } catch (err) {
      fails.push(`cobalt: ${err.message}`)
    }
  }

  // 4) yt-dlp
  let res
  try {
    res = await ytdlp.download(url, { audio, playlist, max })
  } catch (err) {
    console.log('[MEDIADL] semua mesin gagal:', fails.join(' | '), '|', err.message)
    const detail = fails.length ? `\n\n_Detail: ${fails.map((f) => f.slice(0, 80)).join(' • ')}_` : ''
    throw new Error(`${err.message}${detail}`)
  }
  try {
    let n = 0
    for (let i = 0; i < res.files.length && i < max; i++) {
      const f = res.files[i]
      await dl.sendBuffer(sock, from, msg, fs.readFileSync(f.file), f.kind, {
        filename: `${safe(res.title) || 'media'}.${f.ext}`,
        caption: i === 0 ? caption : undefined,
        mime: f.kind === 'audio' ? MIME[f.ext] : undefined
      })
      n++
    }
    return n
  } finally {
    res.cleanup()
  }
}

// Catatan status untuk ditampilkan di kartu .play (kosong = siap pakai)
function readiness() {
  if (dl.hasCobalt()) return ''
  const s = ytdlp.status()
  if (s.installed) return ''
  if (s.canInstall) return '' // akan dipasang otomatis saat pertama dipakai
  return `⚠️ Downloader belum siap. ${ytdlp.installHelp()}`
}

module.exports = { fetchAndSend, readiness, config }
