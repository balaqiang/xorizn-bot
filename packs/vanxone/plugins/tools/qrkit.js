// QR Code: teks/link, WiFi, WhatsApp, kontak (vCard), gaya bulat & berwarna, dan baca QR dari gambar
const kit = require('../../lib/kit')
const qr = require('../../lib/qr')
const io = require('../../lib/imgops')
const sharp = require('sharp')
const { getQuotedText } = require('../../lib/utils')

const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })

// gambar QR berbingkai kartu + keterangan
async function qrCard(text, { dots = false, fg = '#111111', bg = '#ffffff', title = 'SCAN ME', sub = '' } = {}) {
  const q = qr.encode(text)
  const n = q.size
  const unit = Math.max(6, Math.floor(900 / n))
  const S = n * unit
  const pad = unit * 4
  const W = S + pad * 2
  const isFinder = (x, y) => (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8)
  let shapes = ''
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (!q.modules[y][x] || (dots && isFinder(x, y))) continue
    const px = pad + x * unit
    const py = pad + y * unit
    shapes += dots ? `<circle cx="${px + unit / 2}" cy="${py + unit / 2}" r="${unit * 0.47}"/>` : `<rect x="${px}" y="${py}" width="${unit + 0.5}" height="${unit + 0.5}"/>`
  }
  if (dots) {
    for (const [fx, fy] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
      const px = pad + fx * unit
      const py = pad + fy * unit
      shapes += `<rect x="${px}" y="${py}" width="${unit * 7}" height="${unit * 7}" rx="${unit * 0.8}" fill="${fg}"/><rect x="${px + unit}" y="${py + unit}" width="${unit * 5}" height="${unit * 5}" rx="${unit * 0.4}" fill="${bg}"/><rect x="${px + unit * 2}" y="${py + unit * 2}" width="${unit * 3}" height="${unit * 3}" rx="${unit * 0.5}" fill="${fg}"/>`
    }
  }
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}"><rect width="${W}" height="${W}" fill="${bg}"/><g fill="${fg}">${shapes}</g></svg>`)
  const code = await sharp(svg).png().toBuffer()
  // kartu
  const CW = 1080
  const qrW = 800
  const codeR = await sharp(code).resize(qrW, qrW, { kernel: 'nearest' }).png().toBuffer()
  const head = await io.textFit(title, 840, 110, { maxSize: 78, color: '#ffffff' })
  const hm = await io.meta(head)
  const parts = []
  let sub1 = null
  if (sub) sub1 = await io.textFit(sub, 880, 130, { maxSize: 36, bold: false, color: '#ffffff', alpha: 92 })
  const sm = sub1 ? await io.meta(sub1) : { h: 0 }
  const CH = 150 + qrW + 90 + 60 + (sub1 ? sm.h + 40 : 0) + 60
  const frame = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="${CH}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1f2a44"/><stop offset="1" stop-color="#4b3a8f"/></linearGradient></defs><rect width="${CW}" height="${CH}" fill="url(#g)"/><rect x="${(CW - qrW) / 2 - 22}" y="${150 - 22}" width="${qrW + 44}" height="${qrW + 44}" rx="38" fill="#ffffff"/></svg>`)
  parts.push({ input: head, left: Math.round((CW - hm.w) / 2), top: Math.round(25 + (100 - hm.h) / 2) })
  parts.push({ input: codeR, left: (CW - qrW) / 2, top: 150 })
  if (sub1) parts.push({ input: sub1, left: Math.round((CW - (await io.meta(sub1)).w) / 2), top: 150 + qrW + 70 })
  return sharp(frame).composite(parts).png().toBuffer()
}

const text = (c) => kit.rest(c.body).trim() || getQuotedText(c.msg) || ''
const clip = (t) => String(t).slice(0, 1800)

const specs = {
  qr: { desc: 'Buat QR Code dari teks atau link (bisa juga reply teks)', usage: '<teks/link>', example: 'https://example.com', optional: true, args: true, heavy: true, run: async (c) => {
    const t = text(c)
    if (!t) throw bad('Tulis teks/link-nya, atau reply pesan teks dengan .qr')
    return { image: await qrCard(clip(t), { sub: t.length > 80 ? `${t.slice(0, 77)}…` : t }), caption: `✅ QR Code siap (${t.length} karakter)\nGaya bulat: .qrbulat • warna: .qrwarna` }
  } },
  qrbulat: { desc: 'QR Code gaya titik bulat yang lebih manis', usage: '<teks/link>', example: 'https://example.com', optional: true, args: true, heavy: true, run: async (c) => {
    const t = text(c)
    if (!t) throw bad('Tulis teks/link-nya.')
    return { image: await qrCard(clip(t), { dots: true, fg: '#2b1b6b', sub: t.length > 80 ? `${t.slice(0, 77)}…` : t }), caption: '✅ QR Code gaya bulat' }
  } },
  qrwarna: { desc: 'QR Code dengan warna sendiri (titik & latar)', usage: '<warna titik> <warna latar> <teks>', example: 'biru putih https://example.com', args: true, heavy: true, run: async (c) => {
    const fg = io.parseColor(c.args[0])
    const bg = io.parseColor(c.args[1])
    if (!fg || !bg) throw bad('Warna tidak dikenali. Contoh: .qrwarna hijau putih halo')
    const t = c.args.slice(2).join(' ') || getQuotedText(c.msg)
    if (!t) throw bad('Tulis teks/link-nya setelah dua warna.')
    return { image: await qrCard(clip(t), { dots: true, fg, bg }), caption: `✅ QR ${fg} di atas ${bg}\nTips: pastikan kontras tinggi agar mudah dipindai.` }
  } },
  qrwifi: { desc: 'QR untuk masuk WiFi otomatis — tinggal scan, tanpa ketik sandi', usage: '<nama wifi> | <sandi> [| WPA/WEP/kosong]', example: 'Rumah Budi | rahasia123', args: true, heavy: true, run: async (c) => {
    const [ssid, pass = '', type = 'WPA'] = kit.rest(c.body).split('|').map((s) => s.trim())
    if (!ssid) throw bad('Tulis nama WiFi.')
    const esc = (s) => s.replace(/([\;,:"])/g, '\\$1')
    const T = /^(nopass|kosong|terbuka|-)$/i.test(type) || !pass ? 'nopass' : /wep/i.test(type) ? 'WEP' : 'WPA'
    const payload = `WIFI:T:${T};S:${esc(ssid)};${T === 'nopass' ? '' : `P:${esc(pass)};`};`
    return { image: await qrCard(payload, { dots: true, fg: '#0b3d63', title: 'SCAN UNTUK WIFI', sub: `${ssid}${T === 'nopass' ? ' • terbuka' : ''}` }), caption: `📶 *${ssid}*\nSandi: ${pass || '-'}\nScan dengan kamera HP (Android/iPhone) untuk tersambung.` }
  } },
  qrwa: { desc: 'QR langsung ke chat WhatsApp nomor tertentu (bisa dengan pesan awal)', usage: '<nomor> [| pesan]', example: '081234567890 | Halo kak, mau tanya', args: true, heavy: true, run: async (c) => {
    const [num, msg = ''] = kit.rest(c.body).split('|').map((s) => s.trim())
    let n = num.replace(/\D/g, '')
    if (n.startsWith('0')) n = `62${n.slice(1)}`
    if (n.length < 9 || n.length > 15) throw bad('Nomor tidak valid. Contoh: 081234567890 atau 6281234567890')
    const url = `https://wa.me/${n}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`
    return { image: await qrCard(url, { dots: true, fg: '#0b6b3a', title: 'CHAT VIA WHATSAPP', sub: `+${n}${msg ? ` • “${msg.slice(0, 60)}”` : ''}` }), caption: `💬 ${url}` }
  } },
  qrvcard: { desc: 'QR kontak (vCard): scan lalu langsung tersimpan di HP', usage: '<nama> | <telepon> [| email] [| perusahaan]', example: 'Budi Santoso | 081234567890 | budi@mail.com | PT Maju', args: true, heavy: true, run: async (c) => {
    const [name, tel, email = '', org = ''] = kit.rest(c.body).split('|').map((s) => s.trim())
    if (!name || !tel) throw bad('Minimal isi nama dan telepon.')
    let n = tel.replace(/[^\d+]/g, '')
    if (n.startsWith('0')) n = `+62${n.slice(1)}`
    const v = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${name}`, `N:${name};;;;`, org && `ORG:${org}`, `TEL;TYPE=CELL:${n}`, email && `EMAIL:${email}`, 'END:VCARD'].filter(Boolean).join('\n')
    return { image: await qrCard(v, { dots: true, fg: '#4a1d6b', title: 'SIMPAN KONTAK', sub: `${name} • ${n}` }), caption: `👤 Kontak ${name} siap discan.` }
  } },
  scanqr: { desc: 'Baca isi QR Code dari gambar', needs: 'image', heavy: true, run: async (c, m) => {
    let jsQR
    try { jsQR = require('jsqr') } catch { throw bad('Fitur baca QR butuh paket jsqr di server: npm install jsqr') }
    const base = await sharp(m.buffer, { failOn: 'none' }).rotate().flatten({ background: '#ffffff' }).toBuffer()
    for (const w of [1200, 800, 1800, 500]) {
      const { data, info } = await sharp(base).resize(w, w, { fit: 'inside', withoutEnlargement: false }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
      const r = jsQR(new Uint8ClampedArray(data), info.width, info.height)
      if (r && r.data) {
        const d = r.data
        const kind = /^https?:\/\//i.test(d) ? '🔗 Link' : /^WIFI:/i.test(d) ? '📶 WiFi' : /^BEGIN:VCARD/i.test(d) ? '👤 Kontak' : /^(mailto:|MATMSG)/i.test(d) ? '✉️ Email' : /^tel:/i.test(d) ? '📞 Telepon' : '📝 Teks'
        return `✅ *QR TERBACA*\n${kind}\n\n${d.slice(0, 1500)}`
      }
    }
    throw bad('QR tidak terbaca. Pastikan gambar jelas dan QR tidak terpotong.')
  } }
}

module.exports = kit.multi({ name: 'qrkit', category: 'tools', emoji: '🔳', desc: 'QR Code: teks, WiFi, WhatsApp, kontak, gaya bulat/warna, baca QR', specs, alias: { qrcode: 'qr' } })
