// lib/imgops.js — operasi gambar murni (Buffer -> Buffer) memakai sharp. Dipakai plugins/image/*.
'use strict'

const MAX_SIDE = 4096

const sharp = () => require('sharp')

// Normalisasi: putar sesuai EXIF, ambil frame pertama, batasi ukuran, hasil PNG (alpha dipertahankan)
async function norm(buf, maxSide = 2400) {
  return sharp()(buf, { failOn: 'none' }).rotate().resize({ width: maxSide, height: maxSide, fit: 'inside', withoutEnlargement: true }).png().toBuffer()
}
const out = (s, fmt = 'png', q = 92) => (fmt === 'jpg' ? s.jpeg({ quality: q, mozjpeg: true }) : fmt === 'webp' ? s.webp({ quality: q }) : s.png()).toBuffer()

async function meta(buf) {
  const m = await sharp()(buf).metadata()
  return { w: m.width, h: m.height }
}

// ---------- warna ----------
const NAMED = {
  merah: '#e53935', red: '#e53935', biru: '#1e88e5', blue: '#1e88e5', hijau: '#43a047', green: '#43a047', kuning: '#fdd835', yellow: '#fdd835',
  jingga: '#fb8c00', oranye: '#fb8c00', orange: '#fb8c00', ungu: '#8e24aa', purple: '#8e24aa', pink: '#ec407a', cyan: '#00bcd4', tosca: '#009688',
  teal: '#009688', cokelat: '#795548', coklat: '#795548', brown: '#795548', abu: '#9e9e9e', gray: '#9e9e9e', grey: '#9e9e9e', hitam: '#111111', black: '#111111',
  putih: '#ffffff', white: '#ffffff', navy: '#0d1b4c', emas: '#ffc107', gold: '#ffc107', perak: '#c0c0c0', silver: '#c0c0c0', maroon: '#800000', lime: '#8bc34a',
  birulangit: '#87ceeb', sky: '#87ceeb', birumuda: '#64b5f6', birutua: '#0d47a1', hijaumuda: '#a5d6a7', hijautua: '#1b5e20', merahmuda: '#ef9a9a', merahtua: '#b71c1c', ungumuda: '#ce93d8', ungutua: '#4a148c',
  salmon: '#fa8072', coral: '#ff7f50', lavender: '#b57edc', turquoise: '#40e0d0', indigo: '#3f51b5', magenta: '#ff00ff', violet: '#7f00ff', beige: '#f5f5dc', krem: '#fffdd0', olive: '#808000', mint: '#98ff98', peach: '#ffdab9', rose: '#ff007f', burgundy: '#800020'
}
function parseColor(s) {
  const c = String(s || '').trim().toLowerCase()
  if (NAMED[c]) return NAMED[c]
  const m = c.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/)
  if (!m) return null
  const h = m[1].length === 3 ? [...m[1]].map((x) => x + x).join('') : m[1]
  return `#${h}`
}
const hexToRgb = (h) => {
  const n = parseInt(h.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const rgbToHex = (r, g, b) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`

// ---------- efek dasar ----------
const ops = {
  blur: async (b, a) => out(sharp()(await norm(b)).blur(Math.min(80, Math.max(0.5, a[0] ?? 10)))),
  gray: async (b) => out(sharp()(await norm(b)).grayscale()),
  sepia: async (b) => out(sharp()(await norm(b)).recomb([[0.393, 0.769, 0.189], [0.349, 0.686, 0.168], [0.272, 0.534, 0.131]])),
  negate: async (b) => out(sharp()(await norm(b)).negate({ alpha: false })),
  sharpen: async (b, a) => out(sharp()(await norm(b)).sharpen({ sigma: Math.min(8, Math.max(0.5, (a[0] ?? 2))), m1: 1.2, m2: 2.5 })),
  denoise: async (b, a) => out(sharp()(await norm(b)).median(Math.round(Math.min(9, Math.max(3, a[0] ?? 3))) | 1)),
  fliph: async (b) => out(sharp()(await norm(b)).flop()),
  flipv: async (b) => out(sharp()(await norm(b)).flip()),
  rotate: async (b, a) => out(sharp()(await norm(b)).rotate(a[0] ?? 90, { background: { r: 0, g: 0, b: 0, alpha: 0 } })),
  brightness: async (b, a) => out(sharp()(await norm(b)).modulate({ brightness: Math.max(0.05, 1 + (a[0] ?? 30) / 100) })),
  contrast: async (b, a) => {
    const k = Math.max(0.1, 1 + (a[0] ?? 30) / 100)
    return out(sharp()(await norm(b)).linear(k, 128 * (1 - k)))
  },
  saturate: async (b, a) => out(sharp()(await norm(b)).modulate({ saturation: Math.max(0, 1 + (a[0] ?? 50) / 100) })),
  tint: async (b, a) => out(sharp()(await norm(b)).tint(a[0] || '#ff9800')),
  emboss: async (b) => out(sharp()(await norm(b)).grayscale().convolve({ width: 3, height: 3, kernel: [-2, -1, 0, -1, 0, 1, 0, 1, 2], scale: 1, offset: 128 })),
  edge: async (b) => out(sharp()(await norm(b)).grayscale().convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] }).negate()),
  enhance: async (b) => out(sharp()(await norm(b)).normalise().clahe({ width: 48, height: 48, maxSlope: 3 }).modulate({ saturation: 1.12 }).sharpen({ sigma: 1.2 })),
  posterize: async (b, a) => out(sharp()(await norm(b)).png({ palette: true, colours: Math.round(Math.min(32, Math.max(2, a[0] ?? 6))), dither: 0 }))
}

async function pixelate(b, size) {
  const n = await norm(b, 1600)
  const { w, h } = await meta(n)
  const block = size || Math.max(4, Math.round(Math.max(w, h) / 40))
  const small = await sharp()(n).resize(Math.max(2, Math.round(w / block)), Math.max(2, Math.round(h / block)), { kernel: 'nearest' }).toBuffer()
  return sharp()(small).resize(w, h, { kernel: 'nearest' }).png().toBuffer()
}

// preset warna lewat matriks recomb + modulate
const PRESETS = {
  warm: (s) => s.recomb([[1.12, 0.06, 0], [0.02, 1.04, 0], [0, 0.04, 0.88]]).modulate({ saturation: 1.1 }),
  cool: (s) => s.recomb([[0.88, 0, 0.04], [0, 1.0, 0.06], [0.02, 0.08, 1.15]]).modulate({ saturation: 1.05 }),
  vintage: (s) => s.recomb([[0.9, 0.2, 0.05], [0.1, 0.85, 0.1], [0.08, 0.15, 0.6]]).modulate({ saturation: 0.8, brightness: 1.05 }).linear(0.92, 14),
  dramatic: (s) => s.modulate({ saturation: 0.75 }).linear(1.35, -45).sharpen({ sigma: 1.5 }),
  noir: (s) => s.grayscale().linear(1.45, -50),
  fade: (s) => s.modulate({ saturation: 0.7, brightness: 1.06 }).linear(0.82, 38),
  cinematic: (s) => s.recomb([[1.08, 0, -0.05], [0, 1.0, 0.03], [-0.08, 0.1, 1.18]]).linear(1.18, -22).modulate({ saturation: 1.12 }),
  pastel: (s) => s.modulate({ saturation: 0.7, brightness: 1.12 }).linear(0.8, 45),
  vivid: (s) => s.modulate({ saturation: 1.7, brightness: 1.04 }).linear(1.1, -10)
}
async function preset(b, name) {
  return out(PRESETS[name](sharp()(await norm(b))))
}

async function roundImage(b, pct = 12) {
  const n = await norm(b)
  const { w, h } = await meta(n)
  const r = Math.round((Math.min(w, h) * Math.min(50, Math.max(0, pct))) / 100)
  const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}" fill="#fff"/></svg>`)
  return sharp()(n).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
}

