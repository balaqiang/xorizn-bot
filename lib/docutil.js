// lib/docutil.js — helper dokumen: cari program eksternal, folder sementara, deteksi jenis file, ambil dokumen dari pesan
'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawn, spawnSync } = require('child_process')
const { getMedia } = require('./utils')

const found = new Map()
function which(cmd) {
  if (found.has(cmd)) return found.get(cmd)
  let ok = false
  try {
    const r = spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { stdio: 'ignore' })
    ok = r.status === 0
  } catch {}
  found.set(cmd, ok)
  return ok
}

// jalankan program; -> { code, out, err }
function exec(cmd, args, { timeout = 120000, cwd, env } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { cwd, env: { ...process.env, ...env } })
    let out = Buffer.alloc(0)
    let err = ''
    const t = setTimeout(() => { p.kill('SIGKILL'); reject(Object.assign(new Error('timeout'), { code: 'TIMEOUT' })) }, timeout)
    p.stdout.on('data', (d) => { if (out.length < 20 * 1024 * 1024) out = Buffer.concat([out, d]) })
    p.stderr.on('data', (d) => { if (err.length < 8000) err += d })
    p.on('error', (e) => { clearTimeout(t); reject(e) })
    p.on('close', (code) => { clearTimeout(t); resolve({ code, out, err }) })
  })
}

