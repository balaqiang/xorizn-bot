// Font Impact untuk fitur gambar (.smeme, .ttp). Disimpan di media/brat (sama dengan brat) dan diunduh sekali.
const fs = require('fs')
const path = require('path')
const axios = require('axios')

const FONT_URL = 'https://cdn.jsdelivr.net/gh/Napoleon-Fibonacci/assets@main/font/impact.ttf'
const FONT_FILE = path.join(__dirname, '..', 'media', 'brat', 'impact.ttf')
let ready = false

async function ensureFont() {
  if (ready) return 'Impact'
  const { GlobalFonts } = require('@napi-rs/canvas')
  if (!fs.existsSync(FONT_FILE)) {
    fs.mkdirSync(path.dirname(FONT_FILE), { recursive: true })
    const res = await axios.get(FONT_URL, { responseType: 'arraybuffer', timeout: 30000 })
    fs.writeFileSync(FONT_FILE, Buffer.from(res.data))
  }
  GlobalFonts.registerFromPath(FONT_FILE, 'Impact')
  ready = true
  return 'Impact'
}

// Pecah teks menjadi baris yang muat dalam maxWidth
function wrapText(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line)
      line = w
    } else line = test
  }
  if (line) lines.push(line)
  return lines
}

module.exports = { ensureFont, wrapText }
