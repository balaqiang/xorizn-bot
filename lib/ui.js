// =====================================================================
//  lib/ui.js  —  TAMPILAN BARU "kece" (file tambahan, tidak mengubah file lama)
//  Isi: renderer kartu gambar (canvas) + helper teks / tombol untuk plugins/ui/*
//  draw*() hanya memakai API Canvas 2D standar (sama persis di @napi-rs/canvas & browser).
// =====================================================================
const os = require('os')
const path = require('path')

// ---------- Pengaturan tampilan (ubah di sini) ----------
const OPTS = {
  urlButtons: true, // tombol link (Saluran / Grup / Owner) di menu. false = hanya tombol balas + list
  avatar: true,     // ambil foto profil WhatsApp untuk kartu. false = pakai inisial
  accent: ['#7c5cff', '#00d4ff'] // warna utama tema (ungu → cyan)
}

const BOLD = 'UiBold'
const REG = 'UiReg'

// ---------- Label kategori (sama dengan menu lama) ----------
const LABELS = { info: 'INFO', group: 'GRUP', sticker: 'STIKER', downloader: 'DOWNLOADER', game: 'GAME', fun: 'FUN', tools: 'TOOLS', image: 'GAMBAR', audio: 'AUDIO', video: 'VIDEO', dokumen: 'DOKUMEN', islam: 'ISLAMI', channel: 'SALURAN', owner: 'OWNER' }
const DESCS = {
  info: 'Info & status bot',
  group: 'Tools admin grup',
  sticker: 'Pembuat stiker',
  downloader: 'Play, TikTok, Instagram, YouTube',
  game: 'Ekonomi & game tombol',
  fun: 'Hiburan',
  tools: 'Alat bantu',
  image: 'Editor & efek gambar',
  audio: 'Efek & editor audio',
  video: 'Editor video',
  dokumen: 'PDF, OCR, ZIP, konversi file',
  islam: 'Asmaul Husna, kiblat, doa',
  channel: 'Saluran WhatsApp',
  owner: 'Khusus owner'
}
// deskripsi panjang untuk baris list (gaya "command" di tombol)
const LONGDESCS = {
  info: 'Lihat status, ping, profil, dan informasi lengkap seputar bot',
  group: 'Kelola grup dengan fitur moderasi dan kontrol penuh',
  sticker: 'Buat stiker keren dari foto, video, dan teks dengan cepat',
  downloader: 'Download video, audio, dan gambar dari berbagai platform',
  game: 'Main game seru, kumpulkan uang, naik level, dan rebut peringkat',
  fun: 'Kumpulan hiburan, tebak-tebakan, ramalan, dan candaan seru',
  tools: 'Alat bantu serbaguna untuk kebutuhan sehari-hari kamu',
  image: 'Edit foto, filter, palet warna, ASCII, dan masih banyak lagi',
  audio: 'Bass boost, nightcore, 8D, slowed, dan efek suara lainnya',
  video: 'Potong, balik, loop, beri teks, dan edit video dengan mudah',
  dokumen: 'PDF ke gambar, gambar ke PDF, OCR, ZIP, dan pengolah file lainnya',
  islam: 'Asmaul Husna, arah kiblat, doa harian, dan bacaan ibadah',
  channel: 'Posting, kirim lagu, dan kelola Saluran WhatsApp',
  owner: 'Kontrol penuh bot, khusus untuk owner'
}
const CAT_COLORS = {
  info: ['#00c6ff', '#0072ff'],
  group: ['#43e97b', '#38f9d7'],
  sticker: ['#f093fb', '#f5576c'],
  downloader: ['#4facfe', '#00f2fe'],
  game: ['#fa709a', '#fee140'],
  fun: ['#ffb347', '#ff5e62'],
  tools: ['#a18cd1', '#fbc2eb'],
  image: ['#ff9a9e', '#fad0c4'],
  audio: ['#667eea', '#764ba2'],
  video: ['#f5576c', '#f093fb'],
  dokumen: ['#4facfe', '#a8edea'],
  islam: ['#11998e', '#38ef7d'],
  channel: ['#25d366', '#128c7e'],
  owner: ['#f7971e', '#ffd200']
}

// Kategori baku (lib/categories.json): urutan, label & deskripsi untuk semua kategori; kategori lama tetap dikenali lewat alias
{
  const cats = require('./categories')
  const L = {}
  const D = {}
  const LD = {}
  for (const c of cats.ORDER) {
    L[c] = cats.labelOf(c)
    D[c] = cats.descOf(c)
    LD[c] = cats.descOf(c)
  }
  for (const k of Object.keys(LABELS)) delete LABELS[k]
  for (const k of Object.keys(DESCS)) delete DESCS[k]
  for (const k of Object.keys(LONGDESCS)) delete LONGDESCS[k]
  Object.assign(LABELS, L)
  Object.assign(DESCS, D)
  Object.assign(LONGDESCS, LD)
}

