// Kartu "Sedang Diputar" bergaya pemutar musik untuk .play2.
// draw() hanya memakai API Canvas 2D standar, jadi sama persis di @napi-rs/canvas (bot) dan browser (pratinjau).
const W = 720
const H = 1080
const ART = 560
const PAD = (W - ART) / 2
const BOLD = 'PlayerBold'
const REG = 'PlayerReg'

function rr(g, x, y, w, h, r) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

// potong teks dengan "…" agar muat
function fit(g, text, maxW) {
  if (g.measureText(text).width <= maxW) return text
  let t = text
  while (t.length > 1 && g.measureText(`${t}…`).width > maxW) t = t.slice(0, -1)
  return `${t.trimEnd()}…`
}

// teks dengan jarak antarhuruf, rata tengah
function spaced(g, text, cx, y, gap) {
  const widths = [...text].map((c) => g.measureText(c).width)
  const total = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1)
  let x = cx - total / 2
  g.textAlign = 'left'
  ;[...text].forEach((c, i) => {
    g.fillText(c, x, y)
    x += widths[i] + gap
  })
}

const tri = (g, pts) => {
  g.beginPath()
  g.moveTo(pts[0][0], pts[0][1])
  for (const p of pts.slice(1)) g.lineTo(p[0], p[1])
  g.closePath()
  g.fill()
}

function heart(g, cx, cy, s) {
  g.beginPath()
  g.moveTo(cx, cy + s * 0.9)
  g.bezierCurveTo(cx - s * 1.6, cy - s * 0.2, cx - s * 0.9, cy - s * 1.2, cx, cy - s * 0.3)
  g.bezierCurveTo(cx + s * 0.9, cy - s * 1.2, cx + s * 1.6, cy - s * 0.2, cx, cy + s * 0.9)
  g.closePath()
  g.stroke()
}

function shuffleIcon(g, cx, cy) {
  g.beginPath()
  g.moveTo(cx - 20, cy - 11); g.lineTo(cx - 8, cy - 11); g.bezierCurveTo(cx + 2, cy - 11, cx + 2, cy + 11, cx + 12, cy + 11); g.lineTo(cx + 16, cy + 11)
  g.moveTo(cx - 20, cy + 11); g.lineTo(cx - 8, cy + 11); g.bezierCurveTo(cx - 2, cy + 11, cx, cy + 7, cx + 3, cy + 3)
  g.moveTo(cx + 7, cy - 4); g.bezierCurveTo(cx + 9, cy - 8, cx + 11, cy - 11, cx + 14, cy - 11); g.lineTo(cx + 16, cy - 11)
  g.stroke()
  tri(g, [[cx + 15, cy - 19], [cx + 26, cy - 11], [cx + 15, cy - 3]])
  tri(g, [[cx + 15, cy + 3], [cx + 26, cy + 11], [cx + 15, cy + 19]])
}

function repeatIcon(g, cx, cy) {
  rr(g, cx - 22, cy - 13, 44, 26, 10)
  g.stroke()
  g.save()
  g.fillStyle = '#121212'
  g.fillRect(cx + 4, cy - 17, 14, 8)
  g.fillRect(cx - 18, cy + 9, 14, 8)
  g.restore()
  tri(g, [[cx + 2, cy - 21], [cx + 14, cy - 13], [cx + 2, cy - 5]])
  tri(g, [[cx - 2, cy + 5], [cx - 14, cy + 13], [cx - 2, cy + 21]])
}

