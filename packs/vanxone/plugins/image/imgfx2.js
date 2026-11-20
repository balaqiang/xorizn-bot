// Efek gambar gelombang 2: halftone, VHS, bloom, tilt-shift, lomo, cyberpunk, termal, X-ray, lukisan minyak,
// kaleidoskop, pusaran/cembung/riak, pixel art, neon edge, sensor, meme, dan pembaca/penghapus EXIF
const kit = require('../../lib/kit')
const io = require('../../lib/imgops')
const sharp = require('sharp')
const { panel } = require('../../lib/uitext')

const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })
const S = () => sharp
const prep = async (b, max = 1400) => {
  const buf = await sharp(b, { failOn: 'none' }).rotate().resize(max, max, { fit: 'inside', withoutEnlargement: true }).removeAlpha().toBuffer()
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
  return { buf, data, w: info.width, h: info.height }
}
const raw = (data, w, h, ch = 3) => sharp(data, { raw: { width: w, height: h, channels: ch } })
const jpg = (s, q = 92) => s.jpeg({ quality: q }).toBuffer()

// peta warna dari gradasi (LUT 256)
function lut(stops) {
  const out = new Uint8Array(256 * 3)
  for (let i = 0; i < 256; i++) {
    const t = (i / 255) * (stops.length - 1)
    const a = Math.min(stops.length - 2, Math.floor(t))
    const f = t - a
    for (let c = 0; c < 3; c++) out[i * 3 + c] = stops[a][c] + (stops[a + 1][c] - stops[a][c]) * f
  }
  return out
}
async function gradientMap(b, stops, mix = 1) {
  const { buf, data, w, h } = await prep(b)
  const L = lut(stops)
  const out = Buffer.alloc(w * h * 3)
  for (let i = 0; i < w * h; i++) {
    const g = Math.round(0.299 * data[i * 3] + 0.587 * data[i * 3 + 1] + 0.114 * data[i * 3 + 2])
    for (let c = 0; c < 3; c++) out[i * 3 + c] = L[g * 3 + c] * mix + data[i * 3 + c] * (1 - mix)
  }
  void buf
  return jpg(raw(out, w, h))
}

// pemetaan ulang piksel dengan interpolasi bilinear
async function warp(b, fn) {
  const { data, w, h } = await prep(b, 1100)
  const out = Buffer.alloc(w * h * 3)
  const cx = w / 2
  const cy = h / 2
  const R = Math.min(w, h) / 2
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const [sx, sy] = fn(x, y, cx, cy, R)
    const x0 = Math.max(0, Math.min(w - 2, Math.floor(sx)))
    const y0 = Math.max(0, Math.min(h - 2, Math.floor(sy)))
    const fx = Math.max(0, Math.min(1, sx - x0))
    const fy = Math.max(0, Math.min(1, sy - y0))
    for (let c = 0; c < 3; c++) {
      const p = (xx, yy) => data[(yy * w + xx) * 3 + c]
      out[(y * w + x) * 3 + c] = p(x0, y0) * (1 - fx) * (1 - fy) + p(x0 + 1, y0) * fx * (1 - fy) + p(x0, y0 + 1) * (1 - fx) * fy + p(x0 + 1, y0 + 1) * fx * fy
    }
  }
  return jpg(raw(out, w, h))
}