async function border(b, color = '#ffffff', px) {
  const n = await norm(b)
  const { w, h } = await meta(n)
  const t = px || Math.max(6, Math.round(Math.min(w, h) * 0.04))
  return sharp()(n).extend({ top: t, bottom: t, left: t, right: t, background: color }).png().toBuffer()
}

async function polaroid(b) {
  const n = await norm(b, 1400)
  const { w } = await meta(n)
  const side = Math.round(w * 0.06)
  const bottom = Math.round(w * 0.2)
  const framed = await sharp()(n).extend({ top: side, left: side, right: side, bottom, background: '#fbfbf8' }).png().toBuffer()
  const rot = await sharp()(framed).rotate(-4, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
  const rm = await meta(rot)
  const pad = Math.round(rm.w * 0.08)
  // bayangan lembut: alpha foto -> hitam -> blur -> transparansi 45%
  const alpha = await sharp()(rot).ensureAlpha().extractChannel(3).toBuffer()
  const black = await sharp()({ create: { width: rm.w, height: rm.h, channels: 3, background: '#000000' } }).joinChannel(alpha).png().toBuffer()
  const shadow = await sharp()(black).blur(16).png().toBuffer()
  const faded = await sharp()(shadow).composite([{ input: Buffer.from([0, 0, 0, 115]), raw: { width: 1, height: 1, channels: 4 }, tile: true, blend: 'dest-in' }]).png().toBuffer()
  return sharp()({ create: { width: rm.w + pad * 2, height: rm.h + pad * 2, channels: 4, background: '#ebe8e1' } })
    .composite([{ input: faded, left: pad + 8, top: pad + 12 }, { input: rot, left: pad, top: pad }])
    .png().toBuffer()
}

async function vignette(b, strength = 60) {
  const n = await norm(b)
  const { w, h } = await meta(n)
  const a = Math.min(0.95, Math.max(0.1, strength / 100))
  const svg = Buffer.from(`<svg width="${w}" height="${h}"><defs><radialGradient id="g" cx="50%" cy="50%" r="75%"><stop offset="45%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${a}"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`)
  return sharp()(n).composite([{ input: svg }]).png().toBuffer()
}

async function grain(b, amount = 40) {
  const n = await norm(b)
  const { w, h } = await meta(n)
  const noise = await sharp()({ create: { width: w, height: h, channels: 3, background: '#808080', noise: { type: 'gaussian', mean: 128, sigma: Math.min(90, Math.max(10, amount)) } } }).png().toBuffer()
  return sharp()(n).composite([{ input: noise, blend: 'overlay' }]).png().toBuffer()
}

async function mirror(b) {
  const n = await norm(b)
  const { w, h } = await meta(n)
  const half = Math.floor(w / 2)
  const left = await sharp()(n).extract({ left: 0, top: 0, width: half, height: h }).toBuffer()
  const right = await sharp()(left).flop().toBuffer()
  return sharp()({ create: { width: half * 2, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: left, left: 0, top: 0 }, { input: right, left: half, top: 0 }]).png().toBuffer()
}

async function glitch(b, amount = 12) {
  const n = await norm(b, 1600)
  const { data, info } = await sharp()(n).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const o = Buffer.from(data)
  const d = Math.max(2, Math.round((w * amount) / 400))
  for (let y = 0; y < h; y++) {
    const jitter = Math.random() < 0.06 ? Math.round((Math.random() - 0.5) * w * 0.12) : 0
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3
      const sx = (x + jitter + w) % w
      const rx = Math.min(w - 1, Math.max(0, sx - d))
      const bx = Math.min(w - 1, Math.max(0, sx + d))
      o[i] = data[(y * w + rx) * 3]
      o[i + 1] = data[(y * w + sx) * 3 + 1]
      o[i + 2] = data[(y * w + bx) * 3 + 2]
    }
    if (y % 4 === 0 && Math.random() < 0.3) for (let x = 0; x < w * 3; x++) o[y * w * 3 + x] = Math.min(255, o[y * w * 3 + x] * 0.8)
  }
  return sharp()(o, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer()
}

async function duotone(b, c1, c2) {
  const n = await norm(b, 1600)
  const { data, info } = await sharp()(n).grayscale().raw().toBuffer({ resolveWithObject: true })
  const [r1, g1, b1] = hexToRgb(c1)
  const [r2, g2, b2] = hexToRgb(c2)
  const o = Buffer.alloc(info.width * info.height * 3)
  for (let i = 0; i < data.length; i++) {
    const t = data[i] / 255
    o[i * 3] = r1 + (r2 - r1) * t
    o[i * 3 + 1] = g1 + (g2 - g1) * t
    o[i * 3 + 2] = b1 + (b2 - b1) * t
  }
  return sharp()(o, { raw: { width: info.width, height: info.height, channels: 3 } }).png().toBuffer()
}

async function upscale(b, factor = 2) {
  const { w, h } = await meta(await sharp()(b, { failOn: 'none' }).rotate().toBuffer())
  const f = Math.min(factor, MAX_SIDE / Math.max(w, h))
  const base = await sharp()(b, { failOn: 'none' }).rotate().resize(Math.round(w * f), Math.round(h * f), { kernel: 'lanczos3' }).sharpen({ sigma: 0.8, m1: 0.8, m2: 1.6 }).png().toBuffer()
  return { buffer: base, w: Math.round(w * f), h: Math.round(h * f) }
}

const RATIOS = { '1:1': [1, 1], '4:5': [4, 5], '5:4': [5, 4], '3:4': [3, 4], '4:3': [4, 3], '16:9': [16, 9], '9:16': [9, 16], '2:3': [2, 3], '3:2': [3, 2], '21:9': [21, 9] }
async function cropRatio(b, ratio) {
  const [rw, rh] = RATIOS[ratio]
  const n = await norm(b, 4000)
  const { w, h } = await meta(n)
  let cw = w
  let ch = Math.round((w * rh) / rw)
  if (ch > h) {
    ch = h
    cw = Math.round((h * rw) / rh)
  }
  return sharp()(n).extract({ left: Math.floor((w - cw) / 2), top: Math.floor((h - ch) / 2), width: cw, height: ch }).png().toBuffer()
}

// Muat gambar ke kanvas W x H, sisanya diisi versi blur dari gambar itu sendiri
async function blurFit(b, W, H) {
  const n = await norm(b, 3000)
  const bg = await sharp()(n).resize(W, H, { fit: 'cover' }).blur(40).modulate({ brightness: 0.75 }).toBuffer()
  const fg = await sharp()(n).resize(W, H, { fit: 'inside' }).toBuffer()
  const fm = await meta(fg)
  return sharp()(bg).composite([{ input: fg, left: Math.floor((W - fm.w) / 2), top: Math.floor((H - fm.h) / 2) }]).jpeg({ quality: 92 }).toBuffer()
}

async function splitGrid(b, cols, rows) {
  const n = await norm(b, 4000)
  const { w, h } = await meta(n)
  const tw = Math.floor(w / cols)
  const th = Math.floor(h / rows)
  const tiles = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      tiles.push(await sharp()(n).extract({ left: c * tw, top: r * th, width: tw, height: th }).jpeg({ quality: 92 }).toBuffer())
    }
  }
  return tiles
}

