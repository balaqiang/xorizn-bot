
const handler = async (m, { sock, conn, text, usedPrefix, command, reply }) => {
  const client = sock || conn || global.mainSock
  if (!text) {
    return reply(`✈️ *TELEGRAM CHANNEL STALKER*\n\nMasukkan username channel Telegram!\n\nContoh:\n${usedPrefix}${command} @username`)
  }

  const cleanUsername = text.trim().startsWith('@') ? text.trim() : `@${text.trim()}`
  reply(global.mess?.wait || '⏳ Mohon tunggu, sedang mencari data channel Telegram...')

  try {
    const url = global.API('kyzz', '/api/stalker/telegram-channel', { username: cleanUsername }, 'apikey')
    const res = await fetch(url)
    const json = await res.json()

    if (!json.status || !json.id) {
      return reply(`❌ Channel Telegram *${cleanUsername}* tidak ditemukan.`)
    }

    const caption = `✈️ *TELEGRAM CHANNEL STALKER*\n\n` +
      `📛 *Title:* ${json.title || '-'}\n` +
      `🆔 *ID:* ${json.id || '-'}\n` +
      `🏷️ *Username:* ${json.username || cleanUsername}\n` +
      `📝 *Description:* ${json.description || '-'}\n` +
      `👥 *Subscribers:* ${json.subscribers || '-'}\n` +
      `📁 *Type:* ${json.type || '-'}\n` +
      `✅ *Verified:* ${json.verified ? 'Yes' : 'No'}\n` +
      `🚫 *Restricted:* ${json.restricted ? 'Yes' : 'No'}\n` +
      `🔗 *Link:* ${json.link || `https://t.me/${user}`}`

    if (json.photoUrl) {
      await client.sendMessage(m.chat, {
        image: { url: json.photoUrl },
        caption
      }, { quoted: m })
    } else {
      await reply(caption)
    }

  } catch (e) {
    console.error('[TGCHANNEL ERROR]', e)
    return reply(`❌ Terjadi kesalahan saat stalk channel Telegram:\n${e.message}`)
  }
}

handler.help = ['tgchannel <username>', 'telegramchannel <username>']
handler.tags = ['stalker']
handler.command = ['tgchannel']
handler.limit = true
handler.register = true

export default handler