// =====================================================================
//  Helper warna & gambar dasar
// =====================================================================
function hex2rgb(h) {
  h = h.replace('#', '')
  if (h.length === 3) h = [...h].map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function hsl2hex(h, s, l) {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const x = (v) => Math.round(255 * v).toString(16).padStart(2, '0')
  return `#${x(f(0))}${x(f(8))}${x(f(4))}`
}
function catColors(cat) {
  if (CAT_COLORS[cat]) return CAT_COLORS[cat]
  let h = 0
  for (const c of String(cat)) h = (h * 31 + c.charCodeAt(0)) % 360
  return [hsl2hex(h, 85, 60), hsl2hex((h + 40) % 360, 85, 55)]
}
const rgba = (hex, a) => {
  const [r, g, b] = hex2rgb(hex)
  return `rgba(${r},${g},${b},${a})`
}

function rr(g, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2)
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

function glow(g, x, y, r, hex, a) {
  const rg = g.createRadialGradient(x, y, 0, x, y, r)
  rg.addColorStop(0, rgba(hex, a))
  rg.addColorStop(1, rgba(hex, 0))
  g.fillStyle = rg
  g.fillRect(x - r, y - r, r * 2, r * 2)
}

function background(g, w, h, accent = OPTS.accent) {
  const bg = g.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#080814')
  bg.addColorStop(1, '#17133a')
  g.fillStyle = bg
  g.fillRect(0, 0, w, h)
  glow(g, w * 0.92, h * 0.05, Math.max(w, h) * 0.5, accent[0], 0.42)
  glow(g, w * 0.04, h * 1.0, Math.max(w, h) * 0.45, accent[1], 0.3)
  // grid titik halus
  g.fillStyle = 'rgba(255,255,255,0.045)'
  for (let x = 24; x < w; x += 40) for (let y = 24; y < h; y += 40) g.fillRect(x, y, 2, 2)
}

function glass(g, x, y, w, h, r = 28, tint = 'rgba(255,255,255,0.06)') {
  g.save()
  g.shadowColor = 'rgba(0,0,0,0.45)'
  g.shadowBlur = 34
  g.shadowOffsetY = 14
  g.fillStyle = tint
  rr(g, x, y, w, h, r)
  g.fill()
  g.restore()
  g.strokeStyle = 'rgba(255,255,255,0.14)'
  g.lineWidth = 1.6
  rr(g, x, y, w, h, r)
  g.stroke()
}

function fit(g, text, maxW) {
  text = String(text)
  if (g.measureText(text).width <= maxW) return text
  let t = text
  while (t.length > 1 && g.measureText(`${t}…`).width > maxW) t = t.slice(0, -1)
  return `${t.trimEnd()}…`
}

// kecilkan ukuran font sampai teks muat
function fitSize(g, text, size, maxW, family = BOLD, min = 18) {
  while (size > min) {
    g.font = `${size}px ${family}`
    if (g.measureText(text).width <= maxW) break
    size -= 2
  }
  g.font = `${size}px ${family}`
  return size
}

function spaced(g, text, x, y, gap, align = 'left') {
  const chars = [...text]
  const widths = chars.map((c) => g.measureText(c).width)
  const total = widths.reduce((a, b) => a + b, 0) + gap * (chars.length - 1)
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x
  const prev = g.textAlign
  g.textAlign = 'left'
  chars.forEach((c, i) => {
    g.fillText(c, cx, y)
    cx += widths[i] + gap
  })
  g.textAlign = prev
}

function gradText(g, text, x, y, colors, align = 'left') {
  const w = g.measureText(text).width
  const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x
  const gr = g.createLinearGradient(x0, 0, x0 + w, 0)
  gr.addColorStop(0, colors[0])
  gr.addColorStop(1, colors[1])
  g.fillStyle = gr
  g.textAlign = align
  g.fillText(text, x, y)
}

// pil kecil; mengembalikan lebar. align 'left' (x = kiri) atau 'center' (x = tengah)
function pill(g, text, x, y, o = {}) {
  const { h = 44, size = 22, padX = 22, fill = 'rgba(255,255,255,0.1)', color = '#fff', stroke, dot, align = 'left', family = BOLD } = o
  g.font = `${size}px ${family}`
  const tw = g.measureText(text).width
  const w = tw + padX * 2 + (dot ? 26 : 0)
  const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x
  g.fillStyle = fill
  rr(g, x0, y, w, h, h / 2)
  g.fill()
  if (stroke) {
    g.strokeStyle = stroke
    g.lineWidth = 1.6
    rr(g, x0, y, w, h, h / 2)
    g.stroke()
  }
  let tx = x0 + padX
  if (dot) {
    g.fillStyle = dot
    g.beginPath()
    g.arc(x0 + padX + 6, y + h / 2, 6, 0, Math.PI * 2)
    g.fill()
    tx += 26
  }
  g.fillStyle = color
  g.textAlign = 'left'
  g.textBaseline = 'middle'
  g.fillText(text, tx, y + h / 2 + 1)
  g.textBaseline = 'alphabetic'
  return w
}

function progress(g, x, y, w, h, pct, colors = OPTS.accent) {
  g.fillStyle = 'rgba(255,255,255,0.12)'
  rr(g, x, y, w, h, h / 2)
  g.fill()
  const fw = Math.max(h, (w * Math.min(100, Math.max(0, pct))) / 100)
  const gr = g.createLinearGradient(x, 0, x + w, 0)
  gr.addColorStop(0, colors[0])
  gr.addColorStop(1, colors[1])
  g.fillStyle = gr
  rr(g, x, y, fw, h, h / 2)
  g.fill()
}

function avatarCircle(g, img, cx, cy, r, ring, label = '?') {
  // cincin gradien
  const gr = g.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
  gr.addColorStop(0, ring[0])
  gr.addColorStop(1, ring[1])
  g.fillStyle = gr
  g.beginPath()
  g.arc(cx, cy, r + 8, 0, Math.PI * 2)
  g.fill()
  g.fillStyle = '#0d0d22'
  g.beginPath()
  g.arc(cx, cy, r + 3, 0, Math.PI * 2)
  g.fill()
  g.save()
  g.beginPath()
  g.arc(cx, cy, r, 0, Math.PI * 2)
  g.clip()
  if (img) {
    const side = Math.min(img.width, img.height)
    g.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, cx - r, cy - r, r * 2, r * 2)
  } else {
    const fg = g.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
    fg.addColorStop(0, ring[0])
    fg.addColorStop(1, ring[1])
    g.fillStyle = fg
    g.fillRect(cx - r, cy - r, r * 2, r * 2)
    g.fillStyle = '#fff'
    g.font = `${Math.round(r * 0.95)}px ${BOLD}`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(initials(label), cx, cy + r * 0.04)
    g.textBaseline = 'alphabetic'
  }
  g.restore()
}

const initials = (name) => {
  const s = String(name || '?').replace(/[^\p{L}\p{N}\s]/gu, ' ').trim()
  const parts = s.split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)).toUpperCase()
}

