// lib/anya_maker.js — penggambar kartu (chat palsu, tweet, komentar YT, code snapshot, layar telepon) memakai sharp + pango
'use strict'
const sharp = require('sharp')
const path = require('path')
const axios = require('axios')
const { userOf } = require('../utils')

const FD = path.join(__dirname, '..', '..', 'assets', 'fonts')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// teks pango (markup boleh) → PNG transparan
async function T(markup, { size = 32, color = '#ffffff', bold = false, width, align = 'left', spacing, raw = false } = {}) {
  const file = path.join(FD, bold ? 'Outfit-Bold.ttf' : 'Outfit-Regular.ttf')
  const body = raw ? markup : esc(markup)
  const o = { text: `<span foreground="${color}">${body}</span>`, font: `Outfit ${bold ? 'Bold' : 'Regular'} ${size}`, fontfile: file, rgba: true, align, wrap: 'word-char' }
  if (width) o.width = Math.round(width)
  if (spacing) o.spacing = spacing
  const buf = await sharp({ text: o }).png().toBuffer()
  const m = await sharp(buf).metadata()
  return { input: buf, w: m.width, h: m.height }
}
const svg = (w, h, inner) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`)
const rect = (x, y, w, h, r, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`

const PALETTE = ['#e17076', '#7bc862', '#e5ca77', '#65aadd', '#a695e7', '#ee7aae', '#6ec9cb', '#faa774']
const colorOf = (name) => PALETTE[[...String(name)].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length]

// avatar bulat 'size' px: dari URL profil bila ada, selain itu lingkaran berinisial
async function avatar(url, name, size) {
  if (url) {
    try {
      const r = await axios.get(url, { responseType: 'arraybuffer', timeout: 8000 })
      const mask = svg(size, size, `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>`)
      return await sharp(r.data).resize(size, size, { fit: 'cover' }).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
    } catch {}
  }
  const ini = (String(name).trim()[0] || '?').toUpperCase()
  const t = await T(ini, { size: Math.round(size * 0.5), bold: true, color: '#fff' })
  return sharp(svg(size, size, `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${colorOf(name)}"/>`)).composite([{ input: t.input, left: Math.round((size - t.w) / 2), top: Math.round((size - t.h) / 2) }]).png().toBuffer()
}

const clock = () => new Date(Date.now() + 7 * 3600000).toISOString().slice(11, 16)

// ---- qc: gelembung chat gaya Telegram/WA gelap (sticker-friendly, transparan) ----
async function qc({ name, text, avatarUrl, nameColor }) {
  const col = nameColor || colorOf(name)
  const W = 620; const pad = 28; const av = 84
  const nm = await T(name.slice(0, 28), { size: 30, bold: true, color: col })
  const body = await T(text.slice(0, 600), { size: 34, color: '#f1f1f1', width: W - av - pad * 3 - 20 })
  const tm = await T(clock(), { size: 22, color: '#8e9aa5' })
  const bw = Math.round(Math.max(nm.w, body.w, 160) + pad * 2); const bh = Math.round(nm.h + body.h + tm.h + pad * 1.6 + 14)
  const bx = av + 18
  const H = Math.max(bh, av) + 20
  const base = svg(bx + bw + 20, H, rect(bx, 10, bw, bh, 28, '#1f2c34') + `<path d="M${bx + 6} 12 L${bx - 14} 12 Q${bx} 22 ${bx - 4} 44 Z" fill="#1f2c34"/>`)
  const a = await avatar(avatarUrl, name, av)
  return sharp(base).composite([{ input: a, left: 4, top: 10 }, { input: nm.input, left: bx + pad, top: 10 + 18 }, { input: body.input, left: bx + pad, top: 10 + 18 + nm.h + 6 }, { input: tm.input, left: bx + bw - pad - tm.w, top: 10 + bh - tm.h - 10 }]).png().toBuffer()
}

