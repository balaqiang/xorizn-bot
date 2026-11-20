import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://winbu.net'
const INDEX_URLS = [
    `${BASE_URL}/anime-terbaru-animasu/`,
    `${BASE_URL}/animedonghua/`,
    `${BASE_URL}/`
]
const DATA_DIR = path.join(process.cwd(), 'src', 'data')
const SENT_FILE = path.join(DATA_DIR, 'autoanime_winbu_sent.json')
const STATE_FILE = path.join(DATA_DIR, 'autoanime_winbu_state.json')
const MAX_AGE_HOURS = 24
const DEFAULT_INTERVAL_MINUTES = 5

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': BASE_URL
}

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function loadSent() {
    try {
        if (!fs.existsSync(SENT_FILE)) return new Set()
        const raw = JSON.parse(fs.readFileSync(SENT_FILE, 'utf8'))
        if (!Array.isArray(raw)) return new Set()
        return new Set(raw.filter(Boolean).map(String))
    } catch {
        return new Set()
    }
}

function saveSent(set) {
    try {
        ensureDataDir()
        const values = [...set].filter(Boolean)
        // Batasi file agar riwayat tidak tumbuh tanpa batas.
        const maxEntries = 5000
        fs.writeFileSync(SENT_FILE, JSON.stringify(values.slice(-maxEntries), null, 2))
    } catch (e) {
        console.error('[AutoAnime-Winbu] Gagal menyimpan riwayat:', e.message)
    }
}

function defaultState() {
    return { enabled: false, groups: [], interval: DEFAULT_INTERVAL_MINUTES }
}

function loadState() {
    try {
        if (!fs.existsSync(STATE_FILE)) return defaultState()
        const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
        const groups = Array.isArray(parsed?.groups) ? parsed.groups.filter(g => typeof g === 'string' && g.endsWith('@g.us')) : []
        const interval = Number(parsed?.interval)
        return {
            enabled: Boolean(parsed?.enabled),
            groups: [...new Set(groups)],
            interval: Number.isFinite(interval) && interval >= 1 && interval <= 60 ? Math.floor(interval) : DEFAULT_INTERVAL_MINUTES
        }
    } catch {
        return defaultState()
    }
}

function saveState(state) {
    try {
        ensureDataDir()
        const groups = Array.isArray(state?.groups) ? [...new Set(state.groups.filter(g => typeof g === 'string' && g.endsWith('@g.us')))] : []
        const interval = Number(state?.interval)
        fs.writeFileSync(STATE_FILE, JSON.stringify({
            enabled: Boolean(state?.enabled),
            groups,
            interval: Number.isFinite(interval) && interval >= 1 && interval <= 60 ? Math.floor(interval) : DEFAULT_INTERVAL_MINUTES
        }, null, 2))
    } catch (e) {
        console.error('[AutoAnime-Winbu] Gagal menyimpan state:', e.message)
    }
}

async function fetchPage(url) {
    const res = await axios.get(url, {
        headers: HEADERS,
        timeout: 30000,
        maxRedirects: 5,
        validateStatus: status => status >= 200 && status < 400
    })
    return String(res.data)
}

function normalizeUrl(href, base = BASE_URL) {
    try {
        return new URL(href, base).href
    } catch {
        return ''
    }
}

function getSlug(url) {
    try {
        const pathname = new URL(url).pathname.replace(/\/+$/, '')
        const parts = pathname.split('/').filter(Boolean)
        return parts.at(-1) || pathname
    } catch {
        return url
    }
}

function isAnimeDetailUrl(url) {
    try {
        const pathname = new URL(url).pathname.toLowerCase()
        return pathname.includes('/anime/') || pathname.includes('/series/') || /anime|donghua/.test(pathname)
    } catch {
        return false
    }
}

