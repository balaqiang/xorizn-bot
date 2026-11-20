// Warna & kalender: kartu info warna, generator palet harmoni, kalender bulanan bergambar
const kit = require('../../lib/kit')
const io = require('../../lib/imgops')
const sharp = require('sharp')

const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })
const hex2 = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0')
const rgb2hex = (r, g, b) => `#${hex2(r)}${hex2(g)}${hex2(b)}`
function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  const l = (mx + mn) / 2
  const d = mx - mn
  let h = 0
  let s = 0
  if (d) {
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn)
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4
    h *= 60
  }
  return [h, s * 100, l * 100]
}
function hsl2rgb(h, s, l) {
  h = ((h % 360) + 360) % 360; s = Math.max(0, Math.min(100, s)) / 100; l = Math.max(0, Math.min(100, l)) / 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [f(0) * 255, f(8) * 255, f(4) * 255]
}
const hslHex = (h, s, l) => rgb2hex(...hsl2rgb(h, s, l))
const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const textOn = (rgb) => (contrast(rgb, [255, 255, 255]) >= contrast(rgb, [0, 0, 0]) ? '#ffffff' : '#111111')

function getColor(arg) {
  const raw = String(arg || '').trim()
  const hex = io.parseColor(raw) || io.parseColor(raw.replace(/\s+/g, '')) || raw.split(/\s+/).map((w) => io.parseColor(w)).find(Boolean)
  if (!hex) throw bad('Warna tidak dikenali. Pakai nama (merah, biru langit…) atau hex seperti #ff6600.')
  const rgb = io.hexToRgb(hex)
  return { hex: hex.toLowerCase(), rgb }
}
async function label(comps, text, x, y, w, h, opts) {
  const b = await io.textFit(text, w, h, opts)
  const m = await io.meta(b)
  comps.push({ input: b, left: Math.round(x + (opts.center ? (w - m.w) / 2 : 0)), top: Math.round(y + (h - m.h) / 2) })
}

