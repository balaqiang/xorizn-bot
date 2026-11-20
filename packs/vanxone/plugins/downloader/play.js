// .play — cari lagu di YouTube lalu kirim audionya.
// Urutan: (1) cache WhatsApp dari API azbry  ->  (2) API ytplay2  ->  (3) yt-dlp + cookies (bin/cookies.txt) kalau API mati.
const axios = require('axios')
const { fetchAndSend } = require('../../lib/mediadl')
const ytLite = require('../../lib/youtube')

// yt-search opsional; kalau belum terpasang pakai pencari bawaan (lib/youtube)
let yts = null
try { yts = require('yt-search') } catch {}

const API = 'https://api.azbry.com'

function formatViews(n) {
  if (typeof n === 'string') return n || '0'
  if (!n) return '0'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return String(n)
}

async function searchVideo(query) {
  if (yts) {
    try {
      const r = await yts(query)
      if (r.videos && r.videos[0]) return r.videos[0]
    } catch (e) {
      console.log('[PLAY] yt-search gagal, pakai pencari bawaan:', e.message)
    }
  }
  const [it] = await ytLite.search(query, 1)
  return {
    title: it.title,
    url: it.url,
    thumbnail: it.thumb,
    views: it.views,
    author: { name: it.channel },
    duration: { timestamp: it.duration }
  }
}

function findAudioUrl(data, depth = 0) {
  if (!data || depth > 6) return null
  if (typeof data === 'string') {
    return /^https?:\/\/.+/i.test(data) && /\.(mp3|m4a|aac|ogg|opus|wav)(\?|#|$)/i.test(data) ? data : null
  }
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findAudioUrl(item, depth + 1)
      if (found) return found
    }
    return null
  }
  if (typeof data !== 'object') return null

  const keys = ['download', 'downloadUrl', 'audioUrl', 'audio_url', 'url', 'link', 'mp3']
  for (const key of keys) {
    if (data[key]) {
      const value = data[key]
      if (typeof value === 'string' && /^https?:\/\//i.test(value)) return value
      const found = findAudioUrl(value, depth + 1)
      if (found) return found
    }
  }
  for (const value of Object.values(data)) {
    const found = findAudioUrl(value, depth + 1)
    if (found) return found
  }
  return null
}

async function getAudio(url) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 120000,
    maxRedirects: 5,
    headers: { 'User-Agent': 'Mozilla/5.0', Accept: '*/*' },
    validateStatus: (status) => status >= 200 && status < 300
  })

  const buffer = Buffer.from(response.data)
  const type = String(response.headers['content-type'] || '').toLowerCase()

  if (buffer.length < 100 * 1024 || type.includes('text/html') || type.includes('application/json')) {
    throw new Error('File audio kosong, kecil, atau berupa respons error')
  }

  const isMp3 = buffer.subarray(0, 3).toString() === 'ID3' || (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0)
  const isMp4Audio = buffer.subarray(4, 8).toString() === 'ftyp'
  const isOgg = buffer.subarray(0, 4).toString() === 'OggS'
  const isWav = buffer.subarray(0, 4).toString() === 'RIFF'
  const isWebm = buffer.subarray(0, 4).toString() === '\x1aE\xdf\xa3'

  if (!isMp3 && !isMp4Audio && !isOgg && !isWav && !isWebm && !type.startsWith('audio/')) {
    throw new Error('Format file bukan audio yang dikenali')
  }

  return {
    buffer,
    mimetype: isMp3 ? 'audio/mpeg' : isOgg ? 'audio/ogg' : isWav ? 'audio/wav' : isWebm ? 'audio/webm' : isMp4Audio ? 'audio/mp4' : type.split(';')[0]
  }
}

module.exports = {
  name: 'play',
  command: ['play', 'playaudio', 'putar'],
  category: 'downloader',
  desc: 'Putar musik dari YouTube',
  usage: '<query>',
  energi: 1,
  selfReact: true, // reaksi diatur sendiri di bawah

  run: async ({ sock, msg, from, args, text, prefix, reply }) => {
    const query = (text || '').trim()
    if (!query) {
      return reply(`🎵 *PLAY MUSIC*\n\nContoh: ${prefix}play komang`)
    }

    const react = async (emoji) => {
      try {
        await sock.sendMessage(from, { react: { text: emoji, key: msg.key } })
      } catch {}
    }

    await react('🕐')

    try {
      const video = await searchVideo(query)
      if (!video) throw new Error('Video tidak ditemukan')

      const caption =
        `🎵 *NOW PLAYING*\n\n` +
        `📌 Judul: *${video.title}*\n` +
        `👤 Channel: *${video.author?.name || '-'}*\n` +
        `⏱️ Durasi: *${video.duration?.timestamp || '-'}*\n` +
        `👀 Views: *${formatViews(video.views)}*\n` +
        `🔗 ${video.url}\n\n` +
        `_Sedang mengambil audio..._`

      try {
        if (typeof sock.sendPreview === 'function') {
          await sock.sendPreview(from, {
            caption: caption,
            url: video.url,
            title: video.title,
            description: 'YouTube Audio',
            image: video.thumbnail,
            previewType: 1
          }, { quoted: msg })
        } else {
          await sock.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: caption
          }, { quoted: msg })
        }
      } catch {}

      // 1. Coba cache WhatsApp
      try {
        const cached = await axios.get(`${API}/api/cache/playrelay`, {
          params: { q: video.title },
          timeout: 20000
        })
        if (cached.data?.content && typeof cached.data.content === 'object') {
          await sock.relayMessage(from, cached.data.content, {})
          await react('✅')
          return
        }
      } catch (err) {
        console.log('[PLAY] Cache tidak tersedia:', err.message)
      }

      // 2. Fallback ytplay2
      let apiError = null
      try {
        const result = await axios.get(`${API}/api/download/ytplay2`, {
          params: { q: video.url },
          timeout: 120000,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        })

        const data = result.data
        if (data?.status === false) throw new Error(data.message || 'API downloader gagal')

        const audioUrl = findAudioUrl(data)
        if (!audioUrl) {
          console.error('[PLAY] Struktur respons API:', JSON.stringify(data).slice(0, 2500))
          throw new Error('API tidak memberikan URL audio yang dikenali')
        }

        const { buffer, mimetype } = await getAudio(audioUrl)
        const filename = video.title.replace(/[\\/:*?"<>|]/g, '_') + (mimetype === 'audio/mpeg' ? '.mp3' : '.audio')

        await sock.sendMessage(from, {
          audio: buffer,
          mimetype,
          ptt: false,
          fileName: filename
        }, { quoted: msg })

        await react('✅')
        return
      } catch (err) {
        apiError = err
        console.log('[PLAY] API azbry gagal, lanjut ke yt-dlp + cookies:', err.message)
      }

      // 3. Cadangan terakhir: yt-dlp memakai cookies (bin/cookies.txt, dipasang lewat .ytcookies)
      try {
        await fetchAndSend(sock, from, msg, video.url, { audio: true, max: 1 })
        await react('✅')
      } catch (err2) {
        throw new Error(`API: ${apiError.message}\nCadangan (yt-dlp): ${err2.message}`)
      }
    } catch (err) {
      console.error('[vanXone PLAY]', err)
      await react('❌')
      return reply(`❌ *PLAY AUDIO GAGAL*\n\nPesan: ${err.message}\n\nPeriksa log panel untuk melihat respons API.\n_vanXone </>_`)
    }
  }
}