function extractAnimeItems(html, sourceUrl) {
    const $ = cheerio.load(html)
    const list = []

    // Selector lama tetap dipakai bila tersedia, tetapi sekarang fallback ke link episode/series yang terlihat di halaman.
    $('.movies-list-wrap .ml-item, .film_list-wrap .flw-item, .film_list .flw-item').each((_, item) => {
        const anchor = $(item).find('a.ml-mask, a.film-poster-ahref, a').first()
        const href = anchor.attr('href') || ''
        const title = (anchor.attr('title') || $(item).find('.film-name, .film-name a').first().text() || '').trim()
        if (!href || !title) return
        const url = normalizeUrl(href, sourceUrl)
        if (!url || !isAnimeDetailUrl(url)) return
        const img = $(item).find('img').first()
        const cover = normalizeUrl(img.attr('data-original') || img.attr('data-src') || img.attr('src') || '', sourceUrl)
        list.push({ title, url, slug: getSlug(url), cover })
    })

    if (list.length === 0) {
        $('a').each((_, anchor) => {
            const href = $(anchor).attr('href') || ''
            const title = ($(anchor).attr('title') || $(anchor).text() || '').replace(/\s+/g, ' ').trim()
            if (!href || !title || title.length < 2) return
            const url = normalizeUrl(href, sourceUrl)
            if (!url || !isAnimeDetailUrl(url)) return
            if (!/(episode|season|anime|donghua)/i.test(title + ' ' + href)) return
            const parent = $(anchor).closest('.ml-item, .flw-item, .item, article')
            const img = parent.find('img').first()
            const cover = normalizeUrl(img.attr('data-original') || img.attr('data-src') || img.attr('src') || '', sourceUrl)
            list.push({ title, url, slug: getSlug(url), cover })
        })
    }

    return list
}

async function getOngoingAnimeList() {
    const all = new Map()

    for (const sourceUrl of INDEX_URLS) {
        try {
            const html = await fetchPage(sourceUrl)
            for (const item of extractAnimeItems(html, sourceUrl)) {
                const key = item.url.replace(/\/$/, '').toLowerCase()
                if (!all.has(key)) all.set(key, item)
            }
        } catch (e) {
            console.warn(`[AutoAnime-Winbu] Gagal membaca ${sourceUrl}: ${e.message}`)
        }
    }

    return [...all.values()]
}

