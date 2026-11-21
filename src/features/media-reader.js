/**
 * Mengubah media WhatsApp (gambar, stiker, video, audio/VN, dokumen) menjadi bahan yang bisa
 * dibaca AI: gambar/audio sebagai lampiran data URI, dokumen sebagai teks hasil ekstraksi.
 *
 * Didukung: jpg/png/webp/gif, stiker (statis & animasi), video (beberapa frame + transkrip suara),
 * voice note & audio (ditranskripsi lewat 9router), PDF (teks; PDF hasil scan dirender jadi gambar), DOCX, XLSX, PPTX,
 * ODT/RTF sederhana, dan semua file teks/kode (txt, md, csv, json, js, py, html, ...).
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import sharp from 'sharp'
import { runFfmpeg } from './sticker.js'
import bot from '../core/bot.js'
import { transcribe } from './transcribe.js'

const require = createRequire(import.meta.url)
const MAX_TEXT = 60_000
const MAX_IMAGE_SIDE = 2048
const MAX_PDF_RENDER_PAGES = 6

const TEXT_EXT = new Set([
  'txt', 'md', 'markdown', 'csv', 'tsv', 'json', 'jsonl', 'xml', 'html', 'htm', 'css', 'scss', 'js', 'mjs', 'cjs', 'ts', 'tsx', 'jsx',
  'py', 'java', 'kt', 'c', 'h', 'cpp', 'hpp', 'cs', 'go', 'rs', 'rb', 'php', 'sh', 'bat', 'ps1', 'sql', 'yml', 'yaml', 'toml', 'ini',
  'env', 'log', 'conf', 'cfg', 'lua', 'dart', 'swift', 'vue', 'svelte', 'r', 'tex', 'srt', 'vtt', 'gradle', 'properties'
])

const tmpFile = (ext) => path.join(bot.config?.paths?.tmp || os.tmpdir(), `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`)
const extOf = (name = '') => (String(name).toLowerCase().match(/\.([a-z0-9]+)$/) || [])[1] || ''
const dataUri = (mime, buf) => `data:${mime};base64,${buf.toString('base64')}`
const decodeXml = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&')
const clip = (text, max = MAX_TEXT) => (text.length > max ? `${text.slice(0, max)}\n\n[... dipotong, total ${text.length} karakter]` : text)

// ---------------- gambar / video / audio ----------------
async function imageToJpeg(buffer) {
  return sharp(buffer, { animated: false })
    .rotate()
    .resize(MAX_IMAGE_SIDE, MAX_IMAGE_SIDE, { fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 85 })
    .toBuffer()
}

async function stickerToPng(buffer) {
  // stiker animasi: ambil frame pertama
  return sharp(buffer, { animated: false }).resize(512, 512, { fit: 'inside' }).png().toBuffer()
}

async function videoFrames(buffer, seconds = 0) {
  const input = tmpFile('mp4')
  fs.writeFileSync(input, buffer)
  const frames = []
  try {
    const times = seconds > 4 ? [0.5, seconds / 2, Math.max(0.5, seconds - 1)] : [0]
    for (const t of times) {
      const out = tmpFile('jpg')
      try {
        await runFfmpeg(['-ss', String(t), '-i', input, '-frames:v', '1', '-vf', `scale='min(${MAX_IMAGE_SIDE},iw)':-2`, '-q:v', '3', out])
        if (fs.existsSync(out)) frames.push(fs.readFileSync(out))
      } catch {}
      fs.rmSync(out, { force: true })
    }
  } finally {
    fs.rmSync(input, { force: true })
  }
  return frames
}

// ---------------- dokumen ----------------
async function pdfText(buffer) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer), useSystemFonts: true, isEvalSupported: false }).promise
  const pages = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    let line = ''
    const lines = []
    let lastY = null
    for (const item of content.items) {
      const y = item.transform?.[5]
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        lines.push(line)
        line = ''
      }
      line += item.str + (item.hasEOL ? '\n' : '')
      lastY = y
    }
    if (line) lines.push(line)
    pages.push(`--- Halaman ${i} ---\n${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}`)
    if (pages.join('\n').length > MAX_TEXT) break
  }
  const text = pages.join('\n\n')
  await doc.destroy?.()
  return { text, pages: doc.numPages }
}

async function pdfPagesAsImages(buffer, max = MAX_PDF_RENDER_PAGES) {
  const mupdf = await import('mupdf')
  const doc = mupdf.Document.openDocument(buffer, 'application/pdf')
  const out = []
  const n = Math.min(doc.countPages(), max)
  for (let i = 0; i < n; i++) {
    const page = doc.loadPage(i)
    const pix = page.toPixmap(mupdf.Matrix.scale(1.6, 1.6), mupdf.ColorSpace.DeviceRGB, false, true)
    out.push(await imageToJpeg(Buffer.from(pix.asPNG())))
  }
  return { images: out, total: doc.countPages() }
}

async function zipXmlText(buffer, pickFiles, extract) {
  const JSZip = require('jszip')
  const zip = await JSZip.loadAsync(buffer)
  const files = Object.keys(zip.files).filter(pickFiles).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  const parts = []
  for (const f of files) parts.push(await extract(f, await zip.file(f).async('string'), zip))
  return parts.filter(Boolean).join('\n\n')
}

function docxXmlToText(xml) {
  return decodeXml(
    xml
      .replace(/<w:tab\/>/g, '\t')
      .replace(/<w:br[^>]*\/>/g, '\n')
      .replace(/<\/w:p>/g, '\n')
      .replace(/<\/w:tc>/g, '\t')
      .replace(/<[^>]+>/g, '')
  ).replace(/\n{3,}/g, '\n\n').trim()
}

async function docxText(buffer) {
  return zipXmlText(buffer, (f) => /^word\/(document|footnotes|endnotes)\.xml$/.test(f), (f, xml) => docxXmlToText(xml))
}

async function pptxText(buffer) {
  return zipXmlText(buffer, (f) => /^ppt\/slides\/slide\d+\.xml$/.test(f), (f, xml) => {
    const n = f.match(/slide(\d+)/)[1]
    const texts = [...xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map((x) => decodeXml(x[1]))
    return texts.length ? `--- Slide ${n} ---\n${texts.join('\n')}` : ''
  })
}

async function xlsxText(buffer) {
  const JSZip = require('jszip')
  const zip = await JSZip.loadAsync(buffer)
  const shared = []
  const ss = zip.file('xl/sharedStrings.xml')
  if (ss) {
    const xml = await ss.async('string')
    for (const si of xml.matchAll(/<si>([\s\S]*?)<\/si>/g)) shared.push(decodeXml([...si[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join('')))
  }
  const names = []
  const wb = zip.file('xl/workbook.xml')
  if (wb) for (const s of (await wb.async('string')).matchAll(/<sheet [^>]*name="([^"]+)"/g)) names.push(decodeXml(s[1]))
  const sheets = Object.keys(zip.files).filter((f) => /^xl\/worksheets\/sheet\d+\.xml$/.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  const out = []
  for (const [i, f] of sheets.entries()) {
    const xml = await zip.file(f).async('string')
    const rows = []
    for (const row of xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
      const cells = []
      for (const c of row[1].matchAll(/<c ([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const attrs = c[1]
        const inner = c[2] || ''
        const v = (inner.match(/<v>([\s\S]*?)<\/v>/) || [])[1]
        let val = ''
        if (/t="s"/.test(attrs) && v !== undefined) val = shared[Number(v)] ?? ''
        else if (/t="inlineStr"/.test(attrs)) val = decodeXml([...inner.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join(''))
        else if (v !== undefined) val = decodeXml(v)
        cells.push(val)
      }
      rows.push(cells.join('\t'))
      if (rows.length >= 500) break
    }
    out.push(`--- Sheet: ${names[i] || i + 1} ---\n${rows.join('\n')}`)
  }
  return out.join('\n\n')
}

async function odtText(buffer) {
  return zipXmlText(buffer, (f) => f === 'content.xml', (f, xml) => decodeXml(xml.replace(/<\/text:p>/g, '\n').replace(/<text:tab\/>/g, '\t').replace(/<[^>]+>/g, '')).trim())
}

function rtfText(buffer) {
  return buffer
    .toString('latin1')
    .replace(/\\par[d]?/g, '\n')
    .replace(/\{\\\*[^{}]*\}|\\[a-z]+-?\d* ?|[{}]/gi, '')
    .trim()
}

async function zipListing(buffer) {
  const JSZip = require('jszip')
  const zip = await JSZip.loadAsync(buffer)
  return Object.values(zip.files).slice(0, 300).map((f) => `${f.dir ? '[dir] ' : ''}${f.name}`).join('\n')
}

// ---------------- API utama ----------------
/** Ambil media dari pesan itu sendiri atau pesan yang di-reply. */
export function mediaSourcesOf(m) {
  const out = []
  const push = (src, from) => {
    if (!src) return
    if (['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage', 'ptvMessage'].includes(src.type)) out.push({ src, from })
  }
  push(m, 'pesan')
  push(m.quoted, 'reply')
  return out
}

