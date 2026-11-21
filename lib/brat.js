// Helper bersama untuk .brat (stiker diam) dan .bratgif (stiker animasi)
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')
const { getQuotedText } = require('./utils')

const THEMES = { black: 'black', hitam: 'black', white: 'white', putih: 'white', green: 'green', hijau: 'green' }
const MAX_CHARS = 100
const MAX_QUEUE = 4 // render memakai CPU, jadi dikerjakan satu per satu

let waiting = 0
let tail = Promise.resolve()
let lib = null
let ffmpegOk

const hasFfmpeg = () => (ffmpegOk ??= spawnSync('ffmpeg', ['-version']).status === 0)
const load = async () => (lib ??= await import('./bratvid.mjs'))

// [tema] [blur0-3] <teks>  (atau reply pesan)
function parseOptions(args, msg) {
  const words = [...args]
  let theme
  let blur
  while (words.length) {
    const w = words[0].toLowerCase()
    if (THEMES[w]) theme = THEMES[w]
    else if (/^blur[0-3]$/.test(w)) blur = Number(w.slice(4))
    else break
    words.shift()
  }
  const text = (words.join(' ') || getQuotedText(msg)).replace(/\s+/g, ' ').trim()
  return { theme, blur, text }
}

// Jalankan job berat berurutan. Mengembalikan { error } kalau antrian penuh.
async function enqueue(job, onWait) {
  if (waiting >= MAX_QUEUE) return { error: 'Antrian pembuatan brat penuh. Coba lagi sebentar lagi.' }
  waiting++
  if (waiting > 1 && onWait) await onWait(waiting - 1)
  const run = tail.then(job)
  tail = run.catch(() => {})
  try {
    return { value: await run }
  } catch (err) {
    console.log('[BRAT] render gagal:', err)
    return { error: explain(err) }
  } finally {
    waiting--
  }
}

async function renderImage(options) {
  const { makeBratImage } = await load()
  return makeBratImage(options)
}

async function renderVideo(options) {
  const { makeBrat } = await load()
  const out = path.join(os.tmpdir(), `brat-${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`)
  try {
    await makeBrat({ ...options, out, format: 'mp4', hold: 1.2 })
    return fs.readFileSync(out)
  } finally {
    fs.rmSync(out, { force: true })
  }
}

function explain(err) {
  return err.code === 'ERR_MODULE_NOT_FOUND'
    ? 'Modul @napi-rs/canvas belum terpasang. Owner perlu menjalankan npm install lalu restart bot.'
    : 'Gagal membuat brat. Coba lagi nanti.'
}

module.exports = { MAX_CHARS, parseOptions, enqueue, renderImage, renderVideo, hasFfmpeg, explain }