async function colorCard({ hex, rgb }) {
  const [h, s, l] = rgb2hsl(...rgb)
  const k = 1 - Math.max(...rgb) / 255
  const cmyk = k >= 1 ? [0, 0, 0, 100] : rgb.map((v) => Math.round(((1 - v / 255 - k) / (1 - k)) * 100)).concat(Math.round(k * 100))
  const W = 1080
  const H = 1260
  const fg = textOn(rgb)
  const comps = []
  await label(comps, hex.toUpperCase(), 60, 150, 960, 200, { maxSize: 170, color: fg, align: 'left' })
  await label(comps, 'KODE WARNA', 66, 100, 500, 40, { maxSize: 28, color: fg, bold: false, alpha: 80, align: 'left' })
  const rows = [['RGB', `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`], ['HSL', `${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%`], ['CMYK', `${cmyk.join('%, ')}%`]]
  let y = 400
  for (const [k1, v] of rows) {
    await label(comps, k1, 66, y, 200, 50, { maxSize: 36, color: fg, bold: false, alpha: 75, align: 'left' })
    await label(comps, v, 260, y, 760, 50, { maxSize: 42, color: fg, align: 'left' })
    y += 66
  }
  let shapes = `<rect width="${W}" height="740" fill="${hex}"/><rect y="740" width="${W}" height="${H - 740}" fill="#ffffff"/>`
  await label(comps, 'VARIASI TERANG → GELAP', 60, 770, 700, 40, { maxSize: 28, color: '#6b7280', bold: false, align: 'left' })
  const lv = [92, 78, 64, 50, 36, 24, 12].map((x) => x)
  const sw = (W - 120) / lv.length
  for (let i = 0; i < lv.length; i++) {
    const c = hslHex(h, s, lv[i])
    shapes += `<rect x="${60 + i * sw}" y="830" width="${sw - 8}" height="130" rx="18" fill="${c}"/>`
    await label(comps, c.toUpperCase(), 60 + i * sw, 970, sw - 8, 34, { maxSize: 22, color: '#374151', bold: false, center: true })
  }
  const comp = hslHex(h + 180, s, l)
  shapes += `<rect x="60" y="1040" width="${(W - 140) / 2}" height="150" rx="24" fill="${comp}"/><rect x="${60 + (W - 140) / 2 + 20}" y="1040" width="${(W - 140) / 2}" height="150" rx="24" fill="#ffffff" stroke="#e5e7eb" stroke-width="3"/>`
  await label(comps, `Komplementer ${comp.toUpperCase()}`, 80, 1040, (W - 140) / 2 - 40, 150, { maxSize: 34, color: textOn(io.hexToRgb(comp)), center: true })
  const cw = contrast(rgb, [255, 255, 255])
  const cb = contrast(rgb, [0, 0, 0])
  await label(comps, `Kontras putih ${cw.toFixed(1)}:1  •  hitam ${cb.toFixed(1)}:1`, 60 + (W - 140) / 2 + 40, 1040, (W - 140) / 2 - 40, 90, { maxSize: 30, color: '#374151', bold: false, center: true })
  await label(comps, cw >= 4.5 ? '✓ teks putih terbaca (AA)' : cb >= 4.5 ? '✓ teks hitam terbaca (AA)' : '⚠ kontras rendah', 60 + (W - 140) / 2 + 40, 1120, (W - 140) / 2 - 40, 50, { maxSize: 28, color: '#6b7280', bold: false, center: true })
  return sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${shapes}</svg>`)).composite(comps).jpeg({ quality: 93 }).toBuffer()
}

const SCHEMES = {
  komplementer: (h) => [h, h + 180],
  analogus: (h) => [h - 30, h, h + 30],
  triadik: (h) => [h, h + 120, h + 240],
  tetradik: (h) => [h, h + 90, h + 180, h + 270],
  split: (h) => [h, h + 150, h + 210],
  monokrom: (h) => [h, h, h, h, h]
}
async function paletteCard(base, scheme) {
  const [h, s, l] = rgb2hsl(...base.rgb)
  const hues = SCHEMES[scheme](h)
  const cols = scheme === 'monokrom' ? [88, 70, 52, 34, 18].map((lv) => hslHex(h, s, lv)) : hues.map((hh, i) => (i === 0 ? base.hex : hslHex(hh, s, l)))
  const W = 1080
  const n = cols.length
  const H = 760
  const sw = (W - 120 - (n - 1) * 16) / n
  let shapes = `<rect width="${W}" height="${H}" fill="#fafafa"/>`
  const comps = []
  await label(comps, `Palet ${scheme}`, 60, 50, 960, 100, { maxSize: 66, color: '#111827', align: 'left' })
  for (let i = 0; i < n; i++) {
    const x = 60 + i * (sw + 16)
    shapes += `<rect x="${x}" y="190" width="${sw}" height="420" rx="26" fill="${cols[i]}"/>`
    await label(comps, cols[i].toUpperCase(), x, 630, sw, 50, { maxSize: 36, color: '#111827', center: true })
    const rgb = io.hexToRgb(cols[i])
    await label(comps, `${rgb[0]},${rgb[1]},${rgb[2]}`, x, 676, sw, 36, { maxSize: 24, color: '#6b7280', bold: false, center: true })
  }
  return { image: await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${shapes}</svg>`)).composite(comps).jpeg({ quality: 93 }).toBuffer(), cols }
}