/**
 * @param {object} m pesan hasil serialize
 * @param {{ supports?: { image?: boolean, audio?: boolean } }} opts
 * @returns {Promise<{ files: {uri,name,mime,kind}[], texts: {name,text}[], notes: string[] }>}
 */
export async function readMessageMedia(m, opts = {}) {
  const supports = { image: true, audio: true, ...(opts.supports || {}) }
  const result = { files: [], texts: [], notes: [] }
  for (const { src } of mediaSourcesOf(m)) {
    try {
      await readOne(src, result, supports)
    } catch (err) {
      result.notes.push(`Gagal membaca ${src.type.replace('Message', '')}: ${err.message}`)
    }
  }
  return result
}

async function readOne(src, result, supports) {
  const node = src.msg || {}
  const size = Number(node.fileLength || 0)
  if (size > 40 * 1024 * 1024) throw new Error('file lebih dari 40 MB')
  const buffer = await src.download()
  const mime = String(node.mimetype || '').split(';')[0]
  const name = node.fileName || node.title || src.type.replace('Message', '')
  const addImage = async (buf, label, kind = 'image') => {
    if (!supports.image) return result.notes.push(`Model yang dipilih tidak bisa membaca gambar (${label}). Pilih model dengan ikon 🖼️ lewat .ocmodels`)
    result.files.push({ uri: dataUri('image/jpeg', await imageToJpeg(buf)), name: `${label}.jpg`, mime: 'image/jpeg', kind })
  }
  // OpenCode belum meneruskan lampiran audio ke model → audio ditranskripsi lewat 9router
  const addAudio = async (buf, label, ext) => {
    try {
      const text = await transcribe(buf, ext)
      result.texts.push({ name: `${label} (transkrip audio)`, text: text || '(tidak ada ucapan terdeteksi)' })
    } catch (err) {
      result.notes.push(`${label}: ${err.message}`)
    }
  }

  switch (src.type) {
    case 'imageMessage':
      return addImage(buffer, 'gambar')
    case 'stickerMessage':
      if (!supports.image) return addImage(buffer, 'stiker')
      return result.files.push({ uri: dataUri('image/png', await stickerToPng(buffer)), name: 'stiker.png', mime: 'image/png', kind: 'sticker' })
    case 'videoMessage':
    case 'ptvMessage': {
      const frames = await videoFrames(buffer, Number(node.seconds || 0))
      for (const [i, f] of frames.entries()) await addImage(f, `video-frame-${i + 1}`, 'video-frame')
      result.notes.push(`Video ${node.seconds || '?'} detik: dikirim ${frames.length} cuplikan frame.`)
      if (Number(node.seconds || 0) <= 600 && !node.gifPlayback) await addAudio(buffer, 'suara video', 'mp4')
      return
    }
    case 'audioMessage':
      return addAudio(buffer, node.ptt ? 'voice-note' : 'audio', 'ogg')
    case 'documentMessage':
      return readDocument(buffer, name, mime, result, addImage, addAudio)
  }
}