async function gradient(c1, c2, w = 1080, h = 1080, angle = 135) {
  const rad = (angle * Math.PI) / 180
  const x2 = 50 + Math.sin(rad) * 50
  const y2 = 50 - Math.cos(rad) * 50
  const x1 = 100 - x2
  const y1 = 100 - y2
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`
  return sharp()(Buffer.from(svg)).png().toBuffer()
}

// ---------- palet warna (median cut) ----------
async function palette(b, n = 5) {
  const { data, info } = await sharp()(await norm(b, 160)).removeAlpha().resize(80, 80, { fit: 'inside' }).raw().toBuffer({ resolveWithObject: true })
  const px = []
  for (let i = 0; i < data.length; i += 3) px.push([data[i], data[i + 1], data[i + 2]])
  void info
  let boxes = [px]
  while (boxes.length < n) {
    boxes.sort((a, b2) => b2.length - a.length)
    const box = boxes.shift()
    if (!box || box.length < 2) {
      if (box) boxes.push(box)
      break
    }
    const range = [0, 1, 2].map((ch) => {
      let lo = 255
      let hi = 0
      for (const p of box) {
        lo = Math.min(lo, p[ch])
        hi = Math.max(hi, p[ch])
      }
      return hi - lo
    })
    const ch = range.indexOf(Math.max(...range))
    box.sort((x, y) => x[ch] - y[ch])
    const mid = Math.floor(box.length / 2)
    boxes.push(box.slice(0, mid), box.slice(mid))
  }
  const total = px.length
  return boxes
    .filter((bx) => bx.length)
    .map((bx) => {
      const avg = [0, 1, 2].map((c) => bx.reduce((s, p) => s + p[c], 0) / bx.length)
      return { rgb: avg.map(Math.round), hex: rgbToHex(...avg), share: bx.length / total }
    })
    .sort((a, b2) => b2.share - a.share)
}
async function swatch(colors, size = 220) {
  const tiles = []
  for (let i = 0; i < colors.length; i++) {
    tiles.push({ input: await sharp()({ create: { width: size, height: size, channels: 3, background: colors[i].hex } }).png().toBuffer(), left: i * size, top: 0 })
  }
  return sharp()({ create: { width: size * colors.length, height: size, channels: 3, background: '#000' } }).composite(tiles).png().toBuffer()
}

// ---------- ASCII ----------
async function ascii(b, cols = 60) {
  const RAMP = '@%#*+=-:. '
  const { data, info } = await sharp()(await norm(b, 1000)).grayscale().resize(cols, null, { fit: 'inside' }).raw().toBuffer({ resolveWithObject: true })
  const rows = Math.max(1, Math.round(info.height * 0.5)) // huruf ±2x lebih tinggi dari lebar
  const lines = []
  for (let y = 0; y < rows; y++) {
    let line = ''
    const sy = Math.min(info.height - 1, Math.floor((y / rows) * info.height))
    for (let x = 0; x < info.width; x++) line += RAMP[Math.min(RAMP.length - 1, Math.floor((data[sy * info.width + x] / 256) * RAMP.length))]
    lines.push(line.replace(/\s+$/, ''))
  }
  return lines.join('\n')
}

async function info(b) {
  const s = sharp()(b, { failOn: 'none' })
  const m = await s.metadata()
  const st = await sharp()(b, { failOn: 'none' }).stats()
  const dom = st.dominant
  return { ...m, dominant: rgbToHex(dom.r, dom.g, dom.b), size: b.length }
}


// ================= TEKS (pango, tanpa canvas/fontconfig: memakai berkas font bawaan bot) =================
const FONT_DIR = require('path').join(__dirname, '..', 'assets', 'fonts')
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
async function textPng(text, { size = 48, color = '#ffffff', bold = true, width, align = 'centre', alpha = 100, spacing } = {}) {
  const file = require('path').join(FONT_DIR, bold ? 'Outfit-Bold.ttf' : 'Outfit-Regular.ttf')
  const opts = { text: `<span foreground="${color}" alpha="${alpha}%">${esc(text)}</span>`, font: `Outfit ${bold ? 'Bold' : 'Regular'} ${size}`, fontfile: file, rgba: true, align, wrap: 'word-char' }
  if (width) opts.width = Math.round(width)
  if (spacing) opts.spacing = spacing
  return sharp()({ text: opts }).png().toBuffer()
}
// teks yang dikecilkan sampai muat di kotak (lebar x tinggi)
async function textFit(text, w, h, opts = {}) {
  let size = opts.maxSize || 120
  for (; size >= 14; size -= 4) {
    const buf = await textPng(text, { ...opts, size, width: w })
    const m = await meta(buf)
    if (m.h <= h) return buf
  }
  return textPng(text, { ...opts, size: 14, width: w })
}

async function watermark(b, text, pos = 'kanan-bawah') {
  const n = await norm(b, 3000)
  const { w, h } = await meta(n)
  const size = Math.max(16, Math.round(Math.min(w, h) * 0.045))
  const fg = await textPng(text, { size, width: Math.round(w * 0.8), alpha: 78 })
  const sh = await textPng(text, { size, width: Math.round(w * 0.8), color: '#000000', alpha: 45 })
  const m = await meta(fg)
  const pad = Math.round(size * 0.8)
  const x = /kiri/.test(pos) ? pad : /tengah/.test(pos) ? Math.round((w - m.w) / 2) : w - m.w - pad
  const y = /atas/.test(pos) ? pad : /tengah-tengah|pusat/.test(pos) ? Math.round((h - m.h) / 2) : h - m.h - pad
  return sharp()(n).composite([{ input: sh, left: Math.max(0, x + 2), top: Math.max(0, y + 2) }, { input: fg, left: Math.max(0, x), top: Math.max(0, y) }]).png().toBuffer()
}

async function watermarkTile(b, text) {
  const n = await norm(b, 3000)
  const { w, h } = await meta(n)
  const size = Math.max(18, Math.round(Math.min(w, h) * 0.05))
  const t = await textPng(text, { size, alpha: 38 })
  const tm = await meta(t)
  const cell = await sharp()({ create: { width: Math.round(tm.w * 1.6), height: Math.round(tm.h * 4), channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: t, left: Math.round(tm.w * 0.3), top: Math.round(tm.h * 1.5) }]).png().toBuffer()
  const rot = await sharp()(cell).rotate(-30, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
  const tiled = await sharp()({ create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: rot, tile: true }]).png().toBuffer()
  return sharp()(n).composite([{ input: tiled }]).png().toBuffer()
}

async function captionBar(b, text, color = '#ffffff', textColor = '#111111') {
  const n = await norm(b, 2400)
  const { w, h } = await meta(n)
  const size = Math.max(18, Math.round(w * 0.05))
  const t = await textPng(text, { size, width: Math.round(w * 0.9), color: textColor, align: 'left' })
  const tm = await meta(t)
  const bar = tm.h + Math.round(size * 1.2)
  return sharp()({ create: { width: w, height: h + bar, channels: 4, background: color } })
    .composite([{ input: n, left: 0, top: bar }, { input: t, left: Math.round(w * 0.05), top: Math.round(size * 0.6) }]).png().toBuffer()
}

const THEMES = {
  ultah: { title: 'Selamat Ulang Tahun', sub: 'Semoga panjang umur, sehat selalu, dan semua impianmu tercapai.', c: ['#ff6a88', '#ff99ac'] },
  lebaran: { title: 'Selamat Idul Fitri', sub: 'Taqabbalallahu minna wa minkum. Mohon maaf lahir dan batin.', c: ['#11998e', '#38ef7d'] },
  natal: { title: 'Selamat Natal', sub: 'Semoga damai dan sukacita menyertai kita semua.', c: ['#b31217', '#e52d27'] },
  tahunbaru: { title: 'Selamat Tahun Baru', sub: 'Semoga tahun ini penuh berkah, kesehatan, dan kebahagiaan.', c: ['#141e30', '#4b79a1'] },
  nikah: { title: 'Selamat Menempuh Hidup Baru', sub: 'Semoga sakinah, mawaddah, warahmah.', c: ['#c471f5', '#fa71cd'] },
  wisuda: { title: 'Selamat Wisuda', sub: 'Selamat atas pencapaianmu. Ini baru awal dari perjalanan hebat.', c: ['#1e3c72', '#2a5298'] },
  terimakasih: { title: 'Terima Kasih', sub: 'Atas bantuan dan kebaikan yang telah kamu berikan.', c: ['#f7971e', '#ffd200'] },
  gws: { title: 'Semoga Lekas Sembuh', sub: 'Istirahat yang cukup, kami selalu mendoakanmu.', c: ['#00b4db', '#0083b0'] },
  sukses: { title: 'Selamat & Sukses', sub: 'Terus semangat meraih mimpi. Kamu pasti bisa!', c: ['#8e2de2', '#4a00e0'] }
}
async function greetingCard(kind, name, custom) {
  const T = THEMES[kind]
  const W = 1080
  const H = 1350
  const [c1, c2] = T.c
  const bg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/><circle cx="130" cy="150" r="260" fill="#fff" fill-opacity="0.10"/><circle cx="980" cy="260" r="170" fill="#fff" fill-opacity="0.09"/><circle cx="900" cy="1180" r="330" fill="#fff" fill-opacity="0.10"/><circle cx="90" cy="1100" r="120" fill="#fff" fill-opacity="0.08"/><rect x="70" y="70" width="${W - 140}" height="${H - 140}" rx="46" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="4"/><rect x="${W / 2 - 60}" y="560" width="120" height="6" rx="3" fill="#fff" fill-opacity="0.8"/></svg>`)
  const title = await textFit(T.title, 820, 360, { maxSize: 104 })
  const tm = await meta(title)
  const parts = [{ input: title, left: Math.round((W - tm.w) / 2), top: 220 + Math.round((360 - tm.h) / 2) }]
  const sub = await textFit(custom || T.sub, 780, 230, { maxSize: 44, bold: false, alpha: 92 })
  const sm = await meta(sub)
  parts.push({ input: sub, left: Math.round((W - sm.w) / 2), top: 620 })
  if (name) {
    const nm = await textFit(name, 860, 200, { maxSize: 88 })
    const nmm = await meta(nm)
    parts.push({ input: nm, left: Math.round((W - nmm.w) / 2), top: 900 + Math.round((200 - nmm.h) / 2) })
    const fr = await textPng('untuk', { size: 34, bold: false, alpha: 80 })
    const fm = await meta(fr)
    parts.push({ input: fr, left: Math.round((W - fm.w) / 2), top: 850 })
  }
  return sharp()(bg).composite(parts).jpeg({ quality: 93 }).toBuffer()
}

