// lib/portkit/yt.js — pengganti lib/scrape/youtube.js bot asal (tidak ada di zip) memakai mesin YouTube bawaan xorizn-bot:
// pencarian = lib/youtube.js, unduhan = lib/loaderto.js (savenow). API sama: searchYouTube(q) & download(url, 'mp3'|'720').
'use strict'
const axios = require('axios')
const yt = require('../../youtube')
const loader = require('../../loaderto')

async function searchYouTube(query) {
  const r = await yt.search(String(query), 1)
  return r && r[0] ? r[0] : null
}

async function sizeOf(url) {
  try {
    const h = await axios.head(url, { timeout: 12000, maxRedirects: 5 })
    const n = Number(h.headers['content-length'])
    return Number.isFinite(n) && n > 0 ? n : 0
  } catch {
    return 0
  }
}

// format: 'mp3' | '360' | '480' | '720' | '1080'
async function download(url, format = 'mp3') {
  const r = await loader.get(url, format)
  return { downloadUrl: r.url, title: r.title, thumb: r.thumb, file: { contentLength: await sizeOf(r.url) } }
}

module.exports = { searchYouTube, download }