async function readDocument(buffer, name, mime, result, addImage, addAudio) {
  const ext = extOf(name)
  const addText = (text, label = name) => result.texts.push({ name: label, text: clip(String(text || '').trim()) || '(dokumen kosong)' })

  if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'heic'].includes(ext)) return addImage(buffer, name)
  if (mime.startsWith('audio/') || ['mp3', 'm4a', 'wav', 'ogg', 'opus', 'aac', 'flac', 'amr'].includes(ext)) return addAudio(buffer, name, ext || 'mp3')
  if (mime.startsWith('video/') || ['mp4', 'mkv', 'mov', 'webm', '3gp', 'avi'].includes(ext)) {
    const frames = await videoFrames(buffer, 10)
    for (const [i, f] of frames.entries()) await addImage(f, `${name}-frame-${i + 1}`, 'video-frame')
    return
  }
  if (mime === 'application/pdf' || ext === 'pdf') {
    const { text, pages } = await pdfText(buffer)
    const words = text.replace(/--- Halaman \d+ ---/g, '').trim().length
    if (words / Math.max(1, pages) < 40) {
      // kemungkinan PDF hasil scan → kirim sebagai gambar
      const { images, total } = await pdfPagesAsImages(buffer)
      for (const [i, img] of images.entries()) await addImage(img, `${name}-hal-${i + 1}`, 'pdf-page')
      result.notes.push(`PDF ${total} halaman tanpa teks (hasil scan): ${images.length} halaman pertama dikirim sebagai gambar.`)
      if (words) addText(text)
      return
    }
    return addText(text, `${name} (${pages} halaman)`)
  }
  if (ext === 'docx' || mime.includes('wordprocessingml')) return addText(await docxText(buffer))
  if (ext === 'pptx' || mime.includes('presentationml')) return addText(await pptxText(buffer))
  if (ext === 'xlsx' || mime.includes('spreadsheetml')) return addText(await xlsxText(buffer))
  if (ext === 'odt' || ext === 'ods' || ext === 'odp') return addText(await odtText(buffer))
  if (ext === 'rtf' || mime === 'application/rtf') return addText(rtfText(buffer))
  if (['zip', 'jar', 'apk'].includes(ext) || mime === 'application/zip') return addText(await zipListing(buffer), `${name} (isi arsip)`)
  if (['doc', 'xls', 'ppt'].includes(ext)) {
    result.notes.push(`${name}: format Office lama (.${ext}) belum didukung. Simpan ulang sebagai .${ext}x lalu kirim lagi.`)
    return
  }
  if (TEXT_EXT.has(ext) || mime.startsWith('text/') || /json|xml|javascript|yaml/.test(mime) || looksLikeText(buffer)) {
    return addText(buffer.toString('utf8'))
  }
  result.notes.push(`${name} (${mime || ext || 'tidak diketahui'}) tidak bisa dibaca sebagai teks.`)
}

function looksLikeText(buffer) {
  const sample = buffer.subarray(0, 4096)
  if (!sample.length) return false
  let bad = 0
  for (const b of sample) if (b === 0 || (b < 9) || (b > 13 && b < 32)) bad++
  return bad / sample.length < 0.02
}

/** Gabungkan teks dokumen ke prompt pengguna. */
export function composePrompt(userText, media) {
  const parts = [userText?.trim() || 'Jelaskan isi lampiran ini.']
  for (const t of media.texts) parts.push(`\n\n<lampiran nama="${t.name}">\n${t.text}\n</lampiran>`)
  return parts.join('')
}