async function textCard(text, c1, c2, size = 1080) {
  const bg = await gradient(c1, c2, size, size, 135)
  const t = await textFit(text, Math.round(size * 0.78), Math.round(size * 0.7), { maxSize: 110 })
  const tm = await meta(t)
  return sharp()(bg).composite([{ input: t, left: Math.round((size - tm.w) / 2), top: Math.round((size - tm.h) / 2) }]).jpeg({ quality: 93 }).toBuffer()
}

// ================= HD / SCAN / LATAR / SKETSA =================
async function hd(b) {
  const first = await sharp()(b, { failOn: 'none' }).rotate().toBuffer()
  const { w, h } = await meta(first)
  const long = Math.max(w, h)
  const f = long < 1200 ? 3 : long < 2400 ? 2 : 1
  const scale = Math.min(f, MAX_SIDE / long)
  let s = sharp()(first).resize(Math.round(w * scale), Math.round(h * scale), { kernel: 'lanczos3' })
  if (scale > 1) s = s.median(3)
  s = s.clahe({ width: 64, height: 64, maxSlope: 2 }).modulate({ saturation: 1.08 }).sharpen({ sigma: 1.1, m1: 0.8, m2: 1.9 })
  const out = await s.jpeg({ quality: 95, mozjpeg: true }).toBuffer()
  const m = await meta(out)
  return { buffer: out, w: m.w, h: m.h, scale }
}

