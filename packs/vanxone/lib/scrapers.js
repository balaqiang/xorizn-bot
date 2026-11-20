// Scraper pihak ketiga (TikTok: snaptik.fi, Instagram: instaloadr.com).
// Bentuk JSON respons tidak diketahui pasti, jadi semua URL media "dipanen" lalu diklasifikasi dari
// ekstensi, nama field, dan field tipe di sekitarnya. Gagal = pemanggil pindah ke mesin berikutnya.
const axios = require('axios')

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
const HINT_KEYS = ['type', 'media_type', 'mediatype', 'mime', 'mimetype', 'mimeType', 'kind', 'format', 'ext', 'extension', 'label', 'quality', 'name']

// kumpulkan semua string URL beserta petunjuk (path + field tipe pada objek induknya)
function harvest(node, path = '', hint = '', out = []) {
  if (typeof node === 'string') {
    if (/^https?:\/\//i.test(node)) out.push({ url: node, key: path, hint })
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => harvest(v, `${path}[${i}]`, hint, out))
  } else if (node && typeof node === 'object') {
    const own = HINT_KEYS.map((k) => (typeof node[k] === 'string' ? node[k] : '')).join(' ')
    const h = `${hint} ${own}`.trim()
    for (const [k, v] of Object.entries(node)) harvest(v, path ? `${path}.${k}` : k, h, out)
  }
  return out
}

