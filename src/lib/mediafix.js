// Pastikan file media bisa diputar WhatsApp: kenali format asli dari isi file, ubah bila perlu.
const ffm = require('./ffm')
const { spawnSync } = require('child_process')

let ff
const hasFfmpeg = () => (ff ??= spawnSync('ffmpeg', ['-version']).status === 0)

// 'mp3' | 'm4a' | 'mp4' | 'ogg' | 'webm' | 'wav' | 'unknown' (dari magic bytes)
function sniff(buf) {
  if (!buf || buf.length < 12) return 'unknown'
  if (buf.slice(0, 3).toString() === 'ID3') return 'mp3'
  if (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0) return 'mp3'
  if (buf.slice(4, 8).toString() === 'ftyp') {
    const brand = buf.slice(8, 12).toString()
    return /^(M4A|M4B|mp42isom)$/.test(brand) || brand.startsWith('M4A') ? 'm4a' : 'mp4'
  }
  if (buf.slice(0, 4).toString() === 'OggS') return 'ogg'
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return 'webm'
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WAVE') return 'wav'
  return 'unknown'
}

const AUDIO_MIME = { mp3: 'audio/mpeg', m4a: 'audio/mp4', mp4: 'audio/mp4', ogg: 'audio/ogg; codecs=opus', wav: 'audio/wav' }

// Kembalikan { buffer, mime, ext } yang aman diputar. WebM/Ogg/WAV dikonversi ke MP3 bila ffmpeg tersedia.
async function audio(buffer) {
  const t = sniff(buffer)
  if (t === 'mp3' || t === 'm4a' || t === 'mp4') return { buffer, mime: AUDIO_MIME[t], ext: t === 'mp3' ? 'mp3' : 'm4a' }
  if (hasFfmpeg()) {
    try {
      const out = await ffm.run(buffer, 'mp3', (i, o) => ['-i', i, '-vn', '-c:a', 'libmp3lame', '-b:a', '128k', o], 120000)
      if (out.length > 5000) return { buffer: out, mime: 'audio/mpeg', ext: 'mp3' }
    } catch (e) {
      console.log('[MEDIAFIX] konversi audio gagal:', e.message)
    }
  }
  return { buffer, mime: AUDIO_MIME[t] || 'audio/mpeg', ext: t === 'unknown' ? 'mp3' : t }
}

// Video WebM/MKV diubah ke MP4 (H.264/AAC) bila bisa; kalau gagal kirim apa adanya.
async function video(buffer) {
  const t = sniff(buffer)
  if (t === 'mp4' || t === 'm4a') return { buffer, ext: 'mp4' }
  if ((t === 'webm' || t === 'unknown') && hasFfmpeg()) {
    try {
      const out = await ffm.run(buffer, 'mp4', (i, o) => ['-i', i, '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-movflags', 'faststart', o], 240000)
      if (out.length > 5000) return { buffer: out, ext: 'mp4' }
    } catch (e) {
      console.log('[MEDIAFIX] konversi video gagal:', e.message)
    }
  }
  return { buffer, ext: 'mp4' }
}

function imageType(b) {
  if (!b || b.length < 12) return null
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg'
  if (b[0] === 0x89 && b.slice(1, 4).toString() === 'PNG') return 'png'
  if (b.slice(0, 4).toString() === 'GIF8') return 'gif'
  if (b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP') return 'webp'
  return null
}

// Jenis trek MP4 dari kotak "hdlr": 'vide' (gambar) / 'soun' (suara). Tanpa ffprobe.
function mp4Tracks(buf) {
  const t = new Set()
  let i = 0
  while ((i = buf.indexOf('hdlr', i)) !== -1) {
    const h = buf.toString('latin1', i + 12, i + 16)
    if (h === 'vide' || h === 'soun') t.add(h)
    i += 4
  }
  return t
}

// Periksa isi file yang diunduh. type: 'image' | 'video' | 'audio' | 'invalid'
// Berguna karena sebagian situs mengirim video & audio terpisah (DASH), atau halaman HTML/JSON bukan media.
function inspect(buf) {
  if (imageType(buf)) return { type: 'image', ext: imageType(buf) }
  const s = sniff(buf)
  if (s === 'mp4' || s === 'm4a') {
    const tr = mp4Tracks(buf)
    const v = tr.has('vide')
    const a = tr.has('soun')
    if (!v && !a) return { type: 'invalid' }
    return { type: v ? 'video' : 'audio', hasVideo: v, hasAudio: a, ext: v ? 'mp4' : 'm4a' }
  }
  if (s === 'webm') return { type: 'video', hasVideo: true, hasAudio: true, ext: 'webm' }
  if (s === 'mp3' || s === 'ogg' || s === 'wav') return { type: 'audio', hasAudio: true, ext: s }
  return { type: 'invalid' }
}

// Gabungkan video-saja + audio-saja menjadi satu MP4 (tanpa encode ulang)
async function mux(videoBuf, audioBuf) {
  return ffm.runMulti([videoBuf, audioBuf], 'mp4', ([v, a], o) => ['-i', v, '-i', a, '-map', '0:v:0', '-map', '1:a:0', '-c', 'copy', '-shortest', '-movflags', 'faststart', o])
}

module.exports = { sniff, audio, video, hasFfmpeg, inspect, mux, imageType, mp4Tracks }