function parseEpisodeNumber(value) {
    const text = String(value || '')
    const match = text.match(/(?:episode|ep)\s*[-_.:# ]*([0-9]+)/i)
    return match ? Number(match[1]) : null
}

async function getLatestEpisodeLink(animeUrl) {
    const html = await fetchPage(animeUrl)
    const $ = cheerio.load(html)
    const candidates = []

    $('a[href*="episode" i], a[href*="/ep" i], .list-episode a, .episodes a, .epslistplace a').each((_, el) => {
        const href = $(el).attr('href') || ''
        if (!href) return
        const fullUrl = normalizeUrl(href, animeUrl)
        if (!fullUrl) return
        const text = $(el).text().replace(/\s+/g, ' ').trim()
        const number = parseEpisodeNumber(`${text} ${fullUrl}`)
        candidates.push({ number, text, url: fullUrl })
    })

    if (candidates.length === 0) return null

    // Bila nomor episode tersedia, pilih nomor terbesar. Ini mencegah selector .first() mengambil episode lama.
    candidates.sort((a, b) => {
        if (a.number !== null && b.number !== null && a.number !== b.number) return b.number - a.number
        if (a.number !== null) return -1
        if (b.number !== null) return 1
        return 0
    })

    const latest = candidates[0]
    const epNum = latest.number ?? 'Latest'
    return {
        number: epNum,
        text: latest.text || `Episode ${epNum}`,
        url: latest.url
    }
}

async function getEpisodeTime(episodeUrl) {
    try {
        const html = await fetchPage(episodeUrl)
        const $ = cheerio.load(html)

        const metaTime = $('meta[property="article:published_time"]').attr('content') ||
            $('meta[property="og:updated_time"]').attr('content') ||
            $('meta[itemprop="datePublished"]').attr('content')
        if (metaTime) return metaTime

        const timeEl = $('time[datetime], time').first()
        if (timeEl.length) {
            const dt = timeEl.attr('datetime')
            if (dt) return dt
            const txt = timeEl.text().trim()
            if (txt) return txt
        }

        const dateText = ($('.post-date, .entry-date, .published, .cInfo .iho, .item-content .item-meta').first().text() || '').trim()
        if (dateText) return dateText

        const bodyText = $('body').text().replace(/\s+/g, ' ')
        const match = bodyText.match(/(\d+)\s+(hours?|days?|minutes?|seconds?)\s+ago/i)
        return match ? match[0] : null
    } catch {
        return null
    }
}

function parseRelativeTimeToHours(timeStr) {
    if (!timeStr) return null
    const input = String(timeStr).trim()

    const relative = input.match(/(?:about\s*)?(\d+)\s+(hour|day|minute|second)s?\s+ago/i)
    if (relative) {
        const value = Number(relative[1])
        switch (relative[2].toLowerCase()) {
            case 'hour': return value
            case 'day': return value * 24
            case 'minute': return value / 60
            case 'second': return value / 3600
        }
    }

    const timestamp = Date.parse(input)
    if (!Number.isNaN(timestamp)) {
        return Math.max(0, (Date.now() - timestamp) / 3600000)
    }

    return null
}

function getQualityValue(quality) {
    const match = String(quality || '').match(/(\d{3,4})p/i)
    return match ? Number(match[1]) : 0
}

async function getDownloadLink(episodeUrl) {
    const html = await fetchPage(episodeUrl)
    const $ = cheerio.load(html)
    const options = []

    $('.download-eps ul li, .download-eps li, .dlbox li, .download-list li').each((_, el) => {
        const quality = ($(el).find('strong, b, .quality').first().text() || $(el).text()).replace(/\s+/g, ' ').trim()
        if (!quality) return
        $(el).find('a').each((__, linkEl) => {
            const provider = $(linkEl).text().replace(/\s+/g, ' ').trim()
            const href = normalizeUrl($(linkEl).attr('href') || '', episodeUrl)
            if (!href) return
            const haystack = `${provider} ${href}`.toLowerCase()
            if (!haystack.includes('pixeldrain')) return
            const value = getQualityValue(quality)
            // Fitur mensyaratkan minimal 720p; jangan lagi mengirim 480/360p.
            if (value >= 720) options.push({ host: 'Pixeldrain', url: href, quality: `${value}p`, value })
        })
    })

    if (options.length === 0) return null
    options.sort((a, b) => b.value - a.value)
    const best = options[0]
    return { host: best.host, url: best.url, quality: best.quality }
}

function resolvePixeldrainPageUrl(rawUrl) {
    const value = String(rawUrl || '').trim()
    if (!value) return ''
    const id = (value.match(/pixeldrain\.(?:com|net)\/(?:u|d|api\/file|l)\/([a-zA-Z0-9_-]+)/i) || [])[1]
    if (id) return `https://pixeldrain.com/u/${id}`
    return value
}

function formatSize(b) {
    const bytes = Number(b)
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 4)
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`
}

function makeDeliveryKey(episodeKey, groupId) {
    return `${episodeKey}::${groupId}`
}

async function notifyAndSend(sock, groupIds, linkObj, meta, sent = new Set(), episodeKey = '') {
    if (!sock) throw new Error('Socket WhatsApp belum tersedia')
    const pageUrl = resolvePixeldrainPageUrl(linkObj?.url)
    if (!pageUrl) throw new Error('Link Pixeldrain tidak valid')

    let coverBuffer = null
    if (meta?.cover) {
        try {
            const res = await axios.get(meta.cover, {
                responseType: 'arraybuffer',
                timeout: 15000,
                headers: HEADERS,
                maxRedirects: 5
            })
            coverBuffer = Buffer.from(res.data)
        } catch (e) {
            console.log(`[AutoAnime-Winbu] ⚠️ Cover gagal: ${e.message}`)
        }
    }

    const caption =
        `*ANIME UPDATE! ✨*\n\n` +
        `📺 Judul: *${meta.title}*\n` +
        `🎞️ Episode: ${meta.episode}\n` +
        `📊 Kualitas: *${linkObj.quality}*\n\n` +
        `🔗 *Pixeldrain*`

    let success = 0
    for (const gid of [...new Set(groupIds || [])]) {
        const deliveryKey = episodeKey ? makeDeliveryKey(episodeKey, gid) : ''
        if (deliveryKey && sent.has(deliveryKey)) continue

        try {
            const payload = coverBuffer
                ? { image: coverBuffer, caption }
                : { text: caption }

            await sock.sendMessage(gid, {
                ...payload,
                footer: 'Link download resmi dari halaman sumber.',
                interactiveButtons: [
                    {
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: `Buka ${linkObj.quality}`,
                            url: pageUrl
                        })
                    }
                ]
            })

            if (deliveryKey) sent.add(deliveryKey)
            success++
            console.log(`[AutoAnime-Winbu] ✅ Notified ${gid}: ${meta.title} ${meta.episode}`)
            await new Promise(r => setTimeout(r, 1500))
        } catch (e) {
            console.error(`[AutoAnime-Winbu] ❌ Send error ${gid}:`, e.message)
        }
    }

    return success
}

let autoInterval = null
let running = false
let globalSock = null
let checkInProgress = false

async function runCheck(sock = globalSock) {
    if (checkInProgress) {
        console.log('[AutoAnime-Winbu] ⏭️ Check sebelumnya masih berjalan')
        return { skipped: true, sent: 0 }
    }
    checkInProgress = true

    try {
        const state = loadState()
        const groups = state.groups || []
        if (!groups.length) {
            console.log('[AutoAnime-Winbu] ⚠️ No target groups configured')
            return { skipped: false, sent: 0 }
        }
        if (!sock) throw new Error('Socket WhatsApp belum tersedia')

        const sent = loadSent()
        console.log(`[AutoAnime-Winbu] 🔍 Check: ${new Date().toLocaleString('id-ID')}`)

        const animeList = await getOngoingAnimeList()
        if (!animeList.length) {
            console.log('[AutoAnime-Winbu] Tidak ada anime ditemukan')
            return { skipped: false, sent: 0 }
        }

        let sentCount = 0
        for (const anime of animeList) {
            try {
                const episodeData = await getLatestEpisodeLink(anime.url)
                if (!episodeData) continue

                const episodeKey = `${anime.slug}-${episodeData.number}`
                const deliveredToAll = groups.every(g => sent.has(makeDeliveryKey(episodeKey, g)))
                // Kompatibilitas dengan format lama: key episode lama dianggap sudah terkirim.
                if (sent.has(episodeKey) || deliveredToAll) continue

                const timeStr = await getEpisodeTime(episodeData.url)
                const hours = parseRelativeTimeToHours(timeStr)
                if (hours !== null && (hours < 0 || hours > MAX_AGE_HOURS)) continue

                const linkObj = await getDownloadLink(episodeData.url)
                if (!linkObj) continue

                const delivered = await notifyAndSend(sock, groups, linkObj, {
                    title: anime.title,
                    episode: episodeData.text,
                    cover: anime.cover || ''
                }, sent, episodeKey)

                if (delivered > 0) {
                    sentCount += delivered
                    saveSent(sent)
                }

                await new Promise(r => setTimeout(r, 2000))
            } catch (e) {
                console.error(`[AutoAnime-Winbu] ❌ Error ${anime.title}:`, e.message)
            }
        }

        console.log(`[AutoAnime-Winbu] ✅ Check complete, ${sentCount} pengiriman berhasil`)
        return { skipped: false, sent: sentCount }
    } finally {
        checkInProgress = false
    }
}

function startAutoCheck(_sock, _intervalMinutes = DEFAULT_INTERVAL_MINUTES) {
    // Globally disabled in this build.
    stopAutoCheck()
    return false
}


function stopAutoCheck() {
    if (autoInterval) clearInterval(autoInterval)
    autoInterval = null
    running = false
}

function isRunning() {
    return running
}

function initAutoStart(_sock) {
    // AutoAnime is intentionally disabled; never restore or schedule background sends.
    return false
}


export {
    loadSent,
    saveSent,
    loadState,
    saveState,
    getOngoingAnimeList,
    getLatestEpisodeLink,
    getEpisodeTime,
    getDownloadLink,
    notifyAndSend,
    startAutoCheck,
    stopAutoCheck,
    initAutoStart,
    runCheck,
    isRunning,
    formatSize
}