// 'video' | 'image' | 'audio' | null (null = bukan media utama: thumbnail, avatar, tautan situs)
function classify({ url, key, hint }) {
  const ext = (url.split('?')[0].split('#')[0].split('.').pop() || '').toLowerCase()
  const k = key.toLowerCase()
  const ctx = `${k} ${String(hint).toLowerCase()}`
  if (/thumb|cover|poster|preview|avatar|profile|icon|logo|favicon|dynamic/.test(k)) return null
  if (['mp3', 'm4a', 'aac', 'opus'].includes(ext)) return 'audio'
  if (['mp4', 'mov', 'webm', 'm4v', 'mkv'].includes(ext)) return 'video'
  if (['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(ext)) return 'image'
  if (/\.(js|css|html|svg|ico)$/i.test(url.split('?')[0])) return null
  if (/audio|music|mp3/.test(ctx)) return 'audio'
  if (/video|mp4|nowm|nowatermark|hdplay|\bhd\b|play|reel/.test(ctx)) return 'video'
  if (/image|photo|picture|jpg|jpeg|png|webp|pic\b/.test(ctx)) return 'image'
  if (/download|url|link|src/.test(k)) return 'video' // URL tanpa ekstensi dengan nama "download" -> anggap video
  return null
}

const score = (m) => {
  const k = m.key.toLowerCase()
  let n = 0
  if (/nowm|nowatermark|no_wm|no-wm|without/.test(k)) n += 3
  else if (/watermark|(^|[^a-z])wm([^a-z]|$)/.test(k)) n -= 3
  if (/hdplay|(^|[^a-z])hd([^a-z]|$)/.test(k)) n += 2
  return n
}

function mediaFrom(data) {
  const seen = new Set()
  const items = []
  for (const h of harvest(data)) {
    if (seen.has(h.url)) continue
    seen.add(h.url)
    const kind = classify(h)
    if (kind) items.push({ url: h.url, kind, key: h.key })
  }
  return items
}

// Satu media sering muncul dalam beberapa kualitas di bawah objek yang sama (mis. medias[0].formats[1]).
// Kelompokkan per indeks array pertama, lalu ambil satu per kelompok (video diutamakan, lalu yang pertama).
function groupPick(items) {
  const groups = new Map()
  for (const m of items) {
    const g = (m.key.match(/^(.*?\[\d+\])/) || [])[1] || m.key
    if (!groups.has(g)) groups.set(g, [])
    groups.get(g).push(m)
  }
  return [...groups.values()].map((list) => list.find((m) => m.kind === 'video') || list[0])
}

const hostOf = (u) => { try { return new URL(u).hostname } catch { return '' } }

async function post(url, body, headers) {
  let res
  try {
    res = await axios.post(url, body, { headers: { 'Content-Type': 'application/json', 'User-Agent': UA, ...headers }, timeout: 30000, validateStatus: () => true })
  } catch (err) {
    throw new Error(`tidak bisa dihubungi (${err.code || err.message})`)
  }
  if (res.status >= 400) throw new Error(`HTTP ${res.status}`)
  if (!res.data || typeof res.data !== 'object') throw new Error('respons bukan JSON')
  return res.data
}

// TikTok -> { items: [{url, kind}], title }
async function snaptik(url) {
  const data = await post('https://snaptik.fi/api/tiktok', { url }, { Origin: 'https://snaptik.fi', Referer: 'https://snaptik.fi/id/download-tiktok-video' })
  const all = mediaFrom(data)
  const videos = all.filter((m) => m.kind === 'video').sort((a, b) => score(b) - score(a))
  const images = all.filter((m) => m.kind === 'image')
  const audio = all.filter((m) => m.kind === 'audio')
  const items = videos.length ? [videos[0]] : images
  if (!items.length) {
    console.log('[SCRAPER] snaptik: tidak ada media di respons:', JSON.stringify(data).slice(0, 300))
    throw new Error('tidak ada media di respons')
  }
  return { items: items.map(({ url, kind }) => ({ url, kind })), audio: audio[0]?.url, title: data.title || data.data?.title || '' }
}

// Instagram -> { items: [{url, kind}] }
async function instaloadr(url) {
  const data = await post('https://www.instaloadr.com/api/fetch', { url, media_type: 'post' }, { referer: 'https://www.instaloadr.com/', origin: 'https://www.instaloadr.com' })
  const all = mediaFrom(data)
  // satu video biasanya muncul bersama gambar sampulnya; jika ada video, gambar yang berdampingan dianggap sampul
  const picked = groupPick(all)
  const hasVideo = picked.some((m) => m.kind === 'video')
  const items = hasVideo && picked.filter((m) => m.kind === 'video').length === 1 && picked.length > 1 && picked.every((m) => m.kind === 'video' || /thumb|cover|poster/i.test(m.key)) ? picked.filter((m) => m.kind === 'video') : picked
  if (!items.length) {
    console.log('[SCRAPER] instaloadr: tidak ada media di respons:', JSON.stringify(data).slice(0, 300))
    throw new Error('tidak ada media di respons')
  }
  return { items: items.map(({ url, kind }) => ({ url, kind })), title: data.title || data.caption || '' }
}

// Instagram (reel / foto / carousel / story) -> { items }  — savefromins.com
async function savefromins(url) {
  let res
  try {
    res = await axios.post(
      'https://api.savefromins.com/api/contentsite_api/media/parse',
      new URLSearchParams({ auth: '20250901majwlqo', domain: 'api-ak.savefromins.com', origin: 'source', link: url }).toString(),
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/x-www-form-urlencoded',
          origin: 'https://savefromins.com',
          referer: 'https://savefromins.com/',
          'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
        },
        timeout: 30000,
        validateStatus: () => true
      }
    )
  } catch (err) {
    throw new Error(`tidak bisa dihubungi (${err.code || err.message})`)
  }
  if (res.status >= 400) throw new Error(`HTTP ${res.status}`)
  const data = typeof res.data === 'string' ? (() => { try { return JSON.parse(res.data) } catch { return null } })() : res.data
  if (!data || typeof data !== 'object') throw new Error('respons bukan JSON')
  const items = groupPick(mediaFrom(data)) // audio ikut: dipakai sebagai pasangan video tanpa suara (DASH)
  if (!items.length) {
    console.log('[SCRAPER] savefromins: tidak ada media di respons:', JSON.stringify(data).slice(0, 300))
    throw new Error('tidak ada media di respons')
  }
  return { items: items.map(({ url, kind }) => ({ url, kind })), title: data.title || data.data?.title || '' }
}

const supports = { tiktok: (u) => /(^|\.)tiktok\.com$/.test(hostOf(u)), instagram: (u) => /(^|\.)instagram\.com$/.test(hostOf(u)) }

module.exports = { savefromins, groupPick, snaptik, instaloadr, harvest, classify, mediaFrom, supports }
