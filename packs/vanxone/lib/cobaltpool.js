// Mesin cadangan: instance cobalt komunitas (daftar publik di instances.cobalt.best).
// Berjalan dari server instance itu, jadi tidak terkena blokir IP server bot. Instance yang butuh API key dilewati.
const axios = require('axios')

const UA = 'vanXone-bot/1.9 (+personal WhatsApp bot; low volume)'
const LIST_URLS = ['https://instances.cobalt.best/instances.json', 'https://instances.cobalt.best/api/instances.json']
const SERVICES = ['youtube', 'instagram', 'twitter', 'facebook', 'reddit', 'tiktok', 'pinterest', 'soundcloud', 'twitch', 'vimeo', 'dailymotion', 'bluesky', 'tumblr', 'streamable']

let cache = { at: 0, list: [] }
const bad = new Map() // host -> waktu boleh dicoba lagi

const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return '' } }
const serviceOf = (u) => {
  const h = hostOf(u)
  if (/(^|\.)(youtube\.com|youtu\.be)$/.test(h)) return 'youtube'
  if (h === 'x.com' || /(^|\.)twitter\.com$/.test(h)) return 'twitter'
  if (/(^|\.)(fb\.watch|facebook\.com|fb\.com)$/.test(h)) return 'facebook'
  const hit = SERVICES.find((s) => h.includes(s))
  return hit || null
}
const supports = (url) => !!serviceOf(url)

async function instances() {
  if (Date.now() - cache.at < 30 * 60 * 1000 && cache.list.length) return cache.list
  let data
  for (const u of LIST_URLS) {
    try {
      data = (await axios.get(u, { headers: { 'User-Agent': UA }, timeout: 15000 })).data
      if (Array.isArray(data)) break
    } catch {}
  }
  if (!Array.isArray(data)) return cache.list // pakai cache lama kalau ada
  cache = { at: Date.now(), list: data }
  return data
}

async function pick(service) {
  const list = await instances()
  return list
    .filter((i) => i && i.api && (i.online === true || i.online?.api === true) && i.services?.[service] === true && !i.nodomain)
    .filter((i) => !(bad.get(i.api) > Date.now()))
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 8)
}

// Mengembalikan { url, filename, instance } atau melempar Error ringkas
async function resolve(url, { audio = false, tries = 4 } = {}) {
  const service = serviceOf(url)
  if (!service) throw new Error('situs tidak didukung')
  const candidates = await pick(service)
  if (!candidates.length) throw new Error('tidak ada instance yang tersedia')

  const body = { url, filenameStyle: 'basic', videoQuality: '720' }
  if (audio) Object.assign(body, { downloadMode: 'audio', audioFormat: 'mp3', audioBitrate: '128' })
  const notes = []
  for (const inst of candidates.slice(0, tries)) {
    const base = `${inst.protocol || 'https'}://${inst.api}/`
    try {
      const res = await axios.post(base, body, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': UA },
        timeout: 20000,
        validateStatus: () => true
      })
      const d = res.data
      if (d && (d.status === 'tunnel' || d.status === 'redirect') && d.url) return { url: d.url, filename: d.filename, instance: inst.api }
      if (d && d.status === 'picker' && Array.isArray(d.picker) && d.picker[0]?.url && !audio) return { url: d.picker[0].url, filename: d.filename, instance: inst.api }
      const code = d?.error?.code || `HTTP ${res.status}`
      notes.push(`${inst.api}: ${String(code).replace('error.api.', '')}`)
      bad.set(inst.api, Date.now() + (/auth|jwt|key/i.test(code) ? 6 * 3600e3 : 10 * 60e3))
    } catch (err) {
      notes.push(`${inst.api}: ${err.code || 'gagal'}`)
      bad.set(inst.api, Date.now() + 10 * 60e3)
    }
  }
  throw new Error(`semua instance gagal (${notes.slice(0, 3).join('; ')})`)
}

module.exports = { resolve, supports, instances, pick, serviceOf, _reset: () => { cache = { at: 0, list: [] }; bad.clear() } }