// ---------- Ikon kategori (digambar dengan garis, tanpa emoji supaya aman di server) ----------
function icon(g, cat, cx, cy, size, color = '#fff') {
  // v7: ikon Font Awesome (Path2D); kalau tidak tersedia -> gambar garis bawaan di bawah
  const fa = require('./fa')
  if (fa.CAT[cat] && fa.draw(g, fa.CAT[cat], cx, cy, size * 0.8, color)) return
  g.save()
  g.translate(cx, cy)
  g.scale(size / 100, size / 100)
  g.strokeStyle = color
  g.fillStyle = color
  g.lineWidth = 7
  g.lineCap = 'round'
  g.lineJoin = 'round'
  const circle = (x, y, r, fill) => {
    g.beginPath()
    g.arc(x, y, r, 0, Math.PI * 2)
    fill ? g.fill() : g.stroke()
  }
  const line = (x1, y1, x2, y2) => {
    g.beginPath()
    g.moveTo(x1, y1)
    g.lineTo(x2, y2)
    g.stroke()
  }
  switch (cat) {
    case 'info':
      circle(0, 0, 38)
      circle(0, -17, 5, true)
      line(0, -4, 0, 22)
      break
    case 'group':
      circle(-17, -16, 13)
      circle(17, -16, 13)
      g.beginPath()
      g.arc(-17, 30, 24, Math.PI * 1.08, Math.PI * 1.92)
      g.stroke()
      g.beginPath()
      g.arc(17, 30, 24, Math.PI * 1.08, Math.PI * 1.92)
      g.stroke()
      break
    case 'sticker':
      rr(g, -36, -36, 72, 72, 18)
      g.stroke()
      circle(-13, -9, 4.5, true)
      circle(13, -9, 4.5, true)
      g.beginPath()
      g.arc(0, 4, 19, Math.PI * 0.15, Math.PI * 0.85)
      g.stroke()
      break
    case 'downloader':
      line(0, -38, 0, 14)
      g.beginPath()
      g.moveTo(-20, -6)
      g.lineTo(0, 16)
      g.lineTo(20, -6)
      g.stroke()
      g.beginPath()
      g.moveTo(-36, 10)
      g.lineTo(-36, 36)
      g.lineTo(36, 36)
      g.lineTo(36, 10)
      g.stroke()
      break
    case 'game':
      rr(g, -44, -24, 88, 52, 24)
      g.stroke()
      line(-26, 2, -10, 2)
      line(-18, -6, -18, 10)
      circle(14, -2, 5, true)
      circle(28, 8, 5, true)
      break
    case 'fun':
      circle(0, 0, 38)
      circle(-14, -10, 5, true)
      circle(14, -10, 5, true)
      g.beginPath()
      g.arc(0, 4, 21, Math.PI * 0.12, Math.PI * 0.88)
      g.stroke()
      break
    case 'tools':
      circle(0, 0, 15)
      circle(0, 0, 27)
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4
        line(Math.cos(a) * 27, Math.sin(a) * 27, Math.cos(a) * 40, Math.sin(a) * 40)
      }
      break
    case 'channel': // pengeras suara + gelombang siaran
      g.beginPath()
      g.moveTo(-34, -12)
      g.lineTo(-10, -12)
      g.lineTo(18, -34)
      g.lineTo(18, 34)
      g.lineTo(-10, 12)
      g.lineTo(-34, 12)
      g.closePath()
      g.stroke()
      g.beginPath()
      g.arc(18, 0, 22, -Math.PI * 0.3, Math.PI * 0.3)
      g.stroke()
      g.beginPath()
      g.arc(18, 0, 38, -Math.PI * 0.3, Math.PI * 0.3)
      g.stroke()
      break
    case 'owner':
      g.beginPath()
      g.moveTo(-36, 26)
      g.lineTo(-40, -22)
      g.lineTo(-18, -2)
      g.lineTo(0, -32)
      g.lineTo(18, -2)
      g.lineTo(40, -22)
      g.lineTo(36, 26)
      g.closePath()
      g.stroke()
      circle(-40, -26, 5, true)
      circle(0, -36, 5, true)
      circle(40, -26, 5, true)
      break
    default:
      for (const [x, y] of [[-22, -22], [22, -22], [-22, 22], [22, 22]]) {
        rr(g, x - 17, y - 17, 34, 34, 9)
        g.stroke()
      }
  }
  g.restore()
}

// =====================================================================
//  KARTU GAMBAR  (semua 1280x720 kecuali tile 900x900)
// =====================================================================
const SIZE = { home: [1280, 720], card: [1280, 720], status: [1280, 720], podium: [1280, 720], category: [1280, 720], tile: [900, 900], banner: [1280, 420] }

// ---- Beranda menu ----
// o: { botName, greet, name, status, level, pct, exp, expNeed, rank, rankTotal, uptime, total, cats, users, prefix, avatar }
function drawHome(g, o) {
  const [W, H] = SIZE.home
  background(g, W, H)
  g.textBaseline = 'alphabetic'

  // kiri
  g.textAlign = 'left'
  pill(g, 'ONLINE', 80, 64, { dot: '#3dff9a', size: 20, h: 40, fill: 'rgba(61,255,154,0.12)', color: '#b9ffd9' })
  pill(g, `PREFIX  ${o.prefix}`, 80 + 160, 64, { size: 20, h: 40, color: '#cfd3ff' })

  const title = String(o.botName).toUpperCase()
  fitSize(g, title, 128, 660, BOLD, 56)
  gradText(g, title, 76, 262, OPTS.accent)
  g.fillStyle = 'rgba(255,255,255,0.62)'
  g.font = `34px ${REG}`
  g.textAlign = 'left'
  g.fillText('WhatsApp Assistant Bot', 82, 318)

  g.fillStyle = 'rgba(255,255,255,0.55)'
  g.font = `36px ${REG}`
  g.fillText(`${o.greet},`, 82, 430)
  g.fillStyle = '#fff'
  fitSize(g, o.name, 64, 660, BOLD, 30)
  g.fillText(o.name, 80, 496)

  // chip statistik
  const chips = [['UPTIME', o.uptime], ['FITUR', String(o.total)], ['KATEGORI', String(o.cats)], ['USER', String(o.users)]]
  chips.forEach(([k, v], i) => {
    const x = 80 + i * 164
    glass(g, x, 560, 150, 96, 22, 'rgba(255,255,255,0.07)')
    g.fillStyle = 'rgba(255,255,255,0.5)'
    g.font = `17px ${BOLD}`
    g.textAlign = 'left'
    spaced(g, k, x + 20, 596, 3)
    g.fillStyle = '#fff'
    fitSize(g, v, 34, 112, BOLD, 18)
    g.textAlign = 'left'
    g.fillText(v, x + 20, 638)
  })

  // panel profil (kanan)
  glass(g, 790, 56, 430, 608, 40)
  avatarCircle(g, o.avatar, 1005, 200, 84, OPTS.accent, o.name)
  g.fillStyle = '#fff'
  g.textAlign = 'center'
  fitSize(g, o.name, 40, 370, BOLD, 24)
  g.fillText(o.name, 1005, 346)
  pill(g, o.status, 1005, 366, { align: 'center', size: 20, h: 38, fill: rgba(OPTS.accent[0], 0.28), color: '#fff' })

  g.textAlign = 'left'
  g.fillStyle = 'rgba(255,255,255,0.6)'
  g.font = `22px ${REG}`
  g.fillText(`LEVEL ${o.level}`, 830, 468)
  g.textAlign = 'right'
  g.fillStyle = '#fff'
  g.font = `22px ${BOLD}`
  g.fillText(`${o.pct}%`, 1180, 468)
  progress(g, 830, 482, 350, 18, o.pct)
  g.textAlign = 'left'
  g.fillStyle = 'rgba(255,255,255,0.5)'
  g.font = `20px ${REG}`
  g.fillText(`EXP  ${o.exp} / ${o.expNeed}`, 830, 536)

  // rank & uptime kecil
  glass(g, 830, 568, 168, 70, 20, 'rgba(255,255,255,0.07)')
  glass(g, 1012, 568, 168, 70, 20, 'rgba(255,255,255,0.07)')
  g.textAlign = 'center'
  g.fillStyle = 'rgba(255,255,255,0.5)'
  g.font = `15px ${BOLD}`
  spaced(g, 'PERINGKAT', 914, 590, 2, 'center')
  spaced(g, 'LIMIT', 1096, 590, 2, 'center')
  g.fillStyle = '#fff'
  g.font = `28px ${BOLD}`
  g.fillText(o.rank ? `#${o.rank}` : '-', 914, 624)
  g.fillText(String(o.limit ?? '-'), 1096, 624)
}