// ---- iqc: iMessage di layar iPhone ----
async function iqc({ text, time = clock(), carrier = 'Telkomsel', battery = 78 }) {
  const W = 828
  const bub = await T(text.slice(0, 500), { size: 44, color: '#fff', width: 560 })
  const bw = bub.w + 64; const bh = bub.h + 48; const H = 300 + bh + 140
  const top = [await T(time, { size: 34, bold: true, color: '#000' }), await T(carrier, { size: 30, color: '#000' }), await T(`${battery}%`, { size: 28, color: '#000' })]
  const base = svg(W, H, `<rect width="${W}" height="${H}" fill="#fff"/>` + rect(0, 0, W, 190, 0, '#f6f6f6') + `<line x1="0" y1="190" x2="${W}" y2="190" stroke="#d9d9d9" stroke-width="2"/>`
    + `<circle cx="${W / 2}" cy="125" r="34" fill="#c7c7cc"/>` + rect(W - 140, 38, 70, 30, 8, 'none', 'stroke="#000" stroke-width="3"') + rect(W - 137, 41, Math.round(64 * battery / 100), 24, 5, '#000')
    + rect(70, 300, bw, bh, 40, '#0a84ff'))
  return sharp(base).composite([{ input: top[0].input, left: 56, top: 32 }, { input: top[1].input, left: 220, top: 36 }, { input: top[2].input, left: W - 215, top: 36 }, { input: bub.input, left: 70 + 32, top: 300 + 24 }]).png().toBuffer()
}

// ---- tweet ----
async function tweet({ name, user, text, avatarUrl, likes, rts }) {
  const W = 1000; const pad = 48
  const nm = await T(name.slice(0, 30), { size: 38, bold: true, color: '#0f1419' }); const us = await T(`@${user}`.slice(0, 30), { size: 32, color: '#536471' })
  const body = await T(text.slice(0, 280), { size: 46, color: '#0f1419', width: W - pad * 2 })
  const meta = await T(`${clock()} · ${new Date().toLocaleDateString('id-ID', { dateStyle: 'medium' })} · <b>${(likes * 37 + 1200).toLocaleString('id-ID')}</b> Tayangan`, { size: 28, color: '#536471', raw: true })
  const stat = await T(`<b>${rts.toLocaleString('id-ID')}</b> Repost    <b>${likes.toLocaleString('id-ID')}</b> Suka`, { size: 32, color: '#536471', raw: true })
  const H = pad + 90 + 24 + body.h + 36 + meta.h + 40 + stat.h + pad
  const a = await avatar(avatarUrl, name, 90)
  return sharp(svg(W, H, rect(0, 0, W, H, 36, '#fff') + `<line x1="${pad}" y1="${H - pad - stat.h - 22}" x2="${W - pad}" y2="${H - pad - stat.h - 22}" stroke="#eff3f4" stroke-width="2"/>`))
    .composite([{ input: a, left: pad, top: pad }, { input: nm.input, left: pad + 112, top: pad + 4 }, { input: us.input, left: pad + 112, top: pad + 50 }, { input: body.input, left: pad, top: pad + 90 + 24 }, { input: meta.input, left: pad, top: pad + 90 + 24 + body.h + 36 }, { input: stat.input, left: pad, top: H - pad - stat.h }]).png().toBuffer()
}

// ---- komentar YouTube ----
async function ytcomment({ name, text, avatarUrl, likes }) {
  const W = 1000; const pad = 40; const av = 96
  const nm = await T(`@${name.replace(/\s+/g, '').toLowerCase().slice(0, 24)}  <span foreground="#aaaaaa">· 2 jam lalu</span>`, { size: 30, bold: true, color: '#fff', raw: true })
  const body = await T(text.slice(0, 400), { size: 36, color: '#f1f1f1', width: W - av - pad * 3 })
  const act = await T(`👍 ${likes}     👎      Balas`, { size: 30, color: '#aaaaaa' })
  const H = pad * 2 + nm.h + 10 + body.h + 20 + act.h
  const a = await avatar(avatarUrl, name, av)
  return sharp(svg(W, H, rect(0, 0, W, H, 28, '#0f0f0f'))).composite([{ input: a, left: pad, top: pad }, { input: nm.input, left: pad + av + 24, top: pad }, { input: body.input, left: pad + av + 24, top: pad + nm.h + 10 }, { input: act.input, left: pad + av + 24, top: pad + nm.h + 10 + body.h + 20 }]).png().toBuffer()
}

