// lib/sahril/playch.js — pengganti lib/scrape/playch.js bot asal: pencarian YouTube, unduh audio Savetube, ubah ke voice note (opus).
'use strict'
const yt = require('../../youtube')
const savetube = require('../../savetube')
const ffm = require('../../ffm')

// -> [{ title, link, channel, ... }]
async function searchYoutube(query) {
  const list = await yt.search(String(query), 5)
  return (list || []).map((v) => ({ ...v, link: v.url }))
}

const axios = require('axios')
const fs = require('fs')

const UA = 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36'
const looksBad = (buf) => {
  if (!buf || buf.length < 2048) return 'file kosong / terlalu kecil'
  const head = buf.subarray(0, 64).toString('utf8').trimStart().toLowerCase()
  return head.startsWith('<') || head.startsWith('{') ? 'server mengirim halaman error' : ''
}
async function fetchBuf(url) {
  const r = await axios.get(url, { responseType: 'arraybuffer', timeout: 60000, maxRedirects: 5, headers: { 'user-agent': UA, accept: '*/*', referer: 'https://yt.savetube.me/' } })
  const buf = Buffer.from(r.data)
  const bad = looksBad(buf)
  if (bad) throw new Error(bad)
  return buf
}

// Unduh audio YouTube dengan beberapa mesin berurutan sampai ada yang benar-benar menghasilkan file audio.
// -> { title, download_url, buffer }
async function downloadYoutube(link) {
  const errs = []
  const engines = [
    ['savetube', async () => { const r = await savetube.audio(link); return { title: r.title, buffer: await fetchBuf(r.url), url: r.url } }],
    ['loader', async () => { const r = await require('../../loaderto').get(link, 'mp3'); return { title: r.title, buffer: await fetchBuf(r.url), url: r.url } }],
    ['ytultra', async () => {
      const u = require('../../ytultra'); const { title, medias } = await u.fetchMedias(link); const m = u.pick(medias, { audio: true })
      if (!m) throw new Error('media audio tidak ada'); return { title, buffer: await fetchBuf(m.url), url: m.url }
    }],
    ['yt-dlp', async () => {
      const r = await require('../../ytdlp').download(link, { audio: true })
      try { const f = r.files[0].file; const buffer = fs.readFileSync(f); const bad = looksBad(buffer); if (bad) throw new Error(bad); return { title: r.title, buffer, url: '' } } finally { try { r.cleanup() } catch {} }
    }]
  ]
  for (const [name, fn] of engines) {
    try {
      const r = await fn()
      console.log(`[PLAYCH] audio via ${name} (${r.buffer.length} byte)`)
      return { title: r.title, download_url: r.url, buffer: r.buffer }
    } catch (e) {
      errs.push(`${name}: ${e.message}`)
      console.log(`[PLAYCH] ${name} gagal: ${e.message}`)
    }
  }
  throw new Error('Semua mesin unduh gagal (' + errs.join('; ') + ')')
}

// buffer audio apa saja -> OGG/Opus mono (voice note). Coba beberapa encoder opus; ffmpeg bawaan paket dipakai kalau ffmpeg sistem gagal.
async function Toptt(buffer) {
  const buf = Buffer.from(buffer)
  if (buf.length < 2048) throw new Error('Audio hasil unduhan kosong / terlalu kecil (link Savetube kedaluwarsa)')
  const head = buf.subarray(0, 64).toString('utf8').trimStart().toLowerCase()
  if (head.startsWith('<') || head.startsWith('{')) throw new Error('Server mengirim halaman error, bukan file audio')
  const attempts = [
    ['-c:a', 'libopus', '-b:a', '48k', '-application', 'voip'],
    ['-c:a', 'libopus', '-b:a', '48k'],
    ['-c:a', 'opus', '-strict', '-2', '-b:a', '48k']
  ]
  let last
  for (const enc of attempts) {
    try {
      return await ffm.run(buf, 'ogg', (i, o) => ['-i', i, '-vn', '-map_metadata', '-1', ...enc, '-ac', '1', '-ar', '48000', '-f', 'ogg', o], 120000)
    } catch (e) {
      last = e
      if (e.message === 'timeout') break
    }
  }
  throw new Error('Gagal convert ke voice note: ' + (last && last.message))
}

module.exports = { searchYoutube, downloadYoutube, Toptt }