// ratakan pencahayaan (hilangkan bayangan) lalu perjelas teks
async function scan(b, bw = false) {
  const n = await sharp()(await norm(b, 2600)).grayscale().toColourspace('b-w').extractChannel(0).toBuffer()
  const { w, h } = await meta(n)
  const { data } = await sharp()(n).extractChannel(0).raw().toBuffer({ resolveWithObject: true })
  const sw = Math.max(8, Math.round(w / 12))
  const sh = Math.max(8, Math.round(h / 12))
  const small = await sharp()(n).resize(sw, sh, { kernel: 'cubic' }).blur(2).toColourspace('b-w').toBuffer()
  const bgRaw = await sharp()(small).resize(w, h, { kernel: 'cubic' }).blur(6).extractChannel(0).raw().toBuffer()
  // latar kertas = nilai terang lokal (dilatasi sederhana lewat max pada blok kecil)
  const out = Buffer.alloc(w * h)
  for (let i = 0; i < out.length; i++) {
    const bgv = Math.max(40, bgRaw[i])
    let v = (data[i] / bgv) * 255
    v = v > 255 ? 255 : v
    out[i] = bw ? (v > 168 ? 255 : Math.max(0, v * 0.35)) : Math.max(0, Math.min(255, (v - 60) * (255 / 175)))
  }
  const res = sharp()(out, { raw: { width: w, height: h, channels: 1 } })
  return (bw ? res.sharpen({ sigma: 0.8 }) : res.sharpen({ sigma: 1.2, m1: 0.8, m2: 1.8 })).jpeg({ quality: 92 }).toBuffer()
}

