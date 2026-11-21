// Desain siap pakai: sertifikat (gambar + PDF), kartu nama, undangan, dan logo teks bergaya (neon, emas, es, api, retro, 3D, hologram, glitch)
const kit = require('../../lib/kit')
const io = require('../../lib/imgops')
const sharp = require('sharp')

const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })
const parts = (c, min, usage) => {
  const p = kit.rest(c.body).split('|').map((s) => s.trim())
  if (p.filter(Boolean).length < min) throw bad(`Format: ${c.prefix}${c.command} ${usage}`)
  return p
}
const today = () => new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })
const put = async (comps, text, cx, top, w, h, opts) => {
  const b = await io.textFit(text, w, h, opts)
  const m = await io.meta(b)
  comps.push({ input: b, left: Math.round(cx - m.w / 2), top: Math.round(top + (h - m.h) / 2) })
  return m
}

// ---------------- SERTIFIKAT ----------------
async function certificate(name, title, giver, date) {
  const W = 1754
  const H = 1240
  const star = (cx, cy, r1, r2, n) => Array.from({ length: n * 2 }, (_, i) => { const a = (Math.PI * i) / n - Math.PI / 2; const r = i % 2 ? r2 : r1; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}` }).join(' ')
  const corner = (x, y, sx, sy) => `<g transform="translate(${x},${y}) scale(${sx},${sy})"><path d="M0,0 H170 M0,0 V170" stroke="url(#gold)" stroke-width="10" fill="none"/><circle cx="0" cy="0" r="34" fill="url(#gold)"/><circle cx="0" cy="0" r="18" fill="#fff8e1"/><path d="M60,0 Q60,60 0,60" stroke="url(#gold)" stroke-width="5" fill="none"/><path d="M95,0 Q95,95 0,95" stroke="url(#gold)" stroke-width="3" fill="none"/></g>`
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b8860b"/><stop offset="0.5" stop-color="#f6d365"/><stop offset="1" stop-color="#a0710a"/></linearGradient><radialGradient id="bg" cx="0.5" cy="0.5" r="0.8"><stop offset="0" stop-color="#fffdf5"/><stop offset="1" stop-color="#f5ecd2"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#bg)"/><rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="url(#gold)" stroke-width="14"/><rect x="66" y="66" width="${W - 132}" height="${H - 132}" fill="none" stroke="#1d2b55" stroke-width="3"/>${corner(66, 66, 1, 1)}${corner(W - 66, 66, -1, 1)}${corner(66, H - 66, 1, -1)}${corner(W - 66, H - 66, -1, -1)}<g><polygon points="${star(W / 2, 1010, 92, 74, 14)}" fill="url(#gold)"/><circle cx="${W / 2}" cy="1010" r="62" fill="#fff8e1" stroke="#a0710a" stroke-width="4"/><polygon points="${star(W / 2, 1010, 36, 15, 5)}" fill="url(#gold)"/></g><line x1="${W / 2 - 330}" x2="${W / 2 + 330}" y1="660" y2="660" stroke="url(#gold)" stroke-width="5"/><line x1="230" x2="640" y1="1020" y2="1020" stroke="#1d2b55" stroke-width="3"/><line x1="${W - 640}" x2="${W - 230}" y1="1020" y2="1020" stroke="#1d2b55" stroke-width="3"/></svg>`)
  const comps = []
  await put(comps, 'SERTIFIKAT', W / 2, 150, 1000, 150, { maxSize: 130, color: '#1d2b55' })
  await put(comps, 'PENGHARGAAN', W / 2, 295, 700, 50, { maxSize: 34, color: '#a0710a', bold: false })
  await put(comps, 'diberikan kepada', W / 2, 400, 700, 60, { maxSize: 40, color: '#555555', bold: false })
  await put(comps, name, W / 2, 470, 1250, 180, { maxSize: 140, color: '#1d2b55' })
  await put(comps, title, W / 2, 690, 1200, 190, { maxSize: 52, color: '#333333', bold: false })
  await put(comps, date, 435, 1035, 380, 50, { maxSize: 32, color: '#1d2b55', bold: false })
  await put(comps, 'Tanggal', 435, 1075, 380, 40, { maxSize: 26, color: '#888888', bold: false })
  await put(comps, giver, W - 435, 1035, 380, 50, { maxSize: 32, color: '#1d2b55' })
  await put(comps, 'Penyelenggara', W - 435, 1075, 380, 40, { maxSize: 26, color: '#888888', bold: false })
  return sharp(svg).composite(comps).jpeg({ quality: 93 }).toBuffer()
}
async function jpegToPdf(jpg, w, h) {
  const { PDFDocument } = require('pdf-lib')
  const doc = await PDFDocument.create()
  const img = await doc.embedJpg(jpg)
  const page = doc.addPage([w, h])
  page.drawImage(img, { x: 0, y: 0, width: w, height: h })
  return Buffer.from(await doc.save())
}