async function withTmp(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vx-'))
  try {
    return await fn(dir)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

// deteksi jenis dari isi file
function sniff(b) {
  if (!b || b.length < 4) return { ext: 'bin', mime: 'application/octet-stream', kind: 'unknown', label: 'Tidak dikenali' }
  const h = b.subarray(0, 16)
  const s = (from, str) => h.subarray(from, from + str.length).toString('latin1') === str
  if (s(0, '%PDF')) return { ext: 'pdf', mime: 'application/pdf', kind: 'pdf', label: 'Dokumen PDF' }
  if (s(0, '\x89PNG')) return { ext: 'png', mime: 'image/png', kind: 'image', label: 'Gambar PNG' }
  if (h[0] === 0xff && h[1] === 0xd8) return { ext: 'jpg', mime: 'image/jpeg', kind: 'image', label: 'Gambar JPEG' }
  if (s(0, 'GIF8')) return { ext: 'gif', mime: 'image/gif', kind: 'image', label: 'Gambar GIF' }
  if (s(0, 'RIFF') && b.subarray(8, 12).toString('latin1') === 'WEBP') return { ext: 'webp', mime: 'image/webp', kind: 'image', label: 'Gambar WebP' }
  if (s(0, 'RIFF') && b.subarray(8, 12).toString('latin1') === 'WAVE') return { ext: 'wav', mime: 'audio/wav', kind: 'audio', label: 'Audio WAV' }
  if (s(0, 'BM')) return { ext: 'bmp', mime: 'image/bmp', kind: 'image', label: 'Gambar BMP' }
  if (s(0, 'ID3') || (h[0] === 0xff && (h[1] & 0xe0) === 0xe0)) return { ext: 'mp3', mime: 'audio/mpeg', kind: 'audio', label: 'Audio MP3' }
  if (s(0, 'OggS')) return { ext: 'ogg', mime: 'audio/ogg', kind: 'audio', label: 'Audio OGG' }
  if (s(0, 'fLaC')) return { ext: 'flac', mime: 'audio/flac', kind: 'audio', label: 'Audio FLAC' }
  if (s(4, 'ftyp')) return { ext: /M4A/.test(b.subarray(8, 12).toString('latin1')) ? 'm4a' : 'mp4', mime: /M4A/.test(b.subarray(8, 12).toString('latin1')) ? 'audio/mp4' : 'video/mp4', kind: /M4A/.test(b.subarray(8, 12).toString('latin1')) ? 'audio' : 'video', label: 'Video/Audio MP4' }
  if (h[0] === 0x1a && h[1] === 0x45 && h[2] === 0xdf && h[3] === 0xa3) return { ext: 'webm', mime: 'video/webm', kind: 'video', label: 'Video WebM/MKV' }
  if (s(0, 'PK\x03\x04')) {
    const head = b.subarray(0, 4000).toString('latin1')
    if (head.includes('word/')) return { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', kind: 'office', label: 'Word (DOCX)' }
    if (head.includes('xl/')) return { ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', kind: 'office', label: 'Excel (XLSX)' }
    if (head.includes('ppt/')) return { ext: 'pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', kind: 'office', label: 'PowerPoint (PPTX)' }
    return { ext: 'zip', mime: 'application/zip', kind: 'zip', label: 'Arsip ZIP' }
  }
  if (s(0, 'Rar!')) return { ext: 'rar', mime: 'application/vnd.rar', kind: 'archive', label: 'Arsip RAR' }
  if (s(0, '7z')) return { ext: '7z', mime: 'application/x-7z-compressed', kind: 'archive', label: 'Arsip 7z' }
  if (h[0] === 0x1f && h[1] === 0x8b) return { ext: 'gz', mime: 'application/gzip', kind: 'archive', label: 'Arsip GZIP' }
  if (s(0, 'SQLite')) return { ext: 'db', mime: 'application/vnd.sqlite3', kind: 'data', label: 'Database SQLite' }
  const text = b.subarray(0, 2000)
  if (!text.includes(0)) {
    const t = text.toString('utf8').trimStart()
    if (/^[{[]/.test(t)) return { ext: 'json', mime: 'application/json', kind: 'text', label: 'Teks JSON' }
    if (/^<(!doctype html|html)/i.test(t)) return { ext: 'html', mime: 'text/html', kind: 'text', label: 'Halaman HTML' }
    if (/^<\?xml|^<[a-z]/i.test(t)) return { ext: 'xml', mime: 'application/xml', kind: 'text', label: 'Teks XML' }
    return { ext: 'txt', mime: 'text/plain', kind: 'text', label: 'Teks biasa' }
  }
  return { ext: 'bin', mime: 'application/octet-stream', kind: 'unknown', label: 'Biner / tidak dikenali' }
}

const safeName = (n, fallback = 'file') => String(n || fallback).replace(/[\\/:*?"<>|\x00-\x1f]/g, '_').replace(/\s+/g, ' ').trim().slice(0, 80) || fallback

// Ambil file apa pun (dokumen/gambar/video/audio/stiker) dari pesan atau reply -> { buffer, name, mime, sniff }
async function getFile(sock, msg) {
  const m = await getMedia(sock, msg, ['documentMessage', 'imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage'])
  if (!m) return null
  if (m.buffer.length > 80 * 1024 * 1024) throw Object.assign(new Error('file besar'), { userMessage: 'File terlalu besar (maks 80 MB).' })
  const sn = sniff(m.buffer)
  const mime = m.info?.mimetype || sn.mime
  const name = safeName(m.info?.fileName || `file.${sn.ext}`)
  return { buffer: m.buffer, name, mime, sniff: sn, type: m.type }
}

// "1-3,5,8-" -> [1,2,3,5,8,...] (1-based), dibatasi 1..total
function parseRange(spec, total) {
  const out = []
  const s = String(spec || '').replace(/\s+/g, '')
  if (!s || /^(semua|all)$/i.test(s)) return Array.from({ length: total }, (_, i) => i + 1)
  for (const part of s.split(',')) {
    const m = part.match(/^(\d+)(?:-(\d*))?$/)
    if (!m) throw Object.assign(new Error('range'), { userMessage: `Rentang halaman "${part}" tidak valid. Contoh: 1-3,5` })
    const a = Number(m[1])
    const b = m[2] === undefined ? a : m[2] === '' ? total : Number(m[2])
    if (a < 1 || a > total || b < a || b > total) throw Object.assign(new Error('range'), { userMessage: `Halaman di luar jangkauan (dokumen punya ${total} halaman).` })
    for (let i = a; i <= b; i++) out.push(i)
  }
  return out
}

module.exports = { which, exec, withTmp, sniff, safeName, getFile, parseRange }