// buang latar: auto (isi-banjir dari tepi) atau satu warna tertentu
async function removeColor(b, colorHex, tol = 22) {
  const n = await norm(b, 2400)
  const { data, info } = await sharp()(n).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const px = Buffer.from(data)
  let target
  if (colorHex) target = hexToRgb(colorHex)
  else {
    const pts = [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1], [w >> 1, 0], [w >> 1, h - 1], [0, h >> 1], [w - 1, h >> 1]]
    const cols = pts.map(([x, y]) => [px[(y * w + x) * 4], px[(y * w + x) * 4 + 1], px[(y * w + x) * 4 + 2]])
    cols.sort((a, c) => a[0] + a[1] + a[2] - (c[0] + c[1] + c[2]))
    target = cols[cols.length >> 1]
  }
  const T = (tol / 100) * 441.67 // jarak RGB maksimum
  const dist = (i) => Math.hypot(px[i] - target[0], px[i + 1] - target[1], px[i + 2] - target[2])
  const mask = new Uint8Array(w * h) // 1 = latar
  if (colorHex) {
    for (let p = 0; p < w * h; p++) if (dist(p * 4) <= T) mask[p] = 1
  } else {
    const stack = []
    const push = (x, y) => { const p = y * w + x; if (!mask[p] && dist(p * 4) <= T) { mask[p] = 1; stack.push(p) } }
    for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1) }
    for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y) }
    while (stack.length) {
      const p = stack.pop()
      const x = p % w
      const y = (p / w) | 0
      if (x > 0) push(x - 1, y)
      if (x < w - 1) push(x + 1, y)
      if (y > 0) push(x, y - 1)
      if (y < h - 1) push(x, y + 1)
    }
  }
  // tepi halus: alpha dari jarak 0..2 piksel ke area latar
  const alpha = Buffer.alloc(w * h, 255)
  for (let p = 0; p < w * h; p++) if (mask[p]) alpha[p] = 0
  const soft = await sharp()(alpha, { raw: { width: w, height: h, channels: 1 } }).blur(0.8).extractChannel(0).raw().toBuffer()
  for (let p = 0; p < w * h; p++) px[p * 4 + 3] = mask[p] ? 0 : Math.min(px[p * 4 + 3], soft[p] < 128 && !mask[p] ? Math.max(soft[p] * 2, 60) : soft[p])
  return sharp()(px, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer()
}