// ---- Kartu profil ----
// o: { botName, name, number, status, level, pct, exp, expNeed, money, bank, limit, rank, rankTotal, avatar }
function drawCard(g, o) {
  const [W, H] = SIZE.card
  background(g, W, H)
  glass(g, 56, 56, 1168, 608, 44)
  g.textBaseline = 'alphabetic'

  // kiri: avatar
  avatarCircle(g, o.avatar, 262, 292, 128, OPTS.accent, o.name)
  g.fillStyle = '#fff'
  g.textAlign = 'center'
  fitSize(g, o.name, 46, 340, BOLD, 24)
  g.fillText(o.name, 262, 496)
  g.fillStyle = 'rgba(255,255,255,0.5)'
  g.font = `24px ${REG}`
  g.fillText(`+${o.number}`, 262, 534)
  pill(g, o.status, 262, 562, { align: 'center', size: 22, h: 42, fill: rgba(OPTS.accent[0], 0.3) })

  // kanan: judul
  g.textAlign = 'left'
  g.fillStyle = 'rgba(255,255,255,0.55)'
  g.font = `22px ${BOLD}`
  spaced(g, `${String(o.botName).toUpperCase()}  •  KARTU PLAYER`, 480, 124, 5)

  const tiles = [
    ['LEVEL', String(o.level)],
    ['LIMIT', String(o.limit)],
    ['MONEY', o.money],
    ['BANK', o.bank]
  ]
  tiles.forEach(([k, v], i) => {
    const x = 480 + (i % 2) * 350
    const y = 152 + Math.floor(i / 2) * 150
    glass(g, x, y, 330, 130, 26, 'rgba(255,255,255,0.07)')
    g.fillStyle = 'rgba(255,255,255,0.5)'
    g.font = `20px ${BOLD}`
    g.textAlign = 'left'
    spaced(g, k, x + 28, y + 42, 4)
    g.fillStyle = '#fff'
    fitSize(g, v, 46, 270, BOLD, 22)
    g.textAlign = 'left'
    g.fillText(v, x + 28, y + 100)
  })

  g.fillStyle = 'rgba(255,255,255,0.6)'
  g.font = `22px ${REG}`
  g.textAlign = 'left'
  g.fillText('EXP', 480, 496)
  g.textAlign = 'right'
  g.fillStyle = '#fff'
  g.font = `22px ${BOLD}`
  g.fillText(`${o.exp} / ${o.expNeed}  (${o.pct}%)`, 1160, 496)
  progress(g, 480, 512, 680, 22, o.pct)

  if (o.rank) {
    pill(g, `PERINGKAT  #${o.rank} dari ${o.rankTotal}`, 480, 570, { size: 22, h: 46, fill: 'rgba(255,255,255,0.1)' })
  }
}

// ---- Dashboard server ----
// o: { botName, cpu, ram, ramText, heap, heapText, uptime, ping, plugins, users, node }
function gauge(g, cx, cy, r, pct, label, text, colors) {
  const a0 = Math.PI * 0.75
  const sweep = Math.PI * 1.5
  g.lineCap = 'round'
  g.lineWidth = 22
  g.strokeStyle = 'rgba(255,255,255,0.1)'
  g.beginPath()
  g.arc(cx, cy, r, a0, a0 + sweep)
  g.stroke()
  const gr = g.createLinearGradient(cx - r, cy + r, cx + r, cy - r)
  gr.addColorStop(0, colors[0])
  gr.addColorStop(1, colors[1])
  g.strokeStyle = gr
  g.beginPath()
  g.arc(cx, cy, r, a0, a0 + sweep * Math.max(0.01, Math.min(1, pct / 100)))
  g.stroke()
  g.textAlign = 'center'
  g.fillStyle = '#fff'
  g.font = `56px ${BOLD}`
  g.fillText(`${Math.round(pct)}%`, cx, cy + 14)
  g.fillStyle = 'rgba(255,255,255,0.55)'
  g.font = `22px ${BOLD}`
  spaced(g, label, cx, cy + r + 52, 4, 'center')
  g.fillStyle = 'rgba(255,255,255,0.4)'
  g.font = `20px ${REG}`
  g.fillText(text, cx, cy + r + 82)
}

function drawStatus(g, o) {
  const [W, H] = SIZE.status
  background(g, W, H)
  g.textBaseline = 'alphabetic'
  g.textAlign = 'left'
  g.font = `70px ${BOLD}`
  gradText(g, 'DASHBOARD', 78, 126, OPTS.accent)
  g.fillStyle = 'rgba(255,255,255,0.55)'
  g.font = `26px ${REG}`
  g.textAlign = 'left'
  g.fillText(`${o.botName} • status server`, 82, 170)
  pill(g, 'ONLINE', 1200 - 150, 78, { dot: '#3dff9a', size: 22, h: 46, fill: 'rgba(61,255,154,0.12)', color: '#b9ffd9' })

  gauge(g, 240, 330, 98, o.cpu, 'CPU', o.cpuText, ['#00d4ff', '#7c5cff'])
  gauge(g, 640, 330, 98, o.ram, 'RAM', o.ramText, ['#43e97b', '#38f9d7'])
  gauge(g, 1040, 330, 98, o.heap, 'HEAP BOT', o.heapText, ['#fa709a', '#fee140'])

  const tiles = [['UPTIME', o.uptime], ['PING', o.ping], ['PLUGIN', String(o.plugins)], ['USER', String(o.users)], ['NODE', o.node]]
  tiles.forEach(([k, v], i) => {
    const x = 80 + i * 227
    glass(g, x, 560, 212, 104, 24, 'rgba(255,255,255,0.07)')
    g.fillStyle = 'rgba(255,255,255,0.5)'
    g.font = `17px ${BOLD}`
    g.textAlign = 'left'
    spaced(g, k, x + 22, 596, 3)
    g.fillStyle = '#fff'
    fitSize(g, v, 36, 170, BOLD, 18)
    g.textAlign = 'left'
    g.fillText(v, x + 22, 640)
  })
}

