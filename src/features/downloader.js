/**
 * Downloader bawaan: TikTok (tikwm), YouTube & situs lain (yt-dlp), cadangan Instagram/Facebook/X (btch-downloader).
 */
import { createRequire } from 'node:module'
import * as ytdlp from './ytdlp.js'
import logger from '../core/logger.js'

const require = createRequire(import.meta.url)
const log = logger.child('downloader')

export const PLATFORMS = {
  tiktok: /(?:^|\/\/|\.)(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com)\//i,
  youtube: /(?:^|\/\/|\.)(youtube\.com|youtu\.be|music\.youtube\.com)\//i,
  instagram: /(?:^|\/\/|\.)(instagram\.com|instagr\.am)\//i,
  facebook: /(?:^|\/\/|\.)(facebook\.com|fb\.watch|fb\.com)\//i,
  twitter: /(?:^|\/\/|\.)(twitter\.com|x\.com)\//i
}
export const platformOf = (url) => Object.keys(PLATFORMS).find((k) => PLATFORMS[k].test(url)) || 'other'
export const firstUrl = (text) => (String(text || '').match(/https?:\/\/[^\s<>"']+/i) || [])[0] || ''

// ---------- TikTok (tikwm) ----------
const absTikwm = (u) => (u && u.startsWith('/') ? `https://www.tikwm.com${u}` : u)

/** → { title, author, video, music, images[] } */
export async function tiktok(url) {
  const res = await fetch('https://www.tikwm.com/api/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'User-Agent': 'Mozilla/5.0' },
    body: new URLSearchParams({ url, hd: '1' }),
    signal: AbortSignal.timeout(25000)
  })
  const json = await res.json().catch(() => null)
  if (!json || json.code !== 0 || !json.data) throw new Error(json?.msg ? `TikTok: ${json.msg}` : 'Gagal mengambil data TikTok.')
  const d = json.data
  return {
    title: d.title || '',
    author: d.author ? `${d.author.nickname || ''} (@${d.author.unique_id || ''})`.trim() : '',
    duration: d.duration || 0,
    video: absTikwm(d.hdplay || d.play || d.wmplay),
    music: absTikwm(d.music || d.music_info?.play),
    images: (d.images || []).map(absTikwm)
  }
}

// ---------- YouTube search ----------
export async function ytSearch(query, limit = 5) {
  const yts = require('yt-search')
  const r = await yts(query)
  return (r.videos || []).slice(0, limit).map((v) => ({ title: v.title, url: v.url, duration: v.timestamp, seconds: v.seconds, views: v.views, author: v.author?.name || '', thumbnail: v.thumbnail }))
}

// ---------- cadangan btch-downloader ----------
const MEDIA_URL = /^https?:\/\//i
/** Kumpulkan URL media dari respons berbentuk apa pun. */
function collectUrls(data, out = new Set()) {
  if (!data) return out
  if (typeof data === 'string') {
    if (MEDIA_URL.test(data) && !/\.(html?)(\?|$)/i.test(data)) out.add(data)
    return out
  }
  if (Array.isArray(data)) {
    for (const x of data) collectUrls(x, out)
    return out
  }
  if (typeof data === 'object') {
    for (const [k, v] of Object.entries(data)) {
      if (/thumb|avatar|profile|cover|creator|author|developer|issues/i.test(k)) continue
      collectUrls(v, out)
    }
  }
  return out
}

export async function fallback(platform, url) {
  let btch
  try {
    btch = require('btch-downloader')
  } catch {
    return []
  }
  const fn = { instagram: btch.igdl, facebook: btch.fbdown, twitter: btch.twitter, tiktok: btch.ttdl }[platform]
  if (!fn) return []
  const data = await fn(url)
  return [...collectUrls(data?.result ?? data)].slice(0, 10)
}

/** Tebak jenis media dari URL / content-type. */
export async function mediaKind(url) {
  if (/\.(jpe?g|png|webp|heic)(\?|$)/i.test(url)) return 'image'
  if (/\.(mp3|m4a|aac|ogg|opus)(\?|$)/i.test(url)) return 'audio'
  if (/\.(mp4|mov|webm|mkv)(\?|$)/i.test(url)) return 'video'
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) })
    const ct = res.headers.get('content-type') || ''
    if (ct.startsWith('image/')) return 'image'
    if (ct.startsWith('audio/')) return 'audio'
  } catch {}
  return 'video'
}

/**
 * Unduh media dari URL apa pun.
 *  → { title, items: [{ kind, file?, url? }], cleanup() }
 */
export async function fetchMedia(url, { audio = false } = {}) {
  const platform = platformOf(url)
  if (platform === 'tiktok' && !audio) {
    try {
      const t = await tiktok(url)
      const items = t.images.length ? t.images.map((u) => ({ kind: 'image', url: u })) : [{ kind: 'video', url: t.video }]
      return { title: t.title, author: t.author, items, cleanup: () => {} }
    } catch (err) {
      log.warn('tikwm gagal, mencoba yt-dlp:', err.message)
    }
  }
  if (platform === 'tiktok' && audio) {
    try {
      const t = await tiktok(url)
      if (t.music) return { title: t.title, author: t.author, items: [{ kind: 'audio', url: t.music }], cleanup: () => {} }
    } catch {}
  }
  let ytErr
  try {
    const r = await ytdlp.download(url, { audio })
    return { title: r.title, items: r.files.map((f) => ({ kind: audio ? 'audio' : f.kind, file: f.file })), cleanup: r.cleanup }
  } catch (err) {
    ytErr = err
  }
  if (!audio && ['instagram', 'facebook', 'twitter', 'tiktok'].includes(platform)) {
    try {
      const urls = await fallback(platform, url)
      if (urls.length) return { title: '', items: await Promise.all(urls.map(async (u) => ({ kind: await mediaKind(u), url: u }))), cleanup: () => {} }
    } catch (err) {
      log.warn(`cadangan ${platform} gagal:`, err.message)
    }
  }
  throw ytErr
}