// ---------------- KARTU NAMA ----------------
const CARD_THEMES = {
  gelap: { bg: ['#0f172a', '#1e3a8a'], fg: '#ffffff', sub: '#9db8ff', accent: '#4f8cff' },
  terang: { bg: ['#ffffff', '#eef2ff'], fg: '#0f172a', sub: '#475569', accent: '#4f46e5' },
  hijau: { bg: ['#064e3b', '#10b981'], fg: '#ffffff', sub: '#c7f9e4', accent: '#a7f3d0' },
  emas: { bg: ['#1a1a1a', '#3b2f10'], fg: '#f6d365', sub: '#d9c58f', accent: '#f6d365' }
}
async function bizCard(theme, [name, role, tel, mail, addr]) {
  const T = CARD_THEMES[theme]
  const W = 1050
  const H = 600
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${T.bg[0]}"/><stop offset="1" stop-color="${T.bg[1]}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/><circle cx="${W - 60}" cy="40" r="230" fill="${T.accent}" fill-opacity="0.16"/><circle cx="${W - 200}" cy="${H + 30}" r="180" fill="${T.accent}" fill-opacity="0.12"/><rect x="60" y="${H - 220}" width="90" height="8" rx="4" fill="${T.accent}"/><rect x="0" y="0" width="22" height="${H}" fill="${T.accent}"/></svg>`)
  const comps = []
  const left = async (text, top, w, h, opts) => {
    const b = await io.textFit(text, w, h, { align: 'left', ...opts })
    const m = await io.meta(b)
    comps.push({ input: b, left: 60, top: Math.round(top + (h - m.h) / 2) })
  }
  await left(name, 90, 800, 110, { maxSize: 84, color: T.fg })
  await left(role || '', 205, 800, 56, { maxSize: 38, color: T.sub, bold: false })
  const rows = [['☎', tel], ['✉', mail], ['⌖', addr]].filter((r) => r[1])
  let y = H - 190
  for (const [, v] of rows) {
    await left(v, y, 780, 44, { maxSize: 30, color: T.fg, bold: false })
    y += 54
  }
  return sharp(svg).composite(comps).jpeg({ quality: 94 }).toBuffer()
}

// ---------------- UNDANGAN ----------------
async function invitation(event, when, where, msg, from) {
  const W = 1080
  const H = 1620
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1055"/><stop offset="1" stop-color="#7597de"/></linearGradient><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6d365"/><stop offset="1" stop-color="#d6a032"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/><circle cx="120" cy="140" r="250" fill="#fff" fill-opacity="0.07"/><circle cx="1000" cy="1460" r="320" fill="#fff" fill-opacity="0.08"/><rect x="60" y="60" width="${W - 120}" height="${H - 120}" rx="40" fill="none" stroke="url(#gold)" stroke-width="5"/><rect x="82" y="82" width="${W - 164}" height="${H - 164}" rx="30" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="2"/><rect x="${W / 2 - 90}" y="640" width="180" height="5" rx="2.5" fill="url(#gold)"/><rect x="${W / 2 - 90}" y="1080" width="180" height="5" rx="2.5" fill="url(#gold)"/></svg>`)
  const comps = []
  await put(comps, 'UNDANGAN', W / 2, 170, 800, 70, { maxSize: 56, color: '#f6d365', spacing: 6 })
  await put(comps, 'Dengan hormat, kami mengundang Anda pada', W / 2, 260, 820, 100, { maxSize: 36, bold: false, color: '#ffffff', alpha: 90 })
  await put(comps, event, W / 2, 380, 880, 240, { maxSize: 120, color: '#ffffff' })
  await put(comps, when, W / 2, 680, 860, 170, { maxSize: 54, color: '#f6d365' })
  await put(comps, where, W / 2, 870, 860, 190, { maxSize: 46, color: '#ffffff', bold: false })
  if (msg) await put(comps, msg, W / 2, 1120, 800, 250, { maxSize: 38, color: '#ffffff', bold: false, alpha: 92 })
  if (from) {
    await put(comps, 'Hormat kami,', W / 2, 1360, 600, 50, { maxSize: 32, bold: false, color: '#ffffff', alpha: 80 })
    await put(comps, from, W / 2, 1410, 800, 90, { maxSize: 60, color: '#f6d365' })
  }
  return sharp(svg).composite(comps).jpeg({ quality: 93 }).toBuffer()
}