// ---- Podium peringkat ----
// o: { botName, top: [{ name, level, exp }] (maks 8) }
function drawPodium(g, o) {
  const [W, H] = SIZE.podium
  background(g, W, H, ['#ffb347', '#7c5cff'])
  g.textBaseline = 'alphabetic'
  g.textAlign = 'left'
  g.font = `64px ${BOLD}`
  gradText(g, 'LEADERBOARD', 70, 120, ['#ffd200', '#ff7a18'])
  g.fillStyle = 'rgba(255,255,255,0.55)'
  g.font = `26px ${REG}`
  g.textAlign = 'left'
  g.fillText(`${o.botName} • peringkat level tertinggi`, 74, 164)

  const top = o.top || []
  const spots = [
    { i: 1, x: 70, w: 200, h: 210, c: ['#cfd8e3', '#8e9bab'] }, // 2
    { i: 0, x: 290, w: 200, h: 290, c: ['#ffe259', '#ffa751'] }, // 1
    { i: 2, x: 510, w: 200, h: 170, c: ['#e8a066', '#a8643a'] } // 3
  ]
  const base = 650
  for (const s of spots) {
    const u = top[s.i]
    const y = base - s.h
    const cx = s.x + s.w / 2
    const gr = g.createLinearGradient(0, y, 0, base)
    gr.addColorStop(0, rgba(s.c[0], 0.95))
    gr.addColorStop(1, rgba(s.c[1], 0.55))
    g.fillStyle = gr
    rr(g, s.x, y, s.w, s.h, 22)
    g.fill()
    g.fillStyle = 'rgba(0,0,0,0.22)'
    g.font = `96px ${BOLD}`
    g.textAlign = 'center'
    g.fillText(String(s.i + 1), cx, base - 20)
    if (u) {
      g.fillStyle = '#10102a'
      g.font = `30px ${BOLD}`
      g.fillText(`LV ${u.level}`, cx, y + 48)
      avatarCircle(g, null, cx, y - 104, 40, s.c, u.name)
      g.fillStyle = '#fff'
      fitSize(g, u.name, 26, s.w - 10, BOLD, 16)
      g.textAlign = 'center'
      g.fillText(fit(g, u.name, s.w - 10), cx, y - 22)
    } else {
      g.fillStyle = 'rgba(255,255,255,0.35)'
      g.font = `26px ${REG}`
      g.fillText('-', cx, y + 44)
    }
  }

  // daftar 4-8
  glass(g, 770, 70, 440, 580, 36)
  g.fillStyle = 'rgba(255,255,255,0.55)'
  g.font = `20px ${BOLD}`
  g.textAlign = 'left'
  spaced(g, 'PERINGKAT LAINNYA', 806, 122, 4)
  for (let k = 0; k < 5; k++) {
    const u = top[3 + k]
    const y = 150 + k * 100
    g.fillStyle = 'rgba(255,255,255,0.06)'
    rr(g, 800, y, 380, 84, 22)
    g.fill()
    g.fillStyle = 'rgba(255,255,255,0.5)'
    g.font = `30px ${BOLD}`
    g.textAlign = 'left'
    g.fillText(`#${4 + k}`, 822, y + 53)
    if (u) {
      avatarCircle(g, null, 928, y + 42, 24, OPTS.accent, u.name)
      g.fillStyle = '#fff'
      fitSize(g, u.name, 26, 190, BOLD, 16)
      g.textAlign = 'left'
      g.fillText(fit(g, u.name, 190), 970, y + 40)
      g.fillStyle = 'rgba(255,255,255,0.5)'
      g.font = `20px ${REG}`
      g.fillText(`LV ${u.level}`, 970, y + 66)
    } else {
      g.fillStyle = 'rgba(255,255,255,0.25)'
      g.font = `24px ${REG}`
      g.textAlign = 'left'
      g.fillText('belum ada', 880, y + 52)
    }
  }
}

// ---- Banner kategori ----
// o: { botName, cat, name, count, desc }
function drawCategory(g, o) {
  const [W, H] = SIZE.category
  const col = catColors(o.cat)
  background(g, W, H, col)
  g.textBaseline = 'alphabetic'
  glass(g, 96, 130, 460, 460, 120, 'rgba(255,255,255,0.05)')
  glow(g, 326, 360, 260, col[0], 0.35)
  const ring = g.createLinearGradient(96, 130, 556, 590)
  ring.addColorStop(0, col[0])
  ring.addColorStop(1, col[1])
  g.strokeStyle = ring
  g.lineWidth = 6
  rr(g, 96, 130, 460, 460, 120)
  g.stroke()
  icon(g, o.cat, 326, 360, 270, '#fff')

  g.textAlign = 'left'
  g.fillStyle = 'rgba(255,255,255,0.55)'
  g.font = `26px ${BOLD}`
  spaced(g, 'KATEGORI MENU', 636, 270, 8)
  const t = String(o.name).toUpperCase()
  fitSize(g, t, 130, 560, BOLD, 56)
  gradText(g, t, 632, 404, col)
  pill(g, `${o.count} PERINTAH`, 636, 440, { size: 26, h: 56, padX: 30, fill: rgba(col[0], 0.25), stroke: rgba(col[0], 0.6) })
  g.fillStyle = 'rgba(255,255,255,0.6)'
  g.font = `30px ${REG}`
  g.textAlign = 'left'
  g.fillText(fit(g, o.desc || '', 560), 638, 548)
  g.fillStyle = 'rgba(255,255,255,0.35)'
  g.font = `22px ${BOLD}`
  g.textAlign = 'right'
  spaced(g, String(o.botName).toUpperCase(), 1210, 676, 5, 'right')
}

// ---- Tile kategori untuk carousel (kotak 900x900, v6) ----
function drawTile(g, o) {
  const [W, H] = SIZE.tile
  const col = catColors(o.cat)
  const rnd = rng(`tile|${o.cat}`)
  background(g, W, H, col)
  g.textBaseline = 'alphabetic'
  g.save()
  g.strokeStyle = rgba(col[0], 0.12)
  g.lineWidth = 2
  for (let i = -3; i < 16; i++) {
    g.beginPath()
    g.moveTo(i * 70, H)
    g.lineTo(i * 70 + 300, 0)
    g.stroke()
  }
  g.restore()
  particles(g, W, H, rnd, 40, [col[0], col[1], '#ffffff'])
  glass(g, 70, 70, W - 140, H - 140, 70, 'rgba(255,255,255,0.045)')
  const ln = g.createLinearGradient(70, 70, W - 70, H - 70)
  ln.addColorStop(0, rgba(col[0], 0.9))
  ln.addColorStop(0.5, 'rgba(255,255,255,0.05)')
  ln.addColorStop(1, rgba(col[1], 0.9))
  g.strokeStyle = ln
  g.lineWidth = 3
  rr(g, 70, 70, W - 140, H - 140, 70)
  g.stroke()
  corners(g, 96, 96, W - 192, H - 192, 40, rgba(col[0], 0.9))
  glow(g, 450, 330, 270, col[0], 0.42)
  const fillB = g.createLinearGradient(250, 130, 650, 530)
  fillB.addColorStop(0, rgba(col[0], 0.28))
  fillB.addColorStop(1, rgba(col[1], 0.06))
  g.fillStyle = fillB
  rr(g, 250, 130, 400, 400, 110)
  g.fill()
  const ring = g.createLinearGradient(250, 130, 650, 530)
  ring.addColorStop(0, col[0])
  ring.addColorStop(1, col[1])
  g.strokeStyle = ring
  g.lineWidth = 8
  rr(g, 250, 130, 400, 400, 110)
  g.stroke()
  icon(g, o.cat, 450, 330, 230, '#fff')
  const t = String(o.name).toUpperCase()
  g.save()
  g.shadowColor = rgba(col[0], 0.7)
  g.shadowBlur = 30
  fitSize(g, t, 108, 680, BOLD, 48)
  gradText(g, t, 450, 668, col, 'center')
  g.restore()
  pill(g, `${o.count} PERINTAH`, 450, 704, { align: 'center', size: 28, h: 60, padX: 34, fill: rgba(col[0], 0.28), stroke: rgba(col[0], 0.7), dot: col[0] })
  g.fillStyle = 'rgba(255,255,255,0.38)'
  g.font = `22px ${BOLD}`
  g.textAlign = 'center'
  spaced(g, String(o.botName).toUpperCase(), 450, 806, 6, 'center')
}