const FX = {
  halftone: async (b) => {
    const { data, w, h } = await prep(b, 1200)
    const cell = Math.max(9, Math.round(Math.min(w, h) / 70))
    const cols = Math.floor(w / cell)
    const rows = Math.floor(h / cell)
    let dots = ''
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      let R = 0; let G = 0; let B = 0; let n = 0
      for (let y = r * cell; y < (r + 1) * cell; y += 2) for (let x = c * cell; x < (c + 1) * cell; x += 2) { const i = (y * w + x) * 3; R += data[i]; G += data[i + 1]; B += data[i + 2]; n++ }
      R /= n; G /= n; B /= n
      const l = (0.299 * R + 0.587 * G + 0.114 * B) / 255
      const rad = cell * 0.62 * Math.sqrt(1 - l * 0.92)
      dots += `<circle cx="${c * cell + cell / 2}" cy="${r * cell + cell / 2}" r="${rad.toFixed(1)}" fill="rgb(${Math.min(255, R * 1.15) | 0},${Math.min(255, G * 1.15) | 0},${Math.min(255, B * 1.15) | 0})"/>`
    }
    return jpg(sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cols * cell}" height="${rows * cell}"><rect width="100%" height="100%" fill="#fbf7ee"/>${dots}</svg>`)))
  },
  vhs: async (b) => {
    const { data, w, h } = await prep(b, 1100)
    const out = Buffer.alloc(w * h * 3)
    const sh = Math.round(w * 0.008)
    for (let y = 0; y < h; y++) {
      const jitter = Math.sin(y * 0.05) * 1.5 + (y % 97 < 3 ? 14 : 0)
      for (let x = 0; x < w; x++) {
        const xr = Math.min(w - 1, Math.max(0, Math.round(x + sh + jitter)))
        const xb = Math.min(w - 1, Math.max(0, Math.round(x - sh + jitter)))
        const xg = Math.min(w - 1, Math.max(0, Math.round(x + jitter)))
        const i = (y * w + x) * 3
        const noise = (Math.random() - 0.5) * 34
        const scan = y % 4 < 2 ? 0.86 : 1
        out[i] = Math.max(0, Math.min(255, data[(y * w + xr) * 3] * scan + noise))
        out[i + 1] = Math.max(0, Math.min(255, data[(y * w + xg) * 3 + 1] * scan + noise))
        out[i + 2] = Math.max(0, Math.min(255, data[(y * w + xb) * 3 + 2] * scan + noise))
      }
    }
    const base = await raw(out, w, h).blur(0.7).modulate({ saturation: 1.3 }).png().toBuffer()
    const play = await io.textPng('▶ PLAY', { size: Math.round(w * 0.045), color: '#ffffff', align: 'left' })
    const t = await io.textPng(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase().replace(/ /g, ' '), { size: Math.round(w * 0.04), color: '#ffe66d', align: 'right', width: Math.round(w * 0.4) })
    const tm = await io.meta(t)
    return jpg(sharp(base).composite([{ input: play, left: Math.round(w * 0.04), top: Math.round(h * 0.06) }, { input: t, left: w - tm.w - Math.round(w * 0.04), top: h - tm.h - Math.round(h * 0.06) }]))
  },
  glow: async (b) => {
    const { buf, w, h } = await prep(b)
    const bright = await sharp(buf).linear(1.5, -70).blur(Math.max(8, w / 55)).modulate({ saturation: 1.4 }).toBuffer()
    return jpg(sharp(buf).composite([{ input: bright, blend: 'screen' }]).modulate({ saturation: 1.1 }).withMetadata({}), 93)
  },
  tiltshift: async (b) => {
    const { buf, w, h } = await prep(b)
    const blurred = await sharp(buf).blur(Math.max(6, w / 90)).toBuffer()
    const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="0.3" stop-color="#fff"/><stop offset="0.46" stop-color="#000"/><stop offset="0.6" stop-color="#000"/><stop offset="0.78" stop-color="#fff"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`)
    const m = await sharp(mask).greyscale().toColourspace('b-w').extractChannel(0).toBuffer()
    const withAlpha = await sharp(blurred).joinChannel(await sharp(m).raw().toBuffer(), { raw: { width: w, height: h, channels: 1 } }).png().toBuffer()
    return jpg(sharp(buf).composite([{ input: withAlpha }]).modulate({ saturation: 1.35, brightness: 1.03 }).linear(1.08, -4), 93)
  },
  lomo: async (b) => {
    const { buf, w, h } = await prep(b)
    const vig = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><radialGradient id="v" cx="0.5" cy="0.5" r="0.75"><stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.78"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#v)"/></svg>`)
    const crossed = await sharp(buf).recomb([[1.1, 0.05, -0.05], [0, 1.0, 0.05], [-0.05, 0.1, 0.95]]).linear([1.18, 1.05, 0.92], [-8, -2, 12]).modulate({ saturation: 1.45 }).toBuffer()
    return jpg(sharp(crossed).composite([{ input: vig }]), 92)
  },
  cyberpunk: (b) => gradientMap(b, [[8, 0, 40], [60, 0, 120], [255, 40, 190], [0, 230, 255], [255, 255, 255]], 0.88),
  termal: (b) => gradientMap(b, [[0, 0, 20], [30, 0, 140], [170, 0, 150], [240, 40, 40], [255, 170, 0], [255, 255, 80], [255, 255, 255]], 1),
  xray: async (b) => {
    const { buf, w, h } = await prep(b)
    const g = await sharp(buf).grayscale().negate().normalise().linear(1.25, -25).sharpen({ sigma: 1.4 }).toColourspace('srgb').png().toBuffer()
    const blue = await sharp({ create: { width: w, height: h, channels: 3, background: '#7fc4ff' } }).png().toBuffer()
    return jpg(sharp(g).removeAlpha().composite([{ input: blue, blend: 'multiply' }]).linear(1.25, 6), 92)
  },
  oilpaint: async (b) => {
    const { buf } = await prep(b, 1200)
    return jpg(sharp(buf).median(9).median(7).modulate({ saturation: 1.35 }).sharpen({ sigma: 1.2, m1: 0.6, m2: 1.5 }), 93)
  },
  kaleidoskop: async (b) => {
    const { buf, w, h } = await prep(b, 1000)
    const s = Math.min(w, h)
    const q = Math.floor(s / 2)
    const part = await sharp(buf).extract({ left: Math.floor((w - s) / 2) + Math.floor(s * 0.12), top: Math.floor((h - s) / 2) + Math.floor(s * 0.12), width: q, height: q }).toBuffer()
    const fx = await sharp(part).flop().toBuffer()
    const fy = await sharp(part).flip().toBuffer()
    const fxy = await sharp(part).flip().flop().toBuffer()
    return jpg(sharp({ create: { width: q * 2, height: q * 2, channels: 3, background: '#000' } }).composite([{ input: part, left: 0, top: 0 }, { input: fx, left: q, top: 0 }, { input: fy, left: 0, top: q }, { input: fxy, left: q, top: q }]), 93)
  },
  pusaran: (b) => warp(b, (x, y, cx, cy, R) => {
    const dx = x - cx
    const dy = y - cy
    const d = Math.hypot(dx, dy)
    if (d >= R) return [x, y]
    const a = Math.atan2(dy, dx) + ((R - d) / R) ** 2 * 4.2
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)]
  }),
  cembung: (b) => warp(b, (x, y, cx, cy, R) => {
    const dx = x - cx
    const dy = y - cy
    const d = Math.hypot(dx, dy)
    if (d >= R * 0.95) return [x, y]
    const f = Math.pow(d / (R * 0.95), 1.7)
    return [cx + dx * (0.35 + 0.65 * f), cy + dy * (0.35 + 0.65 * f)]
  }),
  riak: (b) => warp(b, (x, y) => [x + Math.sin(y / 22) * 9, y + Math.sin(x / 22) * 9]),
  pixelart: async (b) => {
    const { buf, w, h } = await prep(b, 1200)
    const tw = 72
    const th = Math.max(8, Math.round((h / w) * tw))
    const small = await sharp(buf).resize(tw, th, { kernel: 'lanczos3' }).modulate({ saturation: 1.3 }).png({ palette: true, colours: 20, dither: 0 }).toBuffer()
    return sharp(small).resize(tw * 14, th * 14, { kernel: 'nearest' }).png().toBuffer()
  },
  neonedge: async (b) => {
    const { buf, w, h } = await prep(b, 1300)
    const e = await sharp(buf).grayscale().blur(1).convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] }).linear(3, 0).toBuffer()
    const colored = await sharp(e).tint({ r: 0, g: 255, b: 220 }).toBuffer()
    const glow = await sharp(colored).blur(8).modulate({ brightness: 1.4 }).toBuffer()
    return jpg(sharp({ create: { width: w, height: h, channels: 3, background: '#05040f' } }).composite([{ input: glow, blend: 'screen' }, { input: colored, blend: 'screen' }]), 92)
  }
}

