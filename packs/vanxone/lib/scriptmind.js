// Scraper scriptmind.co: resolve link YouTube -> URL tunnel audio/video.
// Respons: { success, result: { title, duration, resolvedMediaJson: '{"tunnel":[<video>,<audio>]}' } }
const axios = require('axios')
const crypto = require('crypto')

const urlOf = (x) => (typeof x === 'string' ? x : x && typeof x.url === 'string' ? x.url : null)
const isHttp = (u) => typeof u === 'string' && /^https?:\/\//i.test(u)

async function resolve(url) {
  let res
  try {
    res = await axios.post(
      'https://scriptmind.co/api/media/resolve/preview',
      { url, platform: 'youtube', pageType: 'video', guestId: crypto.randomUUID() },
      { headers: { 'Content-Type': 'application/json' }, timeout: 60000, validateStatus: () => true }
    )
  } catch (err) {
    throw new Error(`tidak bisa dihubungi (${err.code || err.message})`)
  }
  const body = res.data
  if (!body || body.success !== true) {
    const m = body?.message
    throw new Error(`ditolak (${typeof m === 'string' ? m.slice(0, 80) : `HTTP ${res.status}`})`)
  }
  const data = body.result || {}
  let media
  try {
    media = typeof data.resolvedMediaJson === 'string' ? JSON.parse(data.resolvedMediaJson) : data.resolvedMediaJson
  } catch {
    throw new Error('data media tidak terbaca')
  }
  const tunnel = Array.isArray(media?.tunnel) ? media.tunnel.map(urlOf).filter(isHttp) : []
  if (!tunnel.length) {
    console.log('[SCRIPTMIND] tidak ada tunnel di respons:', JSON.stringify(media)?.slice(0, 300))
    throw new Error('URL media tidak ditemukan')
  }
  // Susunan dari scrape yang sudah teruji: tunnel[1] = audio. tunnel[0] = video (bila ada dua entri).
  return {
    title: data.title || '',
    duration: data.duration || '',
    audio: tunnel[1] || tunnel[0],
    video: tunnel.length > 1 ? tunnel[0] : tunnel[0],
    hasSeparate: tunnel.length > 1
  }
}

module.exports = { resolve }