// ---- util gambar v6: acak deterministik, ikon nada, partikel, equalizer ----
function rng(seed) {
  let a = 0
  for (const c of String(seed)) a = (Math.imul(a ^ c.charCodeAt(0), 2654435761) + 0x9e3779b9) | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const TONE_COL = { ok: ['#22c55e', '#2dd4bf'], err: ['#ff5e62', '#ff9966'], warn: ['#f7971e', '#ffd200'], denied: ['#f43f5e', '#f59e0b'], usage: ['#8b5cf6', '#38bdf8'], info: ['#38bdf8', '#7c5cff'], gold: ['#f7971e', '#ffd200'] }

// lencana bulat kecil berisi simbol nada (centang, silang, tanda seru, gembok, tanya, info, bintang)
function toneBadge(g, tone, cx, cy, r) {
  const tc = TONE_COL[tone] || TONE_COL.info
  g.save()
  g.shadowColor = rgba(tc[0], 0.7)
  g.shadowBlur = 26
  const gr = g.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
  gr.addColorStop(0, tc[0])
  gr.addColorStop(1, tc[1])
  g.fillStyle = gr
  g.beginPath()
  g.arc(cx, cy, r, 0, Math.PI * 2)
  g.fill()
  g.restore()
  g.strokeStyle = '#0d0d22'
  g.lineWidth = 7
  g.beginPath()
  g.arc(cx, cy, r + 3, 0, Math.PI * 2)
  g.stroke()
  if (require('./fa').draw(g, require('./fa').TONE[tone] || 'info', cx, cy, r * (tone === 'ok' || tone === 'err' ? 1.0 : 0.95), '#fff')) return
  g.strokeStyle = '#fff'
  g.fillStyle = '#fff'
  g.lineWidth = r * 0.17
  g.lineCap = 'round'
  g.lineJoin = 'round'
  const k = r / 40
  g.beginPath()
  if (tone === 'ok') {
    g.moveTo(cx - 17 * k, cy + 1 * k)
    g.lineTo(cx - 5 * k, cy + 13 * k)
    g.lineTo(cx + 18 * k, cy - 13 * k)
    g.stroke()
  } else if (tone === 'err') {
    g.moveTo(cx - 14 * k, cy - 14 * k)
    g.lineTo(cx + 14 * k, cy + 14 * k)
    g.moveTo(cx + 14 * k, cy - 14 * k)
    g.lineTo(cx - 14 * k, cy + 14 * k)
    g.stroke()
  } else if (tone === 'warn') {
    g.moveTo(cx, cy - 17 * k)
    g.lineTo(cx, cy + 4 * k)
    g.stroke()
    g.beginPath()
    g.arc(cx, cy + 15 * k, 3.4 * k, 0, Math.PI * 2)
    g.fill()
  } else if (tone === 'denied') {
    rr(g, cx - 14 * k, cy - 2 * k, 28 * k, 22 * k, 5 * k)
    g.fill()
    g.beginPath()
    g.arc(cx, cy - 4 * k, 9 * k, Math.PI, 0)
    g.stroke()
  } else if (tone === 'usage') {
    g.font = `${Math.round(r * 1.15)}px ${BOLD}`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText('?', cx, cy + 2 * k)
    g.textBaseline = 'alphabetic'
  } else if (tone === 'gold') {
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5
      const rad = (i % 2 ? 8 : 19) * k
      if (i) g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad)
      else g.moveTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad)
    }
    g.closePath()
    g.fill()
  } else {
    g.moveTo(cx, cy - 2 * k)
    g.lineTo(cx, cy + 15 * k)
    g.stroke()
    g.beginPath()
    g.arc(cx, cy - 13 * k, 3.6 * k, 0, Math.PI * 2)
    g.fill()
  }
}

// butiran kecil (titik, plus, berlian) tersebar acak tapi tetap sama untuk judul yang sama
function particles(g, W, H, rnd, n, colors) {
  for (let i = 0; i < n; i++) {
    const x = 70 + rnd() * (W - 140)
    const y = 60 + rnd() * (H - 120)
    const s = 2 + rnd() * 5
    g.fillStyle = rgba(colors[i % colors.length], 0.12 + rnd() * 0.4)
    g.strokeStyle = g.fillStyle
    g.lineWidth = 2
    const kind = rnd()
    if (kind < 0.55) {
      g.beginPath()
      g.arc(x, y, s, 0, Math.PI * 2)
      g.fill()
    } else if (kind < 0.8) {
      g.beginPath()
      g.moveTo(x - s * 1.6, y)
      g.lineTo(x + s * 1.6, y)
      g.moveTo(x, y - s * 1.6)
      g.lineTo(x, y + s * 1.6)
      g.stroke()
    } else {
      g.beginPath()
      g.moveTo(x, y - s * 1.7)
      g.lineTo(x + s * 1.2, y)
      g.lineTo(x, y + s * 1.7)
      g.lineTo(x - s * 1.2, y)
      g.closePath()
      g.fill()
    }
  }
}

// batang equalizer dekoratif
function equalizer(g, x, baseY, w, maxH, rnd, c0, c1, bars = 22) {
  const gap = w / bars
  for (let i = 0; i < bars; i++) {
    const env = Math.sin((i / (bars - 1)) * Math.PI) * 0.65 + 0.35
    const h = Math.max(8, maxH * env * (0.3 + rnd() * 0.7))
    const gr = g.createLinearGradient(0, baseY - h, 0, baseY)
    gr.addColorStop(0, rgba(c0, 0.6))
    gr.addColorStop(1, rgba(c1, 0.06))
    g.fillStyle = gr
    rr(g, x + i * gap, baseY - h, gap * 0.56, h, gap * 0.28)
    g.fill()
  }
}