// ---- code snapshot ----
const KW = /\b(const|let|var|function|return|if|else|for|while|class|new|import|from|export|async|await|def|print|try|catch|throw|true|false|null|None|self|this|in|of|switch|case|break|public|private|static|void|int|string|using|require)\b/g
function colorize(line) {
  let s = esc(line)
  s = s.replace(/(&quot;.*?&quot;|"[^"]*"|'[^']*'|`[^`]*`)/g, '\u0001$1\u0002').replace(/(\/\/.*$|#.*$)/, '\u0003$1\u0004')
  s = s.replace(KW, '<span foreground="#c678dd">$1</span>').replace(/\b(\d+(\.\d+)?)\b/g, '<span foreground="#d19a66">$1</span>')
  return s.replace(/\u0001/g, '<span foreground="#98c379">').replace(/\u0002|\u0004/g, '</span>').replace(/\u0003/g, '<span foreground="#7f848e">')
}
async function codesnap({ code, title = 'main.js' }) {
  const lines = code.replace(/\t/g, '  ').split('\n').slice(0, 40).map((l) => l.slice(0, 90))
  const W = 1100; const pad = 44; const fs = 30
  const nums = await T(lines.map((_, i) => i + 1).join('\n'), { size: fs, color: '#5c6370', align: 'right', spacing: 4 })
  const mk = lines.map((l) => (/<span/.test(colorize(l)) ? colorize(l) : colorize(l))).join('\n')
  const file = path.join(FD, 'Outfit-Regular.ttf')
  const code1 = await sharp({ text: { text: `<span foreground="#abb2bf">${mk}</span>`, font: `monospace ${fs - 4}`, rgba: true, spacing: 4 + 6 } }).png().toBuffer().catch(async () => (await T(mk, { size: fs, raw: true, color: '#abb2bf' })).input)
  void file
  const cm = await sharp(code1).metadata()
  const H = Math.max(cm.height, nums.h) + 120 + pad
  const bg = svg(W + 100, H + 100, rect(0, 0, W + 100, H + 100, 0, '#6d5ce7') + rect(50, 50, W, H, 24, '#282c34', 'filter="url(#s)"') + `<defs><filter id="s"><feDropShadow dx="0" dy="14" stdDeviation="18" flood-opacity=".4"/></filter></defs>`
    + ['#ff5f56', '#ffbd2e', '#27c93f'].map((c, i) => `<circle cx="${50 + 40 + i * 36}" cy="${50 + 38}" r="11" fill="${c}"/>`).join(''))
  const tt = await T(title.slice(0, 40), { size: 26, color: '#9da5b4' })
  return sharp(bg).composite([{ input: tt.input, left: 50 + Math.round((W - tt.w) / 2), top: 50 + 24 }, { input: nums.input, left: 50 + pad, top: 50 + 100 }, { input: code1, left: 50 + pad + nums.w + 30, top: 50 + 100 }]).png().toBuffer()
}

// ---- layar panggilan WhatsApp ----
async function wacall({ name, avatarUrl, mode = 'masuk' }) {
  const W = 828; const H = 1500
  const a = await avatar(avatarUrl, name, 300)
  const nm = await T(name.slice(0, 26), { size: 70, bold: true, color: '#fff', align: 'center', width: W - 100 })
  const st = await T(mode === 'masuk' ? 'Panggilan suara WhatsApp' : 'Memanggil…', { size: 38, color: '#b8c4cc', align: 'center', width: W - 100 })
  const b = (cx, col, label) => `<circle cx="${cx}" cy="1250" r="70" fill="${col}"/>` + label
  const base = svg(W, H, `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f3b3a"/><stop offset="1" stop-color="#0b141a"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/>` + (mode === 'masuk' ? b(210, '#e53935', '') + b(618, '#25d366', '') : b(414, '#e53935', '')))
  const l1 = await T(mode === 'masuk' ? 'Tolak' : 'Akhiri', { size: 30, color: '#fff' }); const l2 = await T('Terima', { size: 30, color: '#fff' })
  const comps = [{ input: a, left: (W - 300) / 2, top: 300 }, { input: nm.input, left: Math.round((W - nm.w) / 2), top: 650 }, { input: st.input, left: Math.round((W - st.w) / 2), top: 750 }]
  if (mode === 'masuk') comps.push({ input: l1.input, left: 210 - Math.round(l1.w / 2), top: 1340 }, { input: l2.input, left: 618 - Math.round(l2.w / 2), top: 1340 })
  else comps.push({ input: l1.input, left: 414 - Math.round(l1.w / 2), top: 1340 })
  return sharp(base).composite(comps).png().toBuffer()
}

const toSticker = (png) => sharp(png).resize(512, 512, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 90 }).toBuffer()
module.exports = { T, svg, avatar, qc, iqc, tweet, ytcomment, codesnap, wacall, toSticker, clock, userOf }