// ---------- kalender ----------
const BLN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
async function calendarImage(y, mo) {
  const W = 1080
  const first = new Date(Date.UTC(y, mo, 1)).getUTCDay()
  const days = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate()
  const rows = Math.ceil((first + days) / 7)
  const cw = 140
  const ch = 120
  const X0 = (W - cw * 7) / 2
  const Y0 = 360
  const H = Y0 + rows * ch + 120
  const wib = new Date(Date.now() + 7 * 3600e3)
  const isNow = wib.getUTCFullYear() === y && wib.getUTCMonth() === mo
  let shapes = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1e3a8a"/><stop offset="1" stop-color="#6d28d9"/></linearGradient></defs><rect width="${W}" height="${H}" fill="#f8fafc"/><rect width="${W}" height="250" fill="url(#g)"/><rect x="${X0}" y="${Y0 - 70}" width="${cw * 7}" height="62" rx="16" fill="#e0e7ff"/>`
  const comps = []
  await label(comps, `${BLN[mo]} ${y}`.toUpperCase(), 60, 70, 960, 120, { maxSize: 100, color: '#ffffff', center: true })
  const hd = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB']
  for (let i = 0; i < 7; i++) await label(comps, hd[i], X0 + i * cw, Y0 - 70, cw, 62, { maxSize: 30, color: i === 0 ? '#dc2626' : i === 6 ? '#2563eb' : '#334155', center: true })
  for (let d = 1; d <= days; d++) {
    const idx = first + d - 1
    const col = idx % 7
    const row = Math.floor(idx / 7)
    const cx = X0 + col * cw
    const cy = Y0 + row * ch
    const today = isNow && wib.getUTCDate() === d
    if (today) shapes += `<rect x="${cx + 14}" y="${cy + 12}" width="${cw - 28}" height="${ch - 24}" rx="28" fill="#6d28d9"/>`
    else if (col === 0) shapes += `<rect x="${cx + 14}" y="${cy + 12}" width="${cw - 28}" height="${ch - 24}" rx="28" fill="#fee2e2" fill-opacity="0.6"/>`
    await label(comps, String(d), cx, cy, cw, ch, { maxSize: 56, color: today ? '#ffffff' : col === 0 ? '#dc2626' : col === 6 ? '#2563eb' : '#1e293b', center: true })
  }
  await label(comps, isNow ? `Hari ini: ${wib.getUTCDate()} ${BLN[mo]} ${y}` : `${days} hari • mulai hari ${['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][first]}`, 60, H - 90, 960, 50, { maxSize: 32, color: '#64748b', bold: false, center: true })
  return sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${shapes}</svg>`)).composite(comps).jpeg({ quality: 93 }).toBuffer()
}

const specs = {
  warna: { desc: 'Kartu info warna: kode HEX/RGB/HSL/CMYK, variasi, komplementer, kontras teks', usage: '<nama warna atau #hex>', example: 'biru langit', args: true, heavy: true, run: async (c) => ({ image: await colorCard(getColor(c.args.join(' '))), caption: '🎨 Info warna' }) },
  paletgen: { desc: `Buat palet warna harmonis dari satu warna (${Object.keys(SCHEMES).join(', ')})`, usage: '<warna> [skema]', example: '#ff6600 triadik', args: true, heavy: true, run: async (c) => {
    const scheme = c.args.map((a) => a.toLowerCase()).find((a) => SCHEMES[a]) || 'analogus'
    const color = getColor(c.args.filter((a) => !SCHEMES[a.toLowerCase()]).join(' '))
    const r = await paletteCard(color, scheme)
    return { image: r.image, caption: `🎨 Palet ${scheme}\n${r.cols.map((x) => x.toUpperCase()).join('  ')}\n\nSkema lain: ${Object.keys(SCHEMES).join(', ')}` }
  } },
  kalender: { desc: 'Kalender bulanan bergambar (default bulan ini)', usage: '[bulan 1-12] [tahun]', example: '12 2026', optional: true, heavy: true, run: async (c) => {
    const wib = new Date(Date.now() + 7 * 3600e3)
    const mo = c.args[0] ? Number(c.args[0]) - 1 : wib.getUTCMonth()
    const y = c.args[1] ? Number(c.args[1]) : wib.getUTCFullYear()
    if (!Number.isInteger(mo) || mo < 0 || mo > 11 || !Number.isInteger(y) || y < 1900 || y > 2200) throw bad('Format: .kalender [bulan 1-12] [tahun]\nContoh: .kalender 12 2026')
    return { image: await calendarImage(y, mo), caption: `📅 ${BLN[mo]} ${y}` }
  } }
}

module.exports = kit.multi({ name: 'colorkit', category: 'image', emoji: '🎨', desc: 'Info warna, palet harmoni, dan kalender bulanan', specs, alias: { color: 'warna', colour: 'warna' } })