// siku sudut dekoratif
function corners(g, x, y, w, h, len, color) {
  g.strokeStyle = color
  g.lineWidth = 4
  g.lineCap = 'round'
  const pts = [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]
  for (const [px, py, dx, dy] of pts) {
    g.beginPath()
    g.moveTo(px + dx * len, py)
    g.lineTo(px, py)
    g.lineTo(px, py + dy * len)
    g.stroke()
  }
}

// ---- Banner balasan (mode button): kepala gambar untuk setiap output fitur (v6) ----
// o: { botName, cat, catLabel, title, sub, cmd, tone:'info|ok|err|warn|usage|denied|gold', colors:[c1,c2], chip }
function drawBanner(g, o) {
  const [W, H] = SIZE.banner
  const col = o.colors || catColors(o.cat)
  const tone = o.tone || 'info'
  const tc = TONE_COL[tone] || TONE_COL.info
  const rnd = rng(`${o.title}|${o.cat}`)
  g.textBaseline = 'alphabetic'
  // latar: gradien gelap + cahaya warna kategori
  const bg = g.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#06060e')
  bg.addColorStop(0.55, '#0f0c26')
  bg.addColorStop(1, '#1b1244')
  g.fillStyle = bg
  g.fillRect(0, 0, W, H)
  glow(g, W * 0.94, 0, 560, col[0], 0.5)
  glow(g, 0, H, 520, col[1], 0.38)
  glow(g, W * 0.52, H * 0.6, 340, tc[0], 0.12)
  g.fillStyle = 'rgba(255,255,255,0.04)'
  for (let x = 24; x < W; x += 36) for (let y = 24; y < H; y += 36) g.fillRect(x, y, 2, 2)
  // garis diagonal
  g.save()
  g.strokeStyle = rgba(col[0], 0.11)
  g.lineWidth = 2
  for (let i = -3; i < 22; i++) {
    g.beginPath()
    g.moveTo(i * 78, H)
    g.lineTo(i * 78 + 240, 0)
    g.stroke()
  }
  g.restore()
  particles(g, W, H, rnd, 38, [col[0], col[1], '#ffffff'])
  equalizer(g, W - 470, H - 82, 380, 92, rnd, col[0], col[1], 24)
  // panel kaca + bingkai gradien
  glass(g, 52, 44, W - 104, H - 88, 46, 'rgba(255,255,255,0.045)')
  const ln = g.createLinearGradient(52, 44, W - 52, H - 44)
  ln.addColorStop(0, rgba(col[0], 0.85))
  ln.addColorStop(0.5, 'rgba(255,255,255,0.06)')
  ln.addColorStop(1, rgba(col[1], 0.85))
  g.strokeStyle = ln
  g.lineWidth = 2.4
  rr(g, 52, 44, W - 104, H - 88, 46)
  g.stroke()
  corners(g, 72, 64, W - 144, H - 128, 30, rgba(col[0], 0.9))

  // lencana ikon kategori
  glow(g, 226, 214, 210, col[0], 0.42)
  const ring = g.createLinearGradient(104, 92, 340, 328)
  ring.addColorStop(0, col[0])
  ring.addColorStop(1, col[1])
  const fillB = g.createLinearGradient(104, 92, 340, 328)
  fillB.addColorStop(0, rgba(col[0], 0.28))
  fillB.addColorStop(1, rgba(col[1], 0.06))
  g.fillStyle = fillB
  rr(g, 104, 92, 236, 236, 68)
  g.fill()
  g.strokeStyle = ring
  g.lineWidth = 7
  rr(g, 104, 92, 236, 236, 68)
  g.stroke()
  g.strokeStyle = 'rgba(255,255,255,0.14)'
  g.lineWidth = 2
  rr(g, 118, 106, 208, 208, 56)
  g.stroke()
  icon(g, o.cat, 222, 210, 140, '#fff')
  toneBadge(g, tone, 312, 306, 40)

  // teks
  const tx = 392
  g.textAlign = 'left'
  g.fillStyle = col[0]
  g.beginPath()
  g.arc(tx + 8, 128, 8, 0, Math.PI * 2)
  g.fill()
  g.fillStyle = 'rgba(255,255,255,0.62)'
  g.font = `23px ${BOLD}`
  spaced(g, `${String(o.botName).toUpperCase()}  •  ${String(o.catLabel || o.cat || '').toUpperCase()}`, tx + 28, 136, 5)
  const t = String(o.title || '').toUpperCase()
  fitSize(g, t, 96, 760, BOLD, 40)
  g.save()
  g.shadowColor = rgba(col[0], 0.7)
  g.shadowBlur = 32
  gradText(g, t, tx - 4, 244, col)
  g.restore()
  g.fillStyle = 'rgba(255,255,255,0.64)'
  g.font = `27px ${REG}`
  g.textAlign = 'left'
  g.fillText(fit(g, o.sub || '', 740), tx, 292)
  // baris chip
  let cx = tx
  g.font = `22px ${BOLD}`
  const w1 = pill(g, String(o.catLabel || o.cat || 'BOT').toUpperCase(), cx, 310, { size: 21, h: 42, padX: 20, fill: rgba(col[0], 0.26), stroke: rgba(col[0], 0.7) })
  cx += w1 + 14
  if (o.cmd) pill(g, String(o.cmd), cx, 310, { size: 21, h: 42, padX: 20, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.22)', family: BOLD })
  // chip nada (kanan atas)
  if (o.chip) pill(g, o.chip, W - 96, 76, { align: 'right', size: 21, h: 44, padX: 24, fill: rgba(tc[0], 0.28), stroke: rgba(tc[0], 0.8), dot: tc[0] })
  // garis aksen bawah
  const bl = g.createLinearGradient(100, 0, W - 100, 0)
  bl.addColorStop(0, rgba(col[0], 0))
  bl.addColorStop(0.2, rgba(col[0], 0.95))
  bl.addColorStop(0.8, rgba(col[1], 0.95))
  bl.addColorStop(1, rgba(col[1], 0))
  g.fillStyle = bl
  rr(g, 100, H - 62, W - 200, 5, 3)
  g.fill()
}

const DRAW = { banner: drawBanner, home: drawHome, card: drawCard, status: drawStatus, podium: drawPodium, category: drawCategory, tile: drawTile }

// =====================================================================
//  Sisi server (bot): font + render ke JPEG
// =====================================================================
let fontsReady = false
function registerFonts() {
  if (fontsReady) return
  const { GlobalFonts } = require('@napi-rs/canvas')
  const dir = path.join(__dirname, '..', 'assets', 'fonts')
  GlobalFonts.registerFromPath(path.join(dir, 'Outfit-Bold.ttf'), BOLD)
  GlobalFonts.registerFromPath(path.join(dir, 'Outfit-Regular.ttf'), REG)
  fontsReady = true
}

// kind: home | card | status | podium | category | tile.  opts.avatarBuffer (opsional) = foto profil
async function render(kind, opts = {}) {
  registerFonts()
  const { createCanvas, loadImage } = require('@napi-rs/canvas')
  const [w, h] = SIZE[kind]
  const cv = createCanvas(w, h)
  const o = { ...opts }
  if (opts.avatarBuffer) {
    try {
      o.avatar = await loadImage(opts.avatarBuffer)
    } catch {
      o.avatar = null
    }
  }
  DRAW[kind](cv.getContext('2d'), o)
  return cv.encode('jpeg', 90)
}

// cache untuk gambar yang jarang berubah (banner/tile kategori)
const imgCache = new Map()
async function renderCached(key, kind, opts) {
  if (imgCache.has(key)) return imgCache.get(key)
  const buf = await render(kind, opts)
  imgCache.set(key, buf)
  if (imgCache.size > 80) imgCache.delete(imgCache.keys().next().value)
  return buf
}

// Foto profil WhatsApp (di-cache 10 menit). Gagal / privat -> null (kartu pakai inisial).
const avatars = new Map()
async function avatarOf(sock, jid) {
  if (!OPTS.avatar) return null
  const hit = avatars.get(jid)
  if (hit && Date.now() - hit.at < 10 * 60 * 1000) return hit.buf
  let buf = null
  try {
    const url = await Promise.race([sock.profilePictureUrl(jid, 'image'), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000))])
    if (url) {
      const axios = require('axios')
      const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 6000 })
      buf = Buffer.from(res.data)
    }
  } catch {}
  avatars.set(jid, { buf, at: Date.now() })
  if (avatars.size > 200) avatars.delete(avatars.keys().next().value)
  return buf
}