async function sketch(b) {
  const g = await sharp()(await norm(b, 2400)).grayscale().toBuffer()
  const inv = await sharp()(g).blur(10).negate().toBuffer()
  return sharp()(g).composite([{ input: inv, blend: 'colour-dodge' }]).linear(1.08, -6).png().toBuffer()
}

async function cartoon(b) {
  const n = await norm(b, 2000)
  const smooth = await sharp()(n).median(5).modulate({ saturation: 1.35 }).png({ palette: true, colours: 28, dither: 0 }).toBuffer()
  const edges = await sharp()(n).grayscale().blur(1.2).convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] }).threshold(28).negate().toBuffer()
  return sharp()(smooth).composite([{ input: edges, blend: 'multiply' }]).png().toBuffer()
}

// pas foto: potong ke rasio, ganti latar (opsional), susun lembar cetak 10x15 cm @300dpi
const PAS = { '2x3': [2, 3], '3x4': [3, 4], '4x6': [4, 6] }
async function pasfoto(b, size, bgColor) {
  const [cw, ch] = PAS[size]
  const dpi = 300
  const pw = Math.round((cw / 2.54) * dpi)
  const ph = Math.round((ch / 2.54) * dpi)
  let src = await norm(b, 3000)
  if (bgColor) {
    const cut = await removeColor(src, null, 15)
    const { w, h } = await meta(cut)
    src = await sharp()({ create: { width: w, height: h, channels: 4, background: bgColor } }).composite([{ input: cut }]).png().toBuffer()
  }
  const one = await sharp()(src).resize(pw, ph, { fit: 'cover', position: 'attention' }).extend({ top: 2, bottom: 2, left: 2, right: 2, background: '#d0d0d0' }).jpeg({ quality: 95 }).toBuffer()
  const om = await meta(one)
  const SW = 1181
  const SH = 1772
  const gap = 24
  const cols = Math.max(1, Math.floor((SW - gap) / (om.w + gap)))
  const rows = Math.max(1, Math.floor((SH - gap) / (om.h + gap)))
  const totalW = cols * om.w + (cols - 1) * gap
  const totalH = rows * om.h + (rows - 1) * gap
  const ox = Math.round((SW - totalW) / 2)
  const oy = Math.round((SH - totalH) / 2)
  const comps = []
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) comps.push({ input: one, left: ox + c * (om.w + gap), top: oy + r * (om.h + gap) })
  const sheet = await sharp()({ create: { width: SW, height: SH, channels: 3, background: '#ffffff' } }).composite(comps).jpeg({ quality: 95 }).withMetadata({ density: dpi }).toBuffer()
  return { single: one, sheet, copies: cols * rows, px: [pw, ph] }
}

module.exports = { textPng, textFit, watermark, watermarkTile, captionBar, greetingCard, textCard, THEMES, hd, scan, removeColor, sketch, cartoon, pasfoto, PAS, ops, PRESETS, RATIOS, NAMED, norm, out, meta, pixelate, preset, roundImage, border, polaroid, vignette, grain, mirror, glitch, duotone, upscale, cropRatio, blurFit, splitGrid, gradient, palette, swatch, ascii, info, parseColor, hexToRgb, rgbToHex }