// ---------- sensor ----------
const AREAS = { tengah: [0.25, 0.25, 0.5, 0.5], atas: [0, 0, 1, 0.3], bawah: [0, 0.7, 1, 0.3], kiri: [0, 0, 0.35, 1], kanan: [0.65, 0, 0.35, 1], mata: [0.1, 0.2, 0.8, 0.2], semua: [0, 0, 1, 1] }
async function censor(b, area, strong) {
  const { buf, w, h } = await prep(b, 2000)
  const [fx, fy, fw, fh] = AREAS[area]
  const left = Math.round(fx * w)
  const top = Math.round(fy * h)
  const cw = Math.max(2, Math.round(fw * w))
  const ch = Math.max(2, Math.round(fh * h))
  const px = Math.max(8, Math.round(Math.min(cw, ch) / (strong ? 6 : 12)))
  const piece = await sharp(buf).extract({ left, top, width: cw, height: ch }).resize(Math.max(1, Math.round(cw / px)), Math.max(1, Math.round(ch / px)), { kernel: 'nearest' }).resize(cw, ch, { kernel: 'nearest' }).toBuffer()
  return jpg(sharp(buf).composite([{ input: piece, left, top }]), 93)
}

// ---------- meme ----------
async function meme(b, top, bottom) {
  const { buf, w, h } = await prep(b, 1400)
  const comps = []
  const make = async (text, pos) => {
    if (!text) return
    const t = text.toUpperCase()
    const tw = Math.round(w * 0.92)
    const th = Math.round(h * 0.3)
    const fill = await io.textFit(t, tw, th, { maxSize: Math.round(w * 0.12), color: '#ffffff' })
    const dark = await io.textFit(t, tw, th, { maxSize: Math.round(w * 0.12), color: '#000000' })
    const m = await io.meta(fill)
    const x = Math.round((w - m.w) / 2)
    const y = pos === 'top' ? Math.round(h * 0.03) : h - m.h - Math.round(h * 0.03)
    const r = Math.max(2, Math.round(m.h / 28))
    for (let a = 0; a < 16; a++) comps.push({ input: dark, left: Math.max(0, x + Math.round(Math.cos((a * Math.PI) / 8) * r)), top: Math.max(0, y + Math.round(Math.sin((a * Math.PI) / 8) * r)) })
    comps.push({ input: fill, left: x, top: y })
  }
  await make(top, 'top')
  await make(bottom, 'bottom')
  return jpg(sharp(buf).composite(comps), 93)
}

