/**
 * TikTok mobile-API scraper (video & slideshow).
 * Diadaptasi dari tiktok.js — TikTok Scraper & Downloader
 * @author  ShanMolvyr
 * @repo    https://code.vyrgo.cyou/shanmolvyr/tiktok
 * @version 1.0.0
 * Kredit asli dipertahankan. Perubahan: tanpa dependensi tambahan (cookiejar/retry diganti retry sederhana),
 * hasil dikembalikan sebagai daftar URL siap unduh untuk bot WhatsApp.
 */
const axios = require('axios')

const DEVICE = {
  device_id: '7318517321748022790', iid: '7318518857994389254', device_type: 'Pixel 7', device_brand: 'Google',
  os_version: '13', os_api: '33', resolution: '1080*2400', dpi: '420', version_code: '350103', version_name: '35.1.3',
  manifest_version_code: '2023501030', update_version_code: '2023501030', ab_version: '35.1.3', channel: 'googleplay', build: 'TQ3A.230901.001'
}
const MOBILE_UA = `com.zhiliaoapp.musically/${DEVICE.manifest_version_code} (Linux; U; Android ${DEVICE.os_version}; en_ID; ${DEVICE.device_type}; Build/${DEVICE.build}; Cronet/TTNetVersion:d0a7e9ec 2024-11-05 QuicVersion:ac6fdc24 2024-10-14)`
const WEB_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
const MOBILE_ENDPOINTS = [
  'https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/',
  'https://api19-normal-c-useast1a.tiktokv.com/aweme/v1/feed/',
  'https://api-h2.tiktokv.com/aweme/v1/feed/',
  'https://api.tiktokv.com/aweme/v1/feed/',
  'https://api16-normal-useast5.us.tiktokv.com/aweme/v1/feed/'
]
const log = (...a) => { if (process.env.TIKTOK_DEBUG) console.log('[TIKTOK-MOBILE]', ...a) }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const extractVideoId = (url) => (String(url).match(/\/(?:video|photo|v)\/(\d+)/) || [])[1] || null

async function resolveUrl(url) {
  try {
    const res = await axios.get(url, { headers: { 'User-Agent': MOBILE_UA }, maxRedirects: 10, validateStatus: () => true, timeout: 15000 })
    return res.request?.res?.responseUrl || res.config?.url || url
  } catch {
    return url
  }
}

function buildParams(videoId) {
  return new URLSearchParams({
    aweme_id: videoId, aid: '1233', app_name: 'musical_ly', device_platform: 'android', os: 'android', ssmix: 'a',
    device_type: DEVICE.device_type, device_brand: DEVICE.device_brand, os_version: DEVICE.os_version, os_api: DEVICE.os_api,
    channel: DEVICE.channel, version_code: DEVICE.version_code, version_name: DEVICE.version_name,
    manifest_version_code: DEVICE.manifest_version_code, update_version_code: DEVICE.update_version_code, ab_version: DEVICE.ab_version,
    resolution: DEVICE.resolution, dpi: DEVICE.dpi, device_id: DEVICE.device_id, iid: DEVICE.iid, language: 'en', app_language: 'en',
    region: 'SG', sys_region: 'SG', timezone_name: 'Asia/Jakarta', timezone_offset: '25200', ac: 'wifi', ac2: 'wifi5g', is_pad: '0',
    app_type: 'normal', build_number: DEVICE.version_name, last_install_time: '1706000000', ts: Math.floor(Date.now() / 1000).toString()
  })
}

async function fetchViaMobileApi(videoId) {
  const params = buildParams(videoId)
  const headers = {
    'User-Agent': MOBILE_UA, Accept: 'application/json', 'Accept-Language': 'en-US,en;q=0.9', Connection: 'keep-alive',
    'X-Gorgon': '0404b0d30000', 'X-Khronos': Math.floor(Date.now() / 1000).toString(), 'X-Argus': '', 'X-Ladon': '',
    'sdk-version': '2', 'passport-sdk-version': '19'
  }
  let lastErr = null
  for (const endpoint of MOBILE_ENDPOINTS) {
    try {
      const res = await axios.get(`${endpoint}?${params}`, { headers, timeout: 15000, validateStatus: (s) => s < 500 })
      if (res.status === 403 || res.status === 401) { lastErr = new Error(`HTTP ${res.status}`); continue }
      const data = res.data
      if (!data || typeof data !== 'object') { lastErr = new Error('respons bukan JSON'); continue }
      if (data.status_code !== 0) { lastErr = new Error(`status_code ${data.status_code}`); continue }
      const aweme = data.aweme_list?.[0]
      if (!aweme) { lastErr = new Error('aweme_list kosong'); continue }
      return aweme
    } catch (e) {
      lastErr = e
      await sleep(300)
    }
  }
  throw lastErr || new Error('semua endpoint gagal')
}