// ---------------- LOGO TEKS ----------------
const CW = 1080
const CH = 540
async function layer(buf, dx = 0, dy = 0) {
  const m = await io.meta(buf)
  return { input: buf, left: Math.round((CW - m.w) / 2 + dx), top: Math.round((CH - m.h) / 2 + dy) }
}
async function canvasOf(buf, dx = 0, dy = 0) {
  return sharp({ create: { width: CW, height: CH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([await layer(buf, dx, dy)]).png().toBuffer()
}
const gradBuf = (stops, vertical = true) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="${CH}"><defs><linearGradient id="g" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${stops.map((s, i) => `<stop offset="${i / (stops.length - 1)}" stop-color="${s}"/>`).join('')}</linearGradient></defs><rect width="${CW}" height="${CH}" fill="url(#g)"/></svg>`)
async function fillText(whiteText, stops, vertical = true, dx = 0, dy = 0) {
  const mask = await canvasOf(whiteText, dx, dy)
  return sharp(gradBuf(stops, vertical)).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
}
const bg = (stops, vertical = true) => sharp(gradBuf(stops, vertical)).png().toBuffer()
const glow = (buf, r) => sharp(buf).blur(r).toBuffer()

const LOGOS = {
  neon: async (t) => {
    const c = async (col) => canvasOf(await io.textFit(t, 940, 360, { maxSize: 190, color: col }))
    const pink = await c('#ff2bd6')
    const core = await c('#ffe9fb')
    return sharp(await bg(['#0a0014', '#1a0033'])).composite([{ input: await glow(pink, 38) }, { input: await glow(pink, 38) }, { input: await glow(pink, 16) }, { input: await glow(pink, 6) }, { input: core }]).png().toBuffer()
  },
  emas: async (t) => {
    const w = await io.textFit(t, 940, 360, { maxSize: 190, color: '#ffffff' })
    const blk = await canvasOf(await io.textFit(t, 940, 360, { maxSize: 190, color: '#000000', alpha: 70 }), 6, 9)
    const gold = await fillText(w, ['#fff3b0', '#f6d365', '#b8860b', '#f6d365', '#8a6508'])
    return sharp(await bg(['#16110a', '#2c2410'])).composite([{ input: await glow(blk, 7) }, { input: gold }]).png().toBuffer()
  },
  es: async (t) => {
    const w = await io.textFit(t, 940, 360, { maxSize: 190, color: '#ffffff' })
    const cy = await canvasOf(await io.textFit(t, 940, 360, { maxSize: 190, color: '#4fd8ff' }))
    const ice = await fillText(w, ['#ffffff', '#c6f1ff', '#5cc8ff', '#2b8cff'])
    return sharp(await bg(['#041a33', '#0a3a66'])).composite([{ input: await glow(cy, 26) }, { input: await glow(cy, 10) }, { input: ice }]).png().toBuffer()
  },
  api: async (t) => {
    const w = await io.textFit(t, 940, 360, { maxSize: 190, color: '#ffffff' })
    const or = await canvasOf(await io.textFit(t, 940, 360, { maxSize: 190, color: '#ff7a00' }))
    const fire = await fillText(w, ['#fff7a8', '#ffd23c', '#ff8a00', '#e0300a', '#7a0c00'])
    return sharp(await bg(['#050000', '#240500'])).composite([{ input: await glow(or, 34) }, { input: await glow(or, 12) }, { input: fire }]).png().toBuffer()
  },
  retro: async (t) => {
    const w = await io.textFit(t, 900, 330, { maxSize: 180, color: '#ffffff' })
    const side = await io.textFit(t, 900, 330, { maxSize: 180, color: '#4a1a7a' })
    const comps = []
    for (let i = 16; i >= 1; i--) comps.push(await layer(side, i, i))
    comps.forEach((c) => { c.input = side })
    const face = await fillText(w, ['#ff5fa2', '#ffb347', '#fff275'])
    const sun = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="${CH}"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a3c"/><stop offset="1" stop-color="#ff2e88"/></linearGradient></defs><circle cx="540" cy="540" r="330" fill="url(#s)" fill-opacity="0.55"/>${Array.from({ length: 7 }, (_, i) => `<rect x="0" y="${300 + i * 36}" width="${CW}" height="${4 + i * 3}" fill="#1b0b3a"/>`).join('')}</svg>`)
    return sharp(await bg(['#1b0b3a', '#3d1275'])).composite([{ input: sun }, ...comps, { input: face, left: 0, top: 0 }]).png().toBuffer()
  },
  '3d': async (t) => {
    const w = await io.textFit(t, 900, 330, { maxSize: 180, color: '#ffffff' })
    const side = await io.textFit(t, 900, 330, { maxSize: 180, color: '#c2410c' })
    const comps = []
    for (let i = 20; i >= 1; i--) comps.push(await layer(side, i * 0.8, i))
    const face = await fillText(w, ['#fff7a8', '#ffd23c', '#ffb000'])
    const sh = await canvasOf(await io.textFit(t, 900, 330, { maxSize: 180, color: '#000000', alpha: 55 }), 26, 34)
    return sharp(await bg(['#1d4ed8', '#60a5fa'])).composite([{ input: await glow(sh, 14) }, ...comps, { input: face }]).png().toBuffer()
  },
  hologram: async (t) => {
    const w = await io.textFit(t, 940, 360, { maxSize: 190, color: '#ffffff' })
    const holo = await fillText(w, ['#00f5ff', '#7b61ff', '#ff4fd8', '#ffe66d', '#00f5ff'], false)
    const cy = await canvasOf(await io.textFit(t, 940, 360, { maxSize: 190, color: '#7b61ff' }))
    const scan = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="${CH}">${Array.from({ length: 90 }, (_, i) => `<rect y="${i * 6}" width="${CW}" height="2" fill="#000" fill-opacity="0.28"/>`).join('')}</svg>`)
    const text = await sharp(holo).composite([{ input: scan, blend: 'dest-out' }]).png().toBuffer()
    return sharp(await bg(['#05060f', '#0e1030'])).composite([{ input: await glow(cy, 30) }, { input: text }]).png().toBuffer()
  },
  glitch: async (t) => {
    const c = async (col) => canvasOf(await io.textFit(t, 900, 330, { maxSize: 180, color: col }))
    const red = await c('#ff003c')
    const cyan = await c('#00e5ff')
    const white = await c('#ffffff')
    const shift = (b, dx, dy) => sharp({ create: { width: CW, height: CH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: b, left: Math.max(0, dx), top: Math.max(0, dy) }]).png().toBuffer()
    const bars = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="${CH}"><rect x="0" y="170" width="${CW}" height="14" fill="#000"/><rect x="0" y="262" width="${CW}" height="9" fill="#000"/><rect x="0" y="352" width="${CW}" height="18" fill="#000"/></svg>`)
    const comp = await sharp(await bg(['#0a0a0a', '#151515'])).composite([{ input: await shift(red, 10, 0), blend: 'screen' }, { input: await shift(cyan, 0, 0), blend: 'screen' }, { input: white, blend: 'over' }]).png().toBuffer()
    return sharp(comp).composite([{ input: bars, blend: 'multiply' }]).png().toBuffer()
  },
  gradasi: async (t) => {
    const w = await io.textFit(t, 940, 360, { maxSize: 190, color: '#ffffff' })
    const g = await fillText(w, ['#ff512f', '#dd2476', '#8e2de2', '#4a00e0'], false)
    const sh = await canvasOf(await io.textFit(t, 940, 360, { maxSize: 190, color: '#4a00e0', alpha: 30 }), 0, 12)
    return sharp(await bg(['#ffffff', '#f1f1f8'])).composite([{ input: await glow(sh, 12) }, { input: g }]).png().toBuffer()
  }
}