// ---------- EXIF (pembaca mini TIFF) ----------
function readExif(buf) {
  if (!buf || buf.length < 14) return null
  const t = buf.subarray(buf.slice(0, 6).toString('latin1') === 'Exif\0\0' ? 6 : 0)
  const le = t.toString('latin1', 0, 2) === 'II'
  const u16 = (o) => (le ? t.readUInt16LE(o) : t.readUInt16BE(o))
  const u32 = (o) => (le ? t.readUInt32LE(o) : t.readUInt32BE(o))
  const SZ = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8, 11: 4, 12: 8 }
  const val = (type, count, off) => {
    const size = (SZ[type] || 1) * count
    const o = size <= 4 ? off : u32(off)
    if (o + size > t.length) return null
    if (type === 2) return t.toString('latin1', o, o + count).replace(/\0.*$/, '').trim()
    const nums = []
    for (let i = 0; i < count && i < 8; i++) {
      if (type === 3) nums.push(u16(o + i * 2))
      else if (type === 4) nums.push(u32(o + i * 4))
      else if (type === 5) { const d = u32(o + i * 8 + 4); nums.push(d ? u32(o + i * 8) / d : 0) } else if (type === 1) nums.push(t[o + i])
      else if (type === 11) nums.push(le ? t.readFloatLE(o + i * 4) : t.readFloatBE(o + i * 4))
      else if (type === 12) nums.push(le ? t.readDoubleLE(o + i * 8) : t.readDoubleBE(o + i * 8))
    }
    return count === 1 || nums.length === 1 ? nums[0] : nums
  }
  const ifd = (o) => {
    const res = {}
    if (!o || o + 2 > t.length) return res
    const n = u16(o)
    for (let i = 0; i < n && i < 200; i++) {
      const e = o + 2 + i * 12
      if (e + 12 > t.length) break
      res[u16(e)] = { type: u16(e + 2), count: u32(e + 4), off: e + 8 }
    }
    return res
  }
  const get = (d, tag) => (d[tag] ? val(d[tag].type, d[tag].count, d[tag].off) : null)
  const i0 = ifd(u32(4))
  const ex = i0[0x8769] ? ifd(u32(i0[0x8769].off)) : {}
  const gp = i0[0x8825] ? ifd(u32(i0[0x8825].off)) : {}
  const deg = (a, ref) => (Array.isArray(a) && a.length === 3 ? (a[0] + a[1] / 60 + a[2] / 3600) * (/[SW]/.test(ref) ? -1 : 1) : null)
  const lat = deg(get(gp, 2), get(gp, 1))
  const lon = deg(get(gp, 4), get(gp, 3))
  return { make: get(i0, 0x010f), model: get(i0, 0x0110), software: get(i0, 0x0131), date: get(ex, 0x9003) || get(i0, 0x0132), exposure: get(ex, 0x829a), fnum: get(ex, 0x829d), iso: get(ex, 0x8827), focal: get(ex, 0x920a), orientation: get(i0, 0x0112), lat, lon, hasGps: lat != null && lon != null }
}

