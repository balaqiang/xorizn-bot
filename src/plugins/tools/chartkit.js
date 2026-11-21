// Grafik & tabel jadi gambar rapi: batang, garis, kue/donat, tabel zebra
const kit = require('../../lib/kit')
const io = require('../../lib/imgops')
const sharp = require('sharp')
const { parseMoney } = require('../../lib/uitext')

const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })
const PAL = ['#4f8cff', '#ff6b8a', '#ffb347', '#3ddc97', '#b388ff', '#2ec4d6', '#ff8c5a', '#c6e04b', '#f06ede', '#7d8cff', '#5ad1a4', '#ffd166']
const W = 1080

const short = (n) => {
  const a = Math.abs(n)
  const f = (v, u) => `${(+v.toFixed(1)).toString().replace('.', ',')}${u}`
  if (a >= 1e12) return f(n / 1e12, ' T')
  if (a >= 1e9) return f(n / 1e9, ' M')
  if (a >= 1e6) return f(n / 1e6, ' jt')
  if (a >= 1e4) return f(n / 1e3, ' rb')
  return Number.isInteger(n) ? n.toLocaleString('id-ID') : f(n, '')
}
function niceMax(max) {
  if (max <= 0) return { top: 1, step: 0.25 }
  const raw = max / 5
  const p = Math.pow(10, Math.floor(Math.log10(raw)))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= raw)
  return { top: Math.ceil(max / step) * step, step }
}

// "judul | a=10, b=20" -> { title, items }
function parseData(body) {
  const raw = kit.rest(body).trim()
  const parts = raw.split('|').map((s) => s.trim())
  const title = parts.length > 1 ? parts[0] : ''
  const dataStr = parts.length > 1 ? parts.slice(1).join(' ') : parts[0]
  const items = []
  for (const tok of dataStr.split(/\s*[;\n]\s*|,(?=\s*[^\d\s])/).map((s) => s.trim()).filter(Boolean)) {
    const m = tok.match(/^(.+?)\s*[=:]\s*(-?[\d.,]+\s*[a-zA-Z]*)$/) || tok.match(/^(.+?)\s+(-?[\d.,]+\s*[a-zA-Z]*)$/)
    if (!m) throw bad(`Format "${tok}" tidak dikenali. Tulis: label=nilai, misalnya Jan=120, Feb=150`)
    let v = parseMoney(m[2].replace(/^-/, ''))
    if (v == null) throw bad(`Nilai "${m[2]}" bukan angka.`)
    if (m[2].trim().startsWith('-')) v = -v
    items.push({ label: m[1].trim().slice(0, 24), value: v })
  }
  if (items.length < 2) throw bad('Minimal 2 data. Contoh: .grafik Penjualan | Jan=120, Feb=150, Mar=90')
  if (items.length > 12) throw bad('Maksimal 12 data per grafik.')
  return { title: title.slice(0, 60), items }
}

