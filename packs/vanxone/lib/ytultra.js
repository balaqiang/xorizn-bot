// Scraper ytultra.com (YouTube audio & video). Bentuk respons API pihak ketiga tidak dijamin,
// jadi pemilihan media dibuat longgar; kalau gagal, pemanggil otomatis pindah ke yt-dlp.
const axios = require('axios')

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'

async function fetchMedias(url) {
  let res
  try {
    res = await axios.post(
      'https://api.ytultra.com/ikool/youtube/download',
      { url },
      {
        headers: {
          'Content-Type': 'application/json',
          referer: 'https://www.ytultra.com/id/youtube-video-downloader/',
          origin: 'https://www.ytultra.com',
          'user-agent': UA
        },
        timeout: 30000
      }
    )
  } catch (err) {
    throw new Error(`ytultra tidak bisa dihubungi (${err.response?.status || err.code || err.message})`)
  }
  const data = res.data?.data
  if (!data || !Array.isArray(data.medias) || !data.medias.length) {
    console.log('[YTULTRA] respons tak terduga:', JSON.stringify(res.data)?.slice(0, 300))
    throw new Error('ytultra: daftar media kosong')
  }
  return { title: data.title || data.name || '', medias: data.medias }
}

// ---------- klasifikasi longgar ----------
const text = (m) => [m.type, m.mimeType, m.mime, m.format, m.extension, m.ext, m.label, m.quality].filter(Boolean).join(' ').toLowerCase()
const extOf = (m) => String(m.extension || m.ext || (String(m.url).split('?')[0].split('.').pop() || '')).toLowerCase()
const heightOf = (m) => Number(m.height) || Number((String(m.quality || m.label || '').match(/(\d{3,4})\s*p/i) || [])[1]) || 0
const sizeOf = (m) => Number(m.size || m.fileSize || m.filesize || m.contentLength) || 0

function isAudio(m) {
  const t = text(m)
  if (m.audioAvailable === true && m.videoAvailable === false) return true
  if (/audio|mp3|m4a|opus|aac|kbps/.test(t) && !/video|mp4|webm\b.*\d{3,4}p|\d{3,4}p/.test(t)) return true
  return ['mp3', 'm4a', 'opus', 'aac'].includes(extOf(m))
}
const hasSound = (m) => m.audioAvailable !== false && m.hasAudio !== false && m.is_audio !== false

function pick(medias, { audio }) {
  const usable = medias.filter((m) => m && typeof m.url === 'string' && /^https?:\/\//.test(m.url))
  if (audio) {
    const list = usable.filter(isAudio)
    if (!list.length) return null
    const rank = (m) => (extOf(m) === 'mp3' ? 0 : extOf(m) === 'm4a' ? 1 : 2)
    return list.sort((a, b) => rank(a) - rank(b) || (Number(b.bitrate) || 0) - (Number(a.bitrate) || 0))[0]
  }
  const vids = usable.filter((m) => !isAudio(m) && hasSound(m))
  if (!vids.length) return null
  // paling dekat 720p tanpa melebihi; kalau semua lebih tinggi, ambil yang terendah
  const under = vids.filter((m) => !heightOf(m) || heightOf(m) <= 720).sort((a, b) => heightOf(b) - heightOf(a) || (extOf(a) === 'mp4' ? -1 : 1))
  return (under.length ? under : vids.sort((a, b) => heightOf(a) - heightOf(b)))[0]
}

module.exports = { fetchMedias, pick, isAudio, extOf }