const wrapImg = (fn, caption) => async (c, m) => ({ image: await fn(m.buffer, c), caption })
const fxSpec = (key, desc, caption) => ({ desc, needs: 'image', heavy: true, run: wrapImg(FX[key], caption) })

const specs = {
  halftone: fxSpec('halftone', 'Gaya pop-art titik halftone berwarna', '🔴 Halftone'),
  vhs: fxSpec('vhs', 'Efek kaset VHS jadul (glitch warna, garis scan, noise)', '📼 VHS'),
  glow: fxSpec('glow', 'Efek bloom/cahaya lembut ala foto mimpi', '✨ Glow'),
  tiltshift: fxSpec('tiltshift', 'Tilt-shift: foto tampak seperti miniatur', '🏙️ Tilt-shift'),
  lomo: fxSpec('lomo', 'Gaya kamera Lomo: warna kontras, vignette gelap', '📷 Lomo'),
  cyberpunk: fxSpec('cyberpunk', 'Warna neon cyberpunk ungu-pink-cyan', '🌆 Cyberpunk'),
  termal: fxSpec('termal', 'Efek kamera termal (peta panas)', '🌡️ Termal'),
  xray: fxSpec('xray', 'Efek rontgen/X-ray biru', '🩻 X-Ray'),
  oilpaint: fxSpec('oilpaint', 'Efek lukisan cat minyak', '🖌️ Lukisan minyak'),
  kaleidoskop: fxSpec('kaleidoskop', 'Pola kaleidoskop simetris 4 arah', '🔮 Kaleidoskop'),
  pusaran: fxSpec('pusaran', 'Distorsi pusaran di tengah gambar', '🌀 Pusaran'),
  cembung: fxSpec('cembung', 'Distorsi cembung (lensa mata ikan) di tengah', '🔍 Cembung'),
  riak: fxSpec('riak', 'Distorsi riak air', '🌊 Riak'),
  pixelart: fxSpec('pixelart', 'Ubah foto jadi pixel art 20 warna', '👾 Pixel art'),
  neonedge: fxSpec('neonedge', 'Garis tepi bercahaya neon di latar gelap', '💡 Neon edge'),
  sensor: { desc: `Sensor/mosaik bagian gambar: ${Object.keys(AREAS).join(', ')}`, usage: '<area> [kuat]', example: 'mata kuat', needs: 'image', heavy: true, run: async (c, m) => {
    const a = (c.args[0] || 'tengah').toLowerCase()
    if (!AREAS[a]) throw bad(`Area tersedia: ${Object.keys(AREAS).join(', ')}\nContoh: ${c.prefix}sensor mata`)
    return { image: await censor(m.buffer, a, /kuat/i.test(c.args[1] || '')), caption: `🟦 Area "${a}" disensor` }
  } },
  meme: { desc: 'Buat meme gambar teks putih tebal berbingkai hitam (atas | bawah)', usage: '<teks atas> | <teks bawah>', example: 'Pas liat gaji | Tapi tanggal tua', needs: 'image', args: true, heavy: true, run: async (c, m) => {
    const [top, bottom = ''] = kit.rest(c.body).split('|').map((s) => s.trim())
    if (!top && !bottom) throw bad('Tulis teks memenya.')
    return { image: await meme(m.buffer, top.slice(0, 80), bottom.slice(0, 80)), caption: '😂 Meme jadi' }
  } },
  exif: { desc: 'Lihat metadata foto: kamera, waktu, pengaturan, dan lokasi GPS (kirim sebagai dokumen agar EXIF utuh)', needs: 'image', run: async (c, m) => {
    const meta = await sharp(m.buffer, { failOn: 'none' }).metadata()
    const e = meta.exif ? readExif(meta.exif) : null
    const base = [`Ukuran : ${meta.width} × ${meta.height} px`, `Format : ${String(meta.format).toUpperCase()}`]
    if (!e || (!e.make && !e.model && !e.date && !e.hasGps)) return panel('METADATA FOTO', [{ head: '🖼️ *GAMBAR*', lines: base }, { head: 'ℹ️ *EXIF*', lines: ['Tidak ada EXIF. WhatsApp biasanya menghapusnya dari foto biasa. Kirim sebagai *Dokumen* agar metadata utuh.'], plain: true }])
    const cam = [e.make && `Merek : ${e.make}`, e.model && `Model : ${e.model}`, e.software && `Software : ${e.software}`].filter(Boolean)
    const set = [e.date && `Waktu : ${e.date}`, e.exposure && `Rana : ${e.exposure < 1 ? `1/${Math.round(1 / e.exposure)}` : e.exposure}s`, e.fnum && `Bukaan : f/${e.fnum.toFixed(1)}`, e.iso && `ISO : ${Array.isArray(e.iso) ? e.iso[0] : e.iso}`, e.focal && `Fokus : ${e.focal.toFixed(1)} mm`].filter(Boolean)
    const sections = [{ head: '🖼️ *GAMBAR*', lines: base }, { head: '📷 *KAMERA*', lines: cam }, { head: '⚙️ *PENGATURAN*', lines: set }]
    if (e.hasGps) sections.push({ head: '📍 *LOKASI GPS*', lines: [`Koordinat : ${e.lat.toFixed(6)}, ${e.lon.toFixed(6)}`, `Peta : https://maps.google.com/?q=${e.lat.toFixed(6)},${e.lon.toFixed(6)}`, '⚠️ Foto ini membawa lokasi. Hapus dulu dengan .hapusexif sebelum dibagikan.'] })
    return panel('METADATA FOTO', sections)
  } },
  hapusexif: { desc: 'Hapus semua metadata (lokasi GPS, kamera, waktu) dari foto demi privasi', needs: 'image', heavy: true, run: async (c, m) => {
    const meta = await sharp(m.buffer, { failOn: 'none' }).metadata()
    const e = meta.exif ? readExif(meta.exif) : null
    const out = await sharp(m.buffer, { failOn: 'none' }).rotate().jpeg({ quality: 95, mozjpeg: true }).toBuffer()
    return { document: out, mimetype: 'image/jpeg', fileName: `bersih-${Date.now().toString(36)}.jpg`, caption: `🧼 Metadata dihapus${e?.hasGps ? ' (termasuk lokasi GPS)' : meta.exif ? '' : ' (foto ini memang tanpa EXIF)'}.\nAman dibagikan.` }
  } }
}
void S

module.exports = kit.multi({ name: 'imgfx2', category: 'image', emoji: '🪄', desc: 'Efek gambar: halftone, VHS, glow, termal, pusaran, pixel art, meme, sensor, EXIF', specs })