// opts: { art (gambar), title, artist, duration, color:[r,g,b], label }
function draw(g, opts) {
  const { art, title = '', artist = '', duration = '0:00', color = [90, 110, 60], label = 'SEDANG DIPUTAR' } = opts
  const [r, gr, b] = color.map((v) => Math.round(v * 0.62))

  // latar: warna dominan cover memudar ke hitam
  g.fillStyle = '#121212'
  g.fillRect(0, 0, W, H)
  const bg = g.createLinearGradient(0, 0, 0, H * 0.7)
  bg.addColorStop(0, `rgb(${r},${gr},${b})`)
  bg.addColorStop(1, 'rgba(18,18,18,0)')
  g.fillStyle = bg
  g.fillRect(0, 0, W, H * 0.7)

  // judul kecil di atas
  g.fillStyle = 'rgba(255,255,255,0.78)'
  g.font = `22px ${BOLD}`
  g.textBaseline = 'alphabetic'
  spaced(g, label, W / 2, 84, 6)

  // cover (potong persegi dari tengah) dengan sudut membulat dan bayangan
  g.save()
  g.shadowColor = 'rgba(0,0,0,0.5)'
  g.shadowBlur = 44
  g.shadowOffsetY = 18
  g.fillStyle = '#000'
  rr(g, PAD, 130, ART, ART, 28)
  g.fill()
  g.restore()
  g.save()
  rr(g, PAD, 130, ART, ART, 28)
  g.clip()
  if (art) {
    const side = Math.min(art.width, art.height)
    g.drawImage(art, (art.width - side) / 2, (art.height - side) / 2, side, side, PAD, 130, ART, ART)
  } else {
    g.fillStyle = '#2a2a2a'
    g.fillRect(PAD, 130, ART, ART)
  }
  g.restore()

  // judul lagu + artis + ikon hati
  g.textAlign = 'left'
  g.fillStyle = '#ffffff'
  g.font = `44px ${BOLD}`
  g.fillText(fit(g, title, ART - 80), PAD, 780)
  g.fillStyle = '#b3b3b3'
  g.font = `30px ${REG}`
  g.fillText(fit(g, artist, ART - 80), PAD, 828)
  g.strokeStyle = 'rgba(255,255,255,0.85)'
  g.lineWidth = 3.5
  g.lineJoin = 'round'
  heart(g, W - PAD - 24, 790, 17)

  // bilah progres + waktu
  g.fillStyle = 'rgba(255,255,255,0.28)'
  rr(g, PAD, 884, ART, 8, 4)
  g.fill()
  g.fillStyle = '#ffffff'
  g.beginPath()
  g.arc(PAD + 5, 888, 8, 0, Math.PI * 2)
  g.fill()
  g.fillStyle = '#b3b3b3'
  g.font = `22px ${REG}`
  g.textAlign = 'left'
  g.fillText('0:00', PAD, 934)
  g.textAlign = 'right'
  g.fillText(duration, W - PAD, 934)

  // tombol kontrol
  const cy = 1006
  g.strokeStyle = '#b3b3b3'
  g.fillStyle = '#b3b3b3'
  g.lineWidth = 4
  g.lineCap = 'round'
  shuffleIcon(g, PAD + 34, cy)
  repeatIcon(g, W - PAD - 34, cy)
  g.fillStyle = '#ffffff'
  tri(g, [[W / 2 - 112 + 22, cy - 18], [W / 2 - 112 + 22, cy + 18], [W / 2 - 112 - 4, cy]])
  g.fillRect(W / 2 - 112 - 8, cy - 18, 5, 36)
  tri(g, [[W / 2 + 112 - 22, cy - 18], [W / 2 + 112 - 22, cy + 18], [W / 2 + 112 + 4, cy]])
  g.fillRect(W / 2 + 112 + 4, cy - 18, 5, 36)
  g.beginPath()
  g.arc(W / 2, cy, 54, 0, Math.PI * 2)
  g.fill()
  g.fillStyle = '#121212'
  tri(g, [[W / 2 - 15, cy - 24], [W / 2 - 15, cy + 24], [W / 2 + 26, cy]])
}

// ---------- sisi server (bot) ----------
let fontsReady = false
function registerFonts() {
  if (fontsReady) return
  const path = require('path')
  const { GlobalFonts } = require('@napi-rs/canvas')
  const dir = path.join(__dirname, '..', 'assets', 'fonts')
  GlobalFonts.registerFromPath(path.join(dir, 'Outfit-Bold.ttf'), BOLD)
  GlobalFonts.registerFromPath(path.join(dir, 'Outfit-Regular.ttf'), REG)
  fontsReady = true
}

// Warna rata-rata cover (untuk latar). Gagal -> warna bawaan.
async function dominant(buffer) {
  try {
    const { data } = await require('sharp')(buffer).resize(1, 1).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    return [data[0], data[1], data[2]]
  } catch {
    return [90, 110, 60]
  }
}

async function render({ artBuffer, title, artist, duration }) {
  registerFonts()
  const { createCanvas, loadImage } = require('@napi-rs/canvas')
  const art = artBuffer ? await loadImage(artBuffer) : null
  const cv = createCanvas(W, H)
  draw(cv.getContext('2d'), { art, title, artist, duration, color: artBuffer ? await dominant(artBuffer) : undefined })
  return cv.encode('jpeg', 90)
}

module.exports = { draw, render, W, H, BOLD, REG, fit }
