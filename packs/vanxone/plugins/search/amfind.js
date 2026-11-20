const axios = require('axios')
const cheerio = require('cheerio')

const BASE_URL = 'https://www.tiktok.com'

const headers = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
  Accept: 'application/json, text/plain, text/html, */*',
  Referer: 'https://www.tiktok.com/'
}

const formatAngka = value => Number(value || 0).toLocaleString('id-ID')
const formatWaktu = timestamp => {
  if (!timestamp) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'short',
    timeStyle: 'medium',
    timeZone: 'Asia/Jakarta'
  }).format(new Date(timestamp * 1000)) + ' WIB'
}

const extractPresetLinks = text => {
  const links = text.match(/https?:\/\/(?:www\.)?(?:alightcreative\.com\/am\/share\/|alight\.link\/)[^\s'"><]+/gi) || []
  const otherLinks = (text.match(/https?:\/\/[^\s'"><]+/gi) || []).filter(link => !links.includes(link))
  return { links, otherLinks }
}

async function JHAmFind(input) {
  const baseRes = { status: true, author_skrep: 'JH a.k.a Dhika', kesayangan: 'Fiony Alveria♡', data: null }
  try {
    const sumber = input.match(/https?:\/\/[^\s]+/i)?.[0]
    if (!sumber) throw new Error('Mane link VT-nye, brayy?\n\nContoh: .amfind https://vt.tiktok.com/ZSbHnpaX6/')
    let tautanAsli = sumber.replace(/[),.!?]+$/, '').trim()

    if (/vt\.tiktok\.com|vm\.tiktok\.com|\/t\//i.test(tautanAsli)) {
      const response = await axios.get(tautanAsli, { headers, maxRedirects: 5, timeout: 30000, validateStatus: () => true })
      tautanAsli = response.request?.res?.responseUrl || response.request?.responseURL || tautanAsli
    }

    const idVT = (tautanAsli.match(/(?:video|photo|v)\/(\d+)/i) || tautanAsli.match(/(\d{15,22})/))?.[1]
    if (!idVT) throw new Error('ID Video VT kaga nemu. Pastikan link TikTok valid.')

    let metaVT = { id: idVT }
    try {
      const response = await axios.get(`https://www.tiktok.com/@_/video/${idVT}`, { headers, timeout: 20000 })
      const $ = cheerio.load(response.data)
      const script = $('script#__UNIVERSAL_DATA_FOR_REHYDRATION__').html()
      if (script) {
        const parsed = JSON.parse(script)
        const scope = parsed?.__DEFAULT_SCOPE__ || {}
        const video = scope['webapp.video-detail']?.itemInfo?.itemStruct || scope['webapp.reflow.video.detail']?.itemInfo?.itemStruct
        if (video) {
          metaVT = {
            id: video.id,
            desc: video.desc || '',
            author: { username: video.author?.uniqueId || '', nickname: video.author?.nickname || '', verified: Boolean(video.author?.verified) },
            stats: { likes: video.stats?.diggCount || 0, comments: video.stats?.commentCount || 0, shares: video.stats?.shareCount || 0, views: video.stats?.playCount || 0 }
          }
        }
      }
    } catch {}

    const ditemukan = new Set()
    const hasilGacor = []
    let cursorUtama = 0, scanUtama = 0, scanBalasan = 0, hasMoreUtama = true

    while (hasMoreUtama && scanUtama < 100) {
      const response = await axios.get(`${BASE_URL}/api/comment/list/`, {
        headers, timeout: 20000,
        params: { aid: 1988, app_language: 'id', app_name: 'tiktok_web', aweme_id: idVT, count: 50, cursor: cursorUtama }
      })
      const data = response.data
      const komentar = data?.comments || []
      if (!komentar.length) break
      for (const k of komentar) {
        if (scanUtama >= 100) break
        scanUtama++
        const { links, otherLinks } = extractPresetLinks(k.text || '')
        for (const url of links) {
          if (ditemukan.has(url)) continue
          ditemukan.add(url)
          hasilGacor.push({ url, author: `@${k.user?.unique_id || 'unknown'} (${k.user?.nickname || '-'})`, source: 'Komentar Utama', likes: formatAngka(k.digg_count), date: formatWaktu(k.create_time), other_links: otherLinks })
        }
        if (Number(k.reply_comment_total || 0) > 0 && scanBalasan < 300) {
          let cursorBalas = 0, hasMoreBalas = true
          while (hasMoreBalas && scanBalasan < 300) {
            const replyResponse = await axios.get(`${BASE_URL}/api/comment/list/reply/`, {
              headers, timeout: 20000,
              params: { aid: 1988, app_language: 'id', app_name: 'tiktok_web', item_id: idVT, comment_id: k.cid, count: 20, cursor: cursorBalas }
            })
            const replyData = replyResponse.data
            const balasan = replyData?.comments || []
            if (!balasan.length) break
            for (const b of balasan) {
              if (scanBalasan >= 300) break
              scanBalasan++
              const { links: replyLinks, otherLinks: replyOtherLinks } = extractPresetLinks(b.text || '')
              for (const url of replyLinks) {
                if (ditemukan.has(url)) continue
                ditemukan.add(url)
                hasilGacor.push({ url, author: `@${b.user?.unique_id || 'unknown'} (${b.user?.nickname || '-'})`, source: `Balasan ke @${k.user?.unique_id || 'unknown'}`, likes: formatAngka(b.digg_count), date: formatWaktu(b.create_time), other_links: replyOtherLinks })
              }
            }
            hasMoreBalas = Boolean(replyData?.has_more)
            const nextCursor = replyData?.cursor
            if (nextCursor == null || String(nextCursor) === String(cursorBalas)) break
            cursorBalas = nextCursor
          }
        }
      }
      hasMoreUtama = Boolean(data?.has_more)
      const nextCursor = data?.cursor
      if (nextCursor == null || String(nextCursor) === String(cursorUtama)) break
      cursorUtama = nextCursor
    }

    baseRes.data = { video_info: metaVT, scan_stats: { main_comments: scanUtama, reply_comments: scanBalasan, total_preset_found: hasilGacor.length }, presets: hasilGacor }
    return baseRes
  } catch (err) {
    return { ...baseRes, status: false, error: err.response?.data?.status_msg || err.message || 'Terjadi kesalahan saat mengambil data TikTok.' }
  }
}

module.exports = {
  name: 'amfind',
  command: ['amfind', 'jh-amfind'],
  category: 'search',
  desc: 'Cari preset Alight Motion di komentar TikTok',
  usage: '<link tiktok>',
  run: async ({ sock, msg, from, args, text, prefix, reply }) => {
    if (!text?.trim()) {
      return reply(`Mane link VT-nye, brayy? 🗿\n\nContoh:\n${prefix}amfind https://vt.tiktok.com/ZSbHnpaX6/`)
    }

    await reply('⏳ Sabar brayy, lagi nyari preset Alight Motion...')
    const result = await JHAmFind(text.trim())
    if (!result.status) return reply(`❌ Gagal: ${result.error}`)

    const data = result.data
    const info = data.video_info
    const stats = data.scan_stats
    const presets = data.presets

    let output = `╭━━━「 JH AM FIND 」━━━╮\n┃ ✦ Creator: JH a.k.a Dhika\n┃ ♡ Kesayangan: Fiony Alveria♡\n╰━━━━━━━━━━━━━━━━━━╯\n\n`
    output += `乂 VIDEO INFO\n• ID: ${info.id || '-'}\n• Author: ${info.author?.nickname || '-'}\n• Username: @${info.author?.username || '-'}\n• Verified: ${info.author?.verified ? 'Ya' : 'Tidak diketahui'}\n• Views: ${formatAngka(info.stats?.views)}\n• Likes: ${formatAngka(info.stats?.likes)}\n• Comments: ${formatAngka(info.stats?.comments)}\n• Shares: ${formatAngka(info.stats?.shares)}\n\n`
    output += `乂 SCAN STATS\n• Komentar utama: ${stats.main_comments}\n• Balasan discan: ${stats.reply_comments}\n• Total preset: ${stats.total_preset_found}\n\n`

    if (!presets.length) {
      output += `Preset Alight Motion tidak ditemukan pada komentar yang berhasil discan.`
    } else {
      output += `乂 DAFTAR PRESET\n\n`
      for (let i = 0; i < presets.length; i++) {
        const p = presets[i]
        output += `${i + 1}. ${p.url}\n   • Author: ${p.author}\n   • Sumber: ${p.source}\n   • Likes: ${p.likes}\n   • Tanggal: ${p.date}\n`
        if (p.other_links?.length) output += `   • Link lain: ${p.other_links.join(', ')}\n`
        output += '\n'
      }
    }
    output += `\n© JH a.k.a Dhika — Fiony's Bot Admin`
    return reply(output.trim())
  }
}