// =====================================================================
//  Helper teks, data & tombol
// =====================================================================
const fmt = (n) => Math.floor(Number(n) || 0).toLocaleString('id-ID')
const rp = (n) => `Rp${fmt(n)}`
const bar = (pct, n = 10) => {
  const f = Math.max(0, Math.min(n, Math.round((pct / 100) * n)))
  return '▰'.repeat(f) + '▱'.repeat(n - f)
}
const TZ = 'Asia/Jakarta'
function greeting() {
  const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: 'numeric', hourCycle: 'h23' }).format(new Date()))
  if (hour < 11) return 'Selamat Pagi'
  if (hour < 15) return 'Selamat Siang'
  if (hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
}
function uptimeShort(sec = process.uptime()) {
  sec = Math.floor(sec)
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (d) return `${d}h ${h}j`
  if (h) return `${h}j ${m}m`
  return `${m}m ${sec % 60}s`
}
const mainCmd = (p) => String(Array.isArray(p.command) ? p.command[0] : p.command)
const cut = (s, n) => (String(s).length > n ? `${String(s).slice(0, n - 1)}…` : String(s))

// Kelompokkan plugin per kategori seperti menu lama. Mengembalikan { groups, order }
// Plugin yang memuat banyak fitur berbeda dalam satu file ditampilkan satu per satu di menu.
// Nilai = alias yang disembunyikan (supaya satu fitur tidak tampil ganda).
const MULTI = {
  textkit: ['wordcount'], encoders: [], mathkit: [], mathkit2: [], bisnis: [], waktukit: ['zonawaktu'], sehat: [], kerja: [], generator: [],
  indonesia: [], negara: [], gayatulis: [], cekan: [], weekly: ['mingguan', 'bulanan'], gcsetting: [], chmanage: ['buatch'], chaction: ['ikutich', 'keluarch'],
  cekmeter: [], textstyle: [], berburu: [], siapa: ['acakmember'], wyr: ['wouldyourather', 'pilihsatu', 'nevereverhave'], topcmd: ['cmdpopuler', 'myusage'], casing: []
}
function expandMenu(plugins) {
  const out = []
  for (const p of plugins) {
    // plugin dengan `multi: true` (atau terdaftar di MULTI) tampil per perintah; `descs` / `usages` = keterangan tiap perintah
    const hide = MULTI[p.name] || (p.multi ? p.hidden || [] : null)
    if (!hide || !Array.isArray(p.command)) {
      out.push(p)
      continue
    }
    for (const c of p.command) {
      if (hide.includes(c)) continue
      out.push({ ...p, command: [c], ...(p.descs?.[c] ? { desc: p.descs[c] } : {}), ...(p.usages?.[c] !== undefined ? { usage: p.usages[c] } : {}) })
    }
  }
  return out
}

function collect(plugins, isOwner) {
  const visible = expandMenu(plugins).filter((p) => !p.owner || isOwner)
  const groups = {}
  for (const p of visible) (groups[p.category || 'lainnya'] = groups[p.category || 'lainnya'] || []).push(p)
  const order = Object.keys(LABELS).filter((c) => groups[c])
  for (const c of Object.keys(groups)) if (!order.includes(c)) order.push(c)
  return { visible, groups, order }
}
const labelOf = (cat) => LABELS[cat] || String(cat).toUpperCase()
const descOf = (cat) => DESCS[cat] || ''
const longDescOf = (cat) => LONGDESCS[cat] || `Kumpulan perintah ${String(cat).toLowerCase()}`

// Nomor tampil ramah untuk pengguna tanpa nama: 6281••••2639
const maskNumber = (n) => (String(n).length > 7 ? `${String(n).slice(0, 4)}••••${String(n).slice(-4)}` : String(n))

// Hitung data CPU/RAM untuk dashboard
function systemStats() {
  const total = os.totalmem()
  const free = os.freemem()
  const used = total - free
  const cores = os.cpus().length || 1
  const load = os.loadavg()[0] || 0
  const mem = process.memoryUsage()
  const gb = (b) => (b / 1024 ** 3).toFixed(1)
  const mb = (b) => Math.round(b / 1024 ** 2)
  return {
    cpu: Math.max(0, Math.min(100, (load / cores) * 100)),
    cpuText: `${cores} core • load ${load.toFixed(2)}`,
    ram: (used / total) * 100,
    ramText: `${gb(used)} / ${gb(total)} GB`,
    heap: (mem.heapUsed / mem.heapTotal) * 100,
    heapText: `${mb(mem.heapUsed)} / ${mb(mem.heapTotal)} MB`,
    node: process.version,
    platform: `${os.platform()} ${os.arch()}`
  }
}

module.exports = {
  OPTS, LABELS, DESCS, SIZE, DRAW, BOLD, REG,
  draw: DRAW, drawBanner, drawHome, drawCard, drawStatus, drawPodium, drawCategory, drawTile,
  render, renderCached, avatarOf,
  fmt, rp, bar, greeting, uptimeShort, mainCmd, cut, collect, expandMenu, labelOf, descOf, longDescOf, maskNumber, systemStats, catColors, initials
}
