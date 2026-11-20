// Helper downloader: TikTok (tikwm) + engine cobalt (YouTube, Instagram, dll)
const axios = require('axios')
const config = require('../config')

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
const WA_VIDEO_LIMIT = 16 * 1024 * 1024 // di atas ini dikirim sebagai dokumen

const opt = () => ({ maxMB: 80, maxImages: 10, ytQuality: '720', ...(config.downloader || {}) })
const hasCobalt = () => !!config.downloader?.cobalt?.url
const maxItems = () => opt().maxImages

// ---------- URL ----------
function getUrl(args) {
  const m = args.join(' ').match(/https?:\/\/[^\s]+/i)
  return m ? m[0] : null
}

function hostIs(url, domains) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase()
    return domains.some((d) => host === d || host.endsWith(`.${d}`))
  } catch {
    return false
  }
}

// ---------- TikTok (tikwm.com) ----------
const abs = (u) => (u && u.startsWith('/') ? `https://www.tikwm.com${u}` : u)

async function tiktok(url) {
  let res
  try {
    res = await axios.post('https://www.tikwm.com/api/', new URLSearchParams({ url, hd: '1' }), {
      headers: { 'User-Agent': UA },
      timeout: 20000
    })
  } catch {
    throw new Error('Server TikTok tidak bisa dihubungi, coba lagi nanti.')
  }
  const body = res.data
  if (!body || body.code !== 0 || !body.data) {
    throw new Error(`Gagal mengambil data TikTok${body?.msg ? `: ${body.msg}` : '.'}`)
  }
  const d = body.data
  return {
    title: d.title || '',
    author: d.author?.nickname || d.author?.unique_id || '',
    video: abs(d.hdplay || d.play),
    audio: abs(d.music),
    images: Array.isArray(d.images) ? d.images.map(abs) : []
  }
}

// ---------- cobalt (YouTube, Instagram, dll) ----------
// Butuh instance cobalt sendiri: isi config.downloader.cobalt.url (+ apiKey kalau perlu)
async function cobalt(url, { audio = false } = {}) {
  const c = config.downloader?.cobalt || {}
  if (!c.url) {
    throw new Error('Fitur ini belum aktif. Owner perlu mengisi downloader.cobalt.url di config.js.')
  }

  const headers = { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': UA }
  if (c.apiKey) headers.Authorization = `Api-Key ${c.apiKey}`

  const body = { url, videoQuality: opt().ytQuality, filenameStyle: 'basic' }
  if (audio) Object.assign(body, { downloadMode: 'audio', audioFormat: 'mp3', audioBitrate: '128' })

  let res
  try {
    res = await axios.post(c.url, body, { headers, timeout: 40000, validateStatus: () => true })
  } catch {
    throw new Error('Server downloader tidak bisa dihubungi.')
  }

  const d = res.data
  if (!d || typeof d !== 'object') throw new Error('Respons server downloader tidak valid.')
  if (d.status === 'error') throw new Error(`Gagal mengunduh (${d.error?.code || 'unknown'}).`)

  if (d.status === 'tunnel' || d.status === 'redirect') {
    return { items: [{ url: d.url, filename: d.filename, type: audio ? 'audio' : 'video' }] }
  }
  if (d.status === 'picker' && Array.isArray(d.picker)) {
    return {
      items: d.picker.map((p) => ({ url: p.url, type: p.type === 'photo' ? 'image' : 'video' })),
      audio: d.audio
    }
  }
  throw new Error('Respons server downloader tidak dikenali.')
}

// ---------- Unduh & kirim ----------
async function fetchBuffer(url, extraHeaders = {}) {
  const limit = opt().maxMB * 1024 * 1024
  try {
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': UA, ...extraHeaders },
      timeout: 120000,
      maxContentLength: limit,
      maxBodyLength: limit
    })
    return { buffer: Buffer.from(res.data), mime: res.headers['content-type'] || '' }
  } catch (err) {
    if (/maxContentLength|maxBodyLength/i.test(err.message)) {
      throw new Error(`Ukuran file melebihi batas ${opt().maxMB} MB.`)
    }
    throw new Error('Gagal mengunduh file media.')
  }
}

function kindOf(mime = '', filename = '', fallback = 'video') {
  const m = String(mime).toLowerCase()
  if (m.startsWith('image/')) return 'image'
  if (m.startsWith('audio/')) return 'audio'
  if (m.startsWith('video/')) return 'video'
  const ext = (String(filename).split('.').pop() || '').toLowerCase()
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'image'
  if (['mp3', 'm4a', 'opus', 'ogg'].includes(ext)) return 'audio'
  if (['mp4', 'webm', 'mkv'].includes(ext)) return 'video'
  return fallback
}

async function sendItem(sock, from, msg, item, caption) {
  const { buffer, mime } = await fetchBuffer(item.url)
  return sendBuffer(sock, from, msg, buffer, kindOf(mime, item.filename, item.type), { filename: item.filename, caption })
}

// kind: 'image' | 'audio' | 'video'. Di atas 16 MB dikirim sebagai dokumen.
async function sendBuffer(sock, from, msg, buffer, kind, { filename, caption, mime } = {}) {
  const item = { filename }
  const q = { quoted: msg }
  const big = buffer.length > WA_VIDEO_LIMIT

  if (kind === 'image') return sock.sendMessage(from, { image: buffer, caption }, q)
  if (kind === 'audio') {
    const amime = mime || 'audio/mpeg'
    if (big) {
      return sock.sendMessage(from, { document: buffer, mimetype: amime, fileName: item.filename || 'audio.mp3' }, q)
    }
    return sock.sendMessage(from, { audio: buffer, mimetype: amime }, q)
  }
  if (big) {
    return sock.sendMessage(
      from,
      { document: buffer, mimetype: 'video/mp4', fileName: item.filename || 'video.mp4', caption },
      q
    )
  }
  return sock.sendMessage(from, { video: buffer, mimetype: 'video/mp4', caption }, q)
}

module.exports = { getUrl, hostIs, tiktok, cobalt, hasCobalt, maxItems, sendItem, sendBuffer, fetchBuffer, kindOf }