async function T(text, size, color = '#ffffff', opts = {}) {
  const buf = await io.textPng(String(text), { size, color, ...opts })
  const m = await io.meta(buf)
  return { buf, w: m.w, h: m.h }
}
const bgSvg = (w, h, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#101a33"/><stop offset="1" stop-color="#1d2b55"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#bg)"/><rect x="30" y="30" width="${w - 60}" height="${h - 60}" rx="36" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.12"/>${extra}</svg>`

async function header(title, sub, comps) {
  const t = await io.textFit(title || 'GRAFIK', 900, 90, { maxSize: 60, color: '#ffffff' })
  const tm = await io.meta(t)
  comps.push({ input: t, left: Math.round((W - tm.w) / 2), top: 70 + Math.round((90 - tm.h) / 2) })
  if (sub) {
    const s = await T(sub, 26, '#9fb0d8', { bold: false })
    comps.push({ input: s.buf, left: Math.round((W - s.w) / 2), top: 160 })
  }
}

async function barChart({ title, items }, horizontal = false) {
  const n = items.length
  const H = horizontal ? 330 + n * 74 : 1000
  const comps = []
  let shapes = ''
  await header(title, `${n} data • total ${short(items.reduce((s, i) => s + i.value, 0))}`, comps)
  const vals = items.map((i) => i.value)
  const max = Math.max(...vals, 0)
  const min = Math.min(...vals, 0)
  if (!horizontal) {
    const X0 = 150
    const X1 = W - 70
    const Y0 = 250
    const Y1 = 810
    const { top, step } = niceMax(max - min === 0 ? 1 : Math.max(max, -min))
    const lo = min < 0 ? -Math.ceil(-min / step) * step : 0
    const span = top - lo
    const y = (v) => Y1 - ((v - lo) / span) * (Y1 - Y0)
    for (let g = lo; g <= top + 1e-9; g += step) {
      shapes += `<line x1="${X0}" x2="${X1}" y1="${y(g)}" y2="${y(g)}" stroke="#ffffff" stroke-opacity="${g === 0 ? 0.35 : 0.1}" stroke-width="${g === 0 ? 2 : 1}"/>`
      const t = await T(short(g), 22, '#9fb0d8', { bold: false, align: 'right', width: 90 })
      comps.push({ input: t.buf, left: X0 - 100 - 0, top: Math.round(y(g) - t.h / 2) })
    }
    const slot = (X1 - X0) / n
    const bw = Math.min(110, slot * 0.62)
    for (let i = 0; i < n; i++) {
      const cx = X0 + slot * (i + 0.5)
      const v = items[i].value
      const yt = Math.min(y(v), y(0))
      const hh = Math.max(3, Math.abs(y(v) - y(0)))
      const c = PAL[i % PAL.length]
      shapes += `<defs><linearGradient id="b${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0.55"/></linearGradient></defs><rect x="${cx - bw / 2}" y="${yt}" width="${bw}" height="${hh}" rx="14" fill="url(#b${i})"/>`
      const vt = await T(short(v), n > 8 ? 22 : 28, '#ffffff')
      comps.push({ input: vt.buf, left: Math.round(cx - vt.w / 2), top: Math.round(v >= 0 ? yt - vt.h - 8 : yt + hh + 6) })
      const lt = await io.textFit(items[i].label, Math.round(slot - 8), 90, { maxSize: 26, color: '#dbe4ff', bold: false })
      const lm = await io.meta(lt)
      comps.push({ input: lt, left: Math.round(cx - lm.w / 2), top: Y1 + 22 })
    }
  } else {
    const X0 = 300
    const X1 = W - 150
    const span = Math.max(max, 1)
    for (let i = 0; i < n; i++) {
      const yy = 230 + i * 74
      const v = items[i].value
      const len = Math.max(6, (Math.max(v, 0) / span) * (X1 - X0))
      const c = PAL[i % PAL.length]
      shapes += `<rect x="${X0}" y="${yy}" width="${X1 - X0}" height="46" rx="23" fill="#ffffff" fill-opacity="0.06"/><defs><linearGradient id="h${i}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c}" stop-opacity="0.6"/><stop offset="1" stop-color="${c}"/></linearGradient></defs><rect x="${X0}" y="${yy}" width="${len}" height="46" rx="23" fill="url(#h${i})"/>`
      const lt = await io.textFit(items[i].label, 250, 46, { maxSize: 28, color: '#dbe4ff', bold: false, align: 'right' })
      const lm = await io.meta(lt)
      comps.push({ input: lt, left: X0 - 20 - lm.w, top: yy + Math.round((46 - lm.h) / 2) })
      const vt = await T(short(v), 26, '#ffffff')
      comps.push({ input: vt.buf, left: Math.round(Math.min(X0 + len + 14, W - 60 - vt.w)), top: yy + Math.round((46 - vt.h) / 2) })
    }
  }
  return sharp(Buffer.from(bgSvg(W, H, shapes))).composite(comps).png().toBuffer()
}

async function lineChart({ title, items }) {
  const n = items.length
  const H = 1000
  const comps = []
  let shapes = ''
  await header(title, `${n} titik data`, comps)
  const vals = items.map((i) => i.value)
  const hi = Math.max(...vals, 0)
  const lo0 = Math.min(...vals, 0)
  const { top, step } = niceMax(Math.max(hi, -lo0, 1))
  const lo = lo0 < 0 ? -Math.ceil(-lo0 / step) * step : 0
  const X0 = 150
  const X1 = W - 90
  const Y0 = 250
  const Y1 = 810
  const y = (v) => Y1 - ((v - lo) / (top - lo)) * (Y1 - Y0)
  for (let g = lo; g <= top + 1e-9; g += step) {
    shapes += `<line x1="${X0}" x2="${X1}" y1="${y(g)}" y2="${y(g)}" stroke="#ffffff" stroke-opacity="${g === 0 ? 0.35 : 0.1}"/>`
    const t = await T(short(g), 22, '#9fb0d8', { bold: false, align: 'right', width: 90 })
    comps.push({ input: t.buf, left: X0 - 100, top: Math.round(y(g) - t.h / 2) })
  }
  const pts = items.map((it, i) => [X0 + 40 + ((X1 - X0 - 80) * i) / (n - 1), y(it.value)])
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  shapes += `<defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f8cff" stop-opacity="0.45"/><stop offset="1" stop-color="#4f8cff" stop-opacity="0"/></linearGradient></defs><path d="${path} L${pts[n - 1][0]},${y(0)} L${pts[0][0]},${y(0)} Z" fill="url(#ar)"/><path d="${path}" fill="none" stroke="#7fb0ff" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`
  const slot = (X1 - X0 - 80) / Math.max(1, n - 1)
  for (let i = 0; i < n; i++) {
    shapes += `<circle cx="${pts[i][0]}" cy="${pts[i][1]}" r="11" fill="#101a33" stroke="#ffffff" stroke-width="5"/>`
    const vt = await T(short(items[i].value), n > 8 ? 21 : 26, '#ffffff')
    comps.push({ input: vt.buf, left: Math.round(pts[i][0] - vt.w / 2), top: Math.round(pts[i][1] - vt.h - 20) })
    const lt = await io.textFit(items[i].label, Math.round(Math.max(60, slot - 6)), 90, { maxSize: 24, color: '#dbe4ff', bold: false })
    const lm = await io.meta(lt)
    comps.push({ input: lt, left: Math.round(pts[i][0] - lm.w / 2), top: Y1 + 22 })
  }
  const first = vals[0]
  const last = vals[n - 1]
  const ch = first ? ((last - first) / Math.abs(first)) * 100 : 0
  const sm = await T(`${last >= first ? '▲' : '▼'} ${Math.abs(ch).toFixed(1).replace('.', ',')}% dari awal ke akhir`, 30, last >= first ? '#3ddc97' : '#ff6b8a')
  comps.push({ input: sm.buf, left: Math.round((W - sm.w) / 2), top: 900 })
  return sharp(Buffer.from(bgSvg(W, H, shapes))).composite(comps).png().toBuffer()
}

async function pieChart({ title, items }, donut = true) {
  if (items.some((i) => i.value < 0)) throw bad('Diagram kue tidak bisa memakai nilai negatif.')
  const total = items.reduce((s, i) => s + i.value, 0)
  if (total <= 0) throw bad('Total nilai harus lebih dari 0.')
  const n = items.length
  const H = 820 + n * 52 + 40
  const comps = []
  let shapes = ''
  await header(title, `total ${short(total)}`, comps)
  const cx = W / 2
  const cy = 500
  const R = 270
  let a0 = -Math.PI / 2
  items.forEach((it, i) => {
    const frac = it.value / total
    const a1 = a0 + frac * Math.PI * 2
    const c = PAL[i % PAL.length]
    if (frac >= 0.9999) shapes += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${c}"/>`
    else if (frac > 0) {
      const large = frac > 0.5 ? 1 : 0
      shapes += `<path d="M${cx},${cy} L${cx + R * Math.cos(a0)},${cy + R * Math.sin(a0)} A${R},${R} 0 ${large} 1 ${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)} Z" fill="${c}" stroke="#101a33" stroke-width="5"/>`
    }
    a0 = a1
  })
  if (donut) shapes += `<circle cx="${cx}" cy="${cy}" r="${R * 0.52}" fill="#14204a"/>`
  if (donut) {
    const t1 = await T('TOTAL', 26, '#9fb0d8', { bold: false })
    const t2 = await T(short(total), 52, '#ffffff')
    comps.push({ input: t1.buf, left: Math.round(cx - t1.w / 2), top: cy - 50 }, { input: t2.buf, left: Math.round(cx - t2.w / 2), top: cy - 8 })
  }
  for (let i = 0; i < n; i++) {
    const yy = 840 + i * 52
    shapes += `<rect x="130" y="${yy + 8}" width="26" height="26" rx="8" fill="${PAL[i % PAL.length]}"/>`
    const lt = await io.textFit(items[i].label, 480, 44, { maxSize: 30, color: '#e8eeff', bold: false, align: 'left' })
    const lm = await io.meta(lt)
    comps.push({ input: lt, left: 176, top: yy + Math.round((42 - lm.h) / 2) })
    const pt = await T(`${short(items[i].value)}  •  ${((items[i].value / total) * 100).toFixed(1).replace('.', ',')}%`, 28, '#ffffff', { align: 'right', width: 330 })
    comps.push({ input: pt.buf, left: W - 130 - 330, top: yy + Math.round((42 - pt.h) / 2) })
  }
  return sharp(Buffer.from(bgSvg(W, H, shapes))).composite(comps).png().toBuffer()
}

async function tableImage(raw) {
  const rows = raw.split('|').map((s) => s.trim())
  const title = rows.shift()
  const data = rows.filter(Boolean).map((r) => r.split(/,\s+|,$/).map((c) => c.trim()))
  if (data.length < 2) throw bad('Format: .tabel Judul | kolom1, kolom2 | isi1, isi2 | isi3, isi4')
  if (data.length > 31) throw bad('Maksimal 30 baris data.')
  const cols = Math.max(...data.map((r) => r.length))
  if (cols > 8) throw bad('Maksimal 8 kolom.')
  const size = cols > 5 ? 24 : 28
  const NUM = /^-?[\d.,]+\s*%?$/
  const colNum = Array.from({ length: cols }, (_, c) => data.slice(1).every((r) => !r[c] || NUM.test(r[c])))
  const cells = []
  const widths = new Array(cols).fill(0)
  for (let r = 0; r < data.length; r++) {
    cells.push([])
    for (let c = 0; c < cols; c++) {
      const txt = (data[r][c] ?? '').slice(0, 40)
      const t = txt ? await T(txt, size, r === 0 ? '#ffffff' : '#e8eeff', { bold: r === 0, align: colNum[c] ? 'right' : 'left' }) : null
      cells[r].push(t)
      widths[c] = Math.max(widths[c], t ? t.w : 0)
    }
  }
  const padX = 26
  const rowH = size + 36
  const colW = widths.map((w) => Math.max(90, w + padX * 2))
  const inner = colW.reduce((a, b) => a + b, 0)
  const TW = Math.max(inner + 120, 700)
  const top0 = 190
  const TH = top0 + data.length * rowH + 100
  const comps = []
  const t = await io.textFit(title || 'TABEL', TW - 160, 80, { maxSize: 56 })
  const tm = await io.meta(t)
  comps.push({ input: t, left: Math.round((TW - tm.w) / 2), top: 60 + Math.round((80 - tm.h) / 2) })
  const x0 = Math.round((TW - inner) / 2)
  let shapes = `<rect x="${x0}" y="${top0}" width="${inner}" height="${rowH}" rx="18" fill="#4f8cff"/>`
  for (let r = 1; r < data.length; r++) if (r % 2 === 0) shapes += `<rect x="${x0}" y="${top0 + r * rowH}" width="${inner}" height="${rowH}" fill="#ffffff" fill-opacity="0.06"/>`
  shapes += `<rect x="${x0}" y="${top0}" width="${inner}" height="${data.length * rowH}" rx="18" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2"/>`
  for (let r = 0; r < data.length; r++) {
    let x = x0
    for (let c = 0; c < cols; c++) {
      const cell = cells[r][c]
      if (cell) {
        const right = colNum[c]
        comps.push({ input: cell.buf, left: Math.round(right ? x + colW[c] - padX - cell.w : x + padX), top: top0 + r * rowH + Math.round((rowH - cell.h) / 2) })
      }
      x += colW[c]
    }
  }
  const foot = await T(`${data.length - 1} baris • ${cols} kolom`, 22, '#9fb0d8', { bold: false })
  comps.push({ input: foot.buf, left: Math.round((TW - foot.w) / 2), top: TH - 70 })
  return sharp(Buffer.from(bgSvg(TW, TH, shapes))).composite(comps).png().toBuffer()
}

const HELP = 'Format: judul | label=nilai, label=nilai\nContoh: Penjualan | Jan=120, Feb=150, Mar=90\nNilai boleh pakai singkatan: 5rb, 2,5jt, 1m'
const specs = {
  grafik: { desc: 'Grafik batang vertikal dari data yang kamu tulis', usage: '<judul> | label=nilai, label=nilai', example: 'Penjualan | Jan=120, Feb=150, Mar=90', args: true, heavy: true, run: async (c) => ({ image: await barChart(parseData(c.body)), caption: '📊 Grafik batang' }) },
  grafikh: { desc: 'Grafik batang horizontal (cocok untuk peringkat)', usage: '<judul> | label=nilai, ...', example: 'Skor | Andi=90, Budi=75, Citra=82', args: true, heavy: true, run: async (c) => {
    const d = parseData(c.body)
    d.items.sort((a, b) => b.value - a.value)
    return { image: await barChart(d, true), caption: '📊 Peringkat' }
  } },
  grafikgaris: { desc: 'Grafik garis untuk tren/perubahan dari waktu ke waktu', usage: '<judul> | label=nilai, ...', example: 'Omzet | Jan=5jt, Feb=6,5jt, Mar=6jt', args: true, heavy: true, run: async (c) => ({ image: await lineChart(parseData(c.body)), caption: '📈 Grafik garis' }) },
  grafikkue: { desc: 'Diagram donat/kue dengan persentase tiap bagian', usage: '<judul> | label=nilai, ...', example: 'Pengeluaran | Makan=1jt, Transport=400rb, Hiburan=300rb', args: true, heavy: true, run: async (c) => ({ image: await pieChart(parseData(c.body)), caption: '🥧 Diagram donat' }) },
  tabel: { desc: 'Ubah data jadi gambar tabel rapi (baris pertama = header)', usage: '<judul> | kolom1, kolom2 | isi1, isi2 | ...', example: 'Nilai | Nama, Math, IPA | Andi, 90, 85 | Budi, 75, 80', args: true, heavy: true, run: async (c) => ({ image: await tableImage(kit.rest(c.body)), caption: '📋 Tabel' }) }
}
specs.grafik.help = HELP

const plugin = kit.multi({ name: 'chartkit', category: 'tools', emoji: '📊', desc: 'Grafik batang/garis/donat dan tabel jadi gambar', specs })
plugin.charts = { barChart, lineChart, pieChart }
module.exports = plugin