const specs = {
  sertifikat: { desc: 'Buat sertifikat penghargaan elegan (gambar + PDF siap cetak A4)', usage: '<nama> | <untuk apa> | <penyelenggara> | [tanggal]', example: 'Budi Santoso | Juara 1 Lomba Desain Poster | OSIS SMAN 1', args: true, heavy: true, run: async (c) => {
    const [name, title, giver, date] = parts(c, 3, '<nama> | <untuk apa> | <penyelenggara> | [tanggal]')
    const img = await certificate(name.slice(0, 60), title.slice(0, 160), giver.slice(0, 40), (date || today()).slice(0, 30))
    await c.sock.sendMessage(c.from, { image: img, caption: `🏅 Sertifikat untuk *${name}*\nPDF A4 siap cetak ada di bawah.` }, { quoted: c.msg })
    return { documents: [{ buffer: await jpegToPdf(img, 842, 595), name: `sertifikat-${name.replace(/[^\w]+/g, '-').slice(0, 24)}.pdf`, mime: 'application/pdf' }] }
  } },
  kartunama: { desc: 'Kartu nama digital 4 tema (gelap, terang, hijau, emas)', usage: '<nama> | <jabatan> | <telepon> | <email> | [alamat]', example: 'Budi Santoso | Desainer Grafis | 0812-3456-7890 | budi@mail.com | Jakarta', args: true, heavy: true, run: async (c) => {
    const p = parts(c, 2, '<nama> | <jabatan> | <telepon> | <email> | [alamat]').map((s) => s.slice(0, 60))
    const themes = Object.keys(CARD_THEMES)
    const images = []
    for (const t of themes) images.push(await bizCard(t, p))
    return { images, captions: themes.map((t) => `🪪 Tema ${t}`) }
  } },
  undangan: { desc: 'Poster undangan acara yang cantik', usage: '<acara> | <hari, tanggal & jam> | <tempat> | [pesan] | [dari]', example: 'Ulang Tahun Ke-17 Sinta | Sabtu, 20 Des 2026 • 18.00 WIB | Cafe Bunga, Bandung | Mohon kehadirannya | Keluarga Sinta', args: true, heavy: true, run: async (c) => {
    const [event, when, where, msg, from] = parts(c, 3, '<acara> | <waktu> | <tempat> | [pesan] | [dari]')
    return { image: await invitation(event.slice(0, 80), when.slice(0, 100), where.slice(0, 120), (msg || '').slice(0, 200), (from || '').slice(0, 50)), caption: '💌 Undangan siap dibagikan' }
  } },
  logo: { desc: `Logo teks bergaya: ${Object.keys(LOGOS).join(', ')}`, usage: '<gaya> <teks>', example: 'neon VANXONE', args: true, heavy: true, run: async (c) => {
    const style = (c.args[0] || '').toLowerCase()
    const t = c.args.slice(1).join(' ').trim().slice(0, 24)
    if (!LOGOS[style]) throw bad(`Gaya tersedia: ${Object.keys(LOGOS).join(', ')}\nContoh: ${c.prefix}logo neon VANXONE`)
    if (!t) throw bad('Tulis teks logonya.')
    return { image: await LOGOS[style](t), caption: `✨ Logo gaya ${style}` }
  } },
  logoall: { desc: 'Lihat satu teks dalam semua gaya logo sekaligus', usage: '<teks>', example: 'VANXONE', args: true, heavy: true, run: async (c) => {
    const t = kit.rest(c.body).trim().slice(0, 20)
    const styles = Object.keys(LOGOS)
    const images = []
    for (const s of styles) images.push(await LOGOS[s](t))
    return { images, captions: styles.map((s) => `✨ ${s}`) }
  } }
}

module.exports = kit.multi({ name: 'designkit', category: 'image', emoji: '🎨', desc: 'Sertifikat, kartu nama, undangan, dan logo teks bergaya', specs })
