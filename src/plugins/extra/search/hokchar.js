// Feature: Honor of Kings Character Info
// Scraper: scrape/hok.js

import scrapeHokCharacter from '../../../scrape/hok.js'

const handler = async (m, { conn, sock, text, reply, usedPrefix, command }) => {
  const client = conn || sock

  if (!text) {
    return reply(`⚔️ *HONOR OF KINGS CHARACTER*\n\nMencari informasi lengkap karakter Honor of Kings.\n\nContoh:\n${usedPrefix}${command} Luban No.7\n${usedPrefix}${command} Wukong\n${usedPrefix}${command} Angela`)
  }

  await m.react('⏳')

  try {
    const data = await scrapeHokCharacter(text.trim())

    let caption = `⚔️ *HONOR OF KINGS — ${data.title.toUpperCase()}*\n\n`

    if (data.profile && Object.keys(data.profile).length > 0) {
      caption += `📋 *PROFIL KARAKTER:*\n`
      for (const [key, val] of Object.entries(data.profile)) {
        caption += `• *${key}:* ${val}\n`
      }
      caption += `\n`
    }

    if (data.skills && data.skills.length > 0) {
      caption += `⚡ *SKILLS:*\n`
      data.skills.forEach((skill) => {
        caption += `• ${skill}\n`
      })
      caption += `\n`
    }

    if (data.bio) {
      caption += `📖 *BIO:*\n${data.bio}\n\n`
    }

    if (data.lore) {
      const loreText = data.lore.length > 600 ? data.lore.slice(0, 600) + '...' : data.lore
      caption += `📜 *LORE / BACKGROUND:*\n${loreText}\n\n`
    }

    caption += `🔗 *Wiki:* ${data.url}`

    await m.react('✅')

    if (data.image) {
      return await client.sendMessage(
        m.chat,
        {
          image: { url: data.image },
          caption: caption.trim()
        },
        { quoted: m }
      )
    }

    return reply(caption.trim())
  } catch (e) {
    await m.react('❌')
    return reply(`❌ ${e.message || 'Terjadi kesalahan saat mencari karakter.'}`)
  }
}

handler.help = ['hokchar <nama>', 'hok <nama>']
handler.tags = ['search']
handler.command = /^(hokchar|hok|hokhero|herohok)$/i
handler.limit = true
handler.register = true

export default handler
