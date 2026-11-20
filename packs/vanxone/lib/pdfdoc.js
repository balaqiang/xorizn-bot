// lib/pdfdoc.js — penulis dokumen PDF sederhana (pdf-lib): teks berbungkus, perataan, tabel, ganti halaman otomatis
'use strict'

const MAP = { '“': '"', '”': '"', '‘': "'", '’': "'", '–': '-', '—': '-', '…': '...', '•': '-', '×': 'x', '→': '->', '₹': 'Rp', ' ': ' ' }
// huruf standar PDF hanya mendukung Latin-1: ganti karakter lain agar tidak error
const safe = (t) => String(t ?? '').replace(/[“”‘’–—…•×→ ]/g, (c) => MAP[c]).replace(/[^\x09\x0a\x20-\x7e\xa0-\xff]/g, '')

async function create() {
  const { PDFDocument, StandardFonts, rgb } = require('pdf-lib')
  const doc = await PDFDocument.create()
  const F = { r: await doc.embedFont(StandardFonts.Helvetica), b: await doc.embedFont(StandardFonts.HelveticaBold), i: await doc.embedFont(StandardFonts.HelveticaOblique), bi: await doc.embedFont(StandardFonts.HelveticaBoldOblique) }
  return { doc, F, rgb }
}
const hex = (rgb, h) => { const n = parseInt(h.replace('#', ''), 16); return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255) }

function wrap(font, size, maxW, text) {
  const lines = []
  for (const para of safe(text).split('\n')) {
    let cur = ''
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const t = cur ? `${cur} ${word}` : word
      if (font.widthOfTextAtSize(t, size) <= maxW) cur = t
      else {
        if (cur) lines.push(cur)
        cur = word
        while (font.widthOfTextAtSize(cur, size) > maxW && cur.length > 1) {
          let k = cur.length - 1
          while (k > 1 && font.widthOfTextAtSize(cur.slice(0, k), size) > maxW) k--
          lines.push(cur.slice(0, k))
          cur = cur.slice(k)
        }
      }
    }
    lines.push(cur)
  }
  return lines
}

class Pen {
  constructor(ctx, { w = 595.28, h = 841.89, left = 60, right = 60, top = 60, bottom = 60 } = {}) {
    Object.assign(this, ctx, { W: w, H: h, left, right, top, bottom })
    this.newPage()
  }
  newPage() {
    this.page = this.doc.addPage([this.W, this.H])
    this.y = this.H - this.top
    return this.page
  }
  get width() { return this.W - this.left - this.right }
  need(h) { if (this.y - h < this.bottom) this.newPage() }
  gap(n = 8) { this.y -= n }
  // teks berbungkus; align: left|center|right; kembalikan tinggi yang dipakai
  text(str, { size = 11, font = 'r', color = '#111111', align = 'left', x = this.left, width = this.width, lh = 1.4, after = 0 } = {}) {
    const f = this.F[font]
    const lines = wrap(f, size, width, str)
    for (const ln of lines) {
      this.need(size * lh)
      const tw = f.widthOfTextAtSize(ln, size)
      const px = align === 'center' ? x + (width - tw) / 2 : align === 'right' ? x + width - tw : x
      this.page.drawText(ln, { x: px, y: this.y - size, size, font: f, color: hex(this.rgb, color) })
      this.y -= size * lh
    }
    this.y -= after
    return lines.length
  }
  line(color = '#cccccc', t = 0.8, gapAfter = 8) {
    this.page.drawLine({ start: { x: this.left, y: this.y }, end: { x: this.W - this.right, y: this.y }, thickness: t, color: hex(this.rgb, color) })
    this.y -= gapAfter
  }
  rect(x, y, w, h, color, opts = {}) { this.page.drawRectangle({ x, y, width: w, height: h, color: color ? hex(this.rgb, color) : undefined, borderColor: opts.border ? hex(this.rgb, opts.border) : undefined, borderWidth: opts.bw || 0 }) }
  // baris bertabel: cols = [{ w, text, align, font, color }]
  row(cols, { size = 10, pad = 6, bg, minH = 0, border } = {}) {
    const cells = cols.map((c) => ({ ...c, lines: wrap(this.F[c.font || 'r'], size, c.w - pad * 2, c.text) }))
    const h = Math.max(minH, ...cells.map((c) => c.lines.length * size * 1.35 + pad * 2))
    this.need(h)
    let x = this.left
    const top = this.y
    for (const c of cells) {
      if (bg) this.rect(x, top - h, c.w, h, bg)
      if (border) this.rect(x, top - h, c.w, h, null, { border, bw: 0.6 })
      let ty = top - pad
      for (const ln of c.lines) {
        const f = this.F[c.font || 'r']
        const tw = f.widthOfTextAtSize(ln, size)
        const px = c.align === 'right' ? x + c.w - pad - tw : c.align === 'center' ? x + (c.w - tw) / 2 : x + pad
        this.page.drawText(ln, { x: px, y: ty - size, size, font: f, color: hex(this.rgb, c.color || '#111111') })
        ty -= size * 1.35
      }
      x += c.w
    }
    this.y = top - h
    return h
  }
  async save() { return Buffer.from(await this.doc.save()) }
}

module.exports = { create, Pen, safe, wrap, hex }