async function fetchViaWebApi(videoId) {
  const params = new URLSearchParams({
    itemId: videoId, aid: '1988', app_language: 'en', app_name: 'tiktok_web', browser_language: 'en-US', browser_name: 'Mozilla',
    browser_online: 'true', browser_platform: 'Win32', browser_version: '5.0 (Windows)', channel: 'tiktok_web', cookie_enabled: 'true',
    device_platform: 'web_pc', focus_state: 'true', from_page: 'video', is_fullscreen: 'false', is_page_visible: 'true', language: 'en',
    os: 'windows', region: 'SG', screen_height: '1080', screen_width: '1920', tz_name: 'Asia/Jakarta'
  })
  const res = await axios.get(`https://www.tiktok.com/api/item/detail/?${params}`, {
    headers: { 'User-Agent': WEB_UA, Referer: `https://www.tiktok.com/@user/video/${videoId}`, Accept: 'application/json, text/plain, */*', 'Accept-Language': 'en-US,en;q=0.9' },
    timeout: 15000, validateStatus: (s) => s < 500
  })
  const data = res.data
  if (!data || typeof data !== 'object') throw new Error('web API bukan JSON')
  if (data.statusCode !== 0 && data.status_code !== 0) throw new Error(`web API error ${data.statusCode ?? data.status_code}`)
  const item = data.itemInfo?.itemStruct || data.item
  if (!item) throw new Error('itemStruct tidak ada')
  return item
}

const getBt = (u) => { const m = u.match(/[&?]bt=(\d+)/); return m ? parseInt(m[1], 10) : 0 }

function normalize(item) {
  const author = item.author || item.aweme_author || {}
  const music = item.music || {}
  const video = item.video || {}
  const imagePost = item.image_post_info || item.imagePost || null

  const bitRates = video.bit_rate || video.bitrateInfo || []
  const sorted = [...bitRates].sort((a, b) => (b.bit_rate || b.bitrate || 0) - (a.bit_rate || a.bitrate || 0))
  let urls = []
  for (const b of sorted) urls.push(...(b.play_addr?.url_list || b.PlayAddr?.UrlList || b.playAddr?.urlList || []))
  if (!urls.length) {
    const play = video.play_addr || video.playAddr
    const dl = video.download_addr || video.downloadAddr
    if (play?.url_list) urls.push(...play.url_list); else if (play?.urlList) urls.push(...play.urlList)
    if (dl?.url_list) urls.push(...dl.url_list); else if (dl?.urlList) urls.push(...dl.urlList)
  }
  urls = [...new Set(urls.filter((s) => typeof s === 'string' && s.startsWith('http')))]
  // urutan unduhan: CDN tiktokcdn + bitrate (bt) tertinggi dulu
  urls.sort((a, b) => (getBt(b) + (b.includes('tiktokcdn.com') ? 10000 : 0)) - (getBt(a) + (a.includes('tiktokcdn.com') ? 10000 : 0)))

  const images = []
  for (const img of imagePost?.images || imagePost?.image_list || []) {
    const list = img.display_image?.url_list || img.imageURL?.urlList || img.imageUrl?.urlList || []
    const u = list.at(-1) || list[0]
    if (u) images.push(u)
  }
  return {
    id: item.aweme_id || item.id || null,
    desc: item.desc || item.description || '',
    author: author.nickname || author.unique_id || author.uniqueId || '',
    videoUrls: urls,
    images,
    music: music.play_url?.url_list?.[0] || (typeof music.playUrl === 'string' ? music.playUrl : null),
    isSlideshow: !!imagePost && images.length > 0
  }
}

// Mengembalikan { id, desc, author, videoUrls[], images[], music, isSlideshow }
async function scrape(inputUrl) {
  if (!/tiktok/i.test(inputUrl || '')) throw new Error('URL TikTok tidak valid')
  let url = String(inputUrl).trim()
  if (/vt\.|vm\.|\/\/t\.tiktok/.test(url)) url = await resolveUrl(url)
  const videoId = extractVideoId(url)
  if (!videoId) throw new Error('tidak bisa mengambil ID video dari link')
  let item = null
  try {
    item = await fetchViaMobileApi(videoId)
  } catch (e) {
    log('mobile API gagal:', e.message)
  }
  if (!item) {
    try {
      item = await fetchViaWebApi(videoId)
    } catch (e) {
      throw new Error(`semua metode gagal (${e.message})`)
    }
  }
  const r = normalize(item)
  if (!r.isSlideshow && !r.videoUrls.length) throw new Error('tidak ada URL video')
  return r
}

// CDN TikTok menolak permintaan tanpa header aplikasi
const DOWNLOAD_HEADERS = { 'User-Agent': MOBILE_UA, Referer: 'https://www.tiktok.com/', Accept: '*/*', 'Accept-Language': 'en-US,en;q=0.9', Range: 'bytes=0-' }

module.exports = { scrape, normalize, extractVideoId, DOWNLOAD_HEADERS, MOBILE_UA }
