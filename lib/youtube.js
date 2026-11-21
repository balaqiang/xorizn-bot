// Pencarian YouTube tanpa API key (membaca ytInitialData dari halaman hasil pencarian)
const axios = require('axios')

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`
const thumbOf = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

const text = (node) => node?.simpleText ?? node?.runs?.map((r) => r.text).join('') ?? ''

// Kumpulkan semua videoRenderer di mana pun posisinya dalam JSON
function collect(node, out = []) {
  if (!node || typeof node !== 'object') return out
  if (node.videoRenderer?.videoId) out.push(node.videoRenderer)
  for (const v of Array.isArray(node) ? node : Object.values(node)) collect(v, out)
  return out
}

function parseResults(html, limit = 10) {
  const m = String(html).match(/var ytInitialData\s*=\s*(\{.*?\});\s*<\/script>/s)
  if (!m) return []
  let data
  try {
    data = JSON.parse(m[1])
  } catch {
    return []
  }
  const seen = new Set()
  const items = []
  for (const v of collect(data)) {
    if (seen.has(v.videoId)) continue
    seen.add(v.videoId)
    const duration = text(v.lengthText)
    if (!duration) continue // lewati live / shorts tanpa durasi
    items.push({
      id: v.videoId,
      url: watchUrl(v.videoId),
      title: text(v.title),
      channel: text(v.ownerText) || text(v.longBylineText),
      duration,
      views: text(v.viewCountText),
      published: text(v.publishedTimeText),
      thumb: thumbOf(v.videoId)
    })
    if (items.length >= limit) break
  }
  return items
}

async function search(query, limit = 10) {
  let res
  try {
    res = await axios.get('https://www.youtube.com/results', {
      params: { search_query: query, hl: 'id', gl: 'ID' },
      headers: { 'User-Agent': UA, 'Accept-Language': 'id-ID,id;q=0.9,en;q=0.7', Cookie: 'CONSENT=YES+1' },
      timeout: 15000
    })
  } catch {
    throw new Error('YouTube tidak bisa dihubungi, coba lagi nanti.')
  }
  const items = parseResults(res.data, limit)
  if (!items.length) throw new Error('Video tidak ditemukan.')
  return items
}

// Ambil id dari link youtube / youtu.be / shorts
function videoIdFrom(url) {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\.|^m\./, '')
    if (host === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null
    if (host.endsWith('youtube.com')) {
      if (u.searchParams.get('v')) return u.searchParams.get('v')
      const m = u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{6,})/)
      return m ? m[1] : null
    }
  } catch {}
  return null
}

// Info singkat dari link (judul & channel) lewat oEmbed
async function infoFromUrl(url) {
  const id = videoIdFrom(url)
  if (!id) throw new Error('Link YouTube tidak valid.')
  let data = {}
  try {
    const res = await axios.get('https://www.youtube.com/oembed', {
      params: { url: watchUrl(id), format: 'json' },
      headers: { 'User-Agent': UA },
      timeout: 10000
    })
    data = res.data || {}
  } catch {
    throw new Error('Video tidak ditemukan atau tidak bisa diakses.')
  }
  return { id, url: watchUrl(id), title: data.title || 'YouTube', channel: data.author_name || '', duration: '', views: '', published: '', thumb: thumbOf(id) }
}

module.exports = { search, parseResults, videoIdFrom, infoFromUrl, watchUrl, thumbOf }

// ---------- Helper tampilan untuk .play / .play2 / .yts ----------
const cut = (s, n) => (String(s).length > n ? `${String(s).slice(0, n - 1)}…` : String(s))
const react = (sock, msg, emoji) =>
  sock.sendMessage(msg.key.remoteJid, { react: { text: emoji, key: msg.key } }).catch(() => {})

function detailLines(item) {
  return [
    `▬ *Judul:* ${item.title}`,
    item.channel && `▬ *Channel:* ${item.channel}`,
    item.duration && `▬ *Durasi:* ${item.duration}`,
    item.views && `▬ *Views:* ${item.views}`,
    item.published && `▬ *Upload:* ${item.published}`,
    `▬ *Link:* ${item.url}`
  ].filter(Boolean)
}

module.exports.cut = cut
module.exports.react = react
module.exports.detailLines = detailLines

// Thumbnail 16:9 sebagai buffer JPEG (dicoba beberapa ukuran; yang terlalu kecil = placeholder abu-abu, dilewati)
async function thumbBuffer(id, w = 640, h = 360) {
  const sharp = require('sharp')
  for (const name of ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault']) {
    try {
      const res = await axios.get(`https://i.ytimg.com/vi/${id}/${name}.jpg`, {
        responseType: 'arraybuffer',
        timeout: 10000,
        headers: { 'User-Agent': UA }
      })
      const buf = Buffer.from(res.data)
      if (buf.length < 6000) continue
      return await sharp(buf).resize(w, h, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer()
    } catch {}
  }
  return null
}

module.exports.thumbBuffer = thumbBuffer
