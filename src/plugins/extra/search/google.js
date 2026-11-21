// Feature: Google Search / News
// Scraper: scrape/google.js

import { GoogleSearch } from '../../../scrape/google.js'

const handler = async (m, { text, reply, usedPrefix, command }) => {
  if (!text) {
    return reply(`🔍 *GOOGLE SEARCH*\n\nPencarian informasi & berita Google.\n\nContoh:\n${usedPrefix}${command} Berita teknologi terbaru\n${usedPrefix}${command} AI Gemini`)
  }

  await m.react('⏳')

  try {
    const res = await GoogleSearch(text.trim())

    if (!res.status || !res.results || res.results.length === 0) {
      await m.react('✖️')
      return reply(`❌ Tidak ditemukan hasil untuk *"${text}"*.`)
    }

    await m.react('✅')

    const items = res.results.slice(0, 10)
    let caption = `🌐 *GOOGLE SEARCH RESULTS*\n\n`
    caption += `🔎 *Query:* ${text}\n`
    caption += `📊 *Ditemukan:* ${res.results.length} hasil\n\n`
    caption += `──────────────────\n\n`

    items.forEach((item, idx) => {
      caption += `*${idx + 1}. ${item.resource_title}*\n`
      if (item.origin_node) caption += `   🏢 Sumber: *${item.origin_node}*\n`
      if (item.temporal_stamp) caption += `   🕒 Waktu: ${item.temporal_stamp}\n`
      caption += `   🔗 Link: ${item.resolved_endpoint}\n\n`
    })

    return reply(caption.trim())
  } catch (e) {
    await m.react('❌')
    return reply(`❌ Terjadi kesalahan: ${e.message || String(e)}`)
  }
}

handler.help = ['google <query>', 'googlesearch <query>', 'gnews <query>']
handler.tags = ['search']
handler.command = /^(google|googlesearch|gsearch|gnews)$/i
handler.limit = true
handler.register = true

export default handler
