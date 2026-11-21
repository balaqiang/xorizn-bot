
const handler = async (m, { sock, conn, text, usedPrefix, command, reply }) => {
  const client = sock || conn || global.mainSock
  if (!text) {
    return reply(`✈️ *TELEGRAM GROUP STALKER*\n\nMasukkan username grup Telegram!\n\nContoh:\n${usedPrefix}${command} @AwasPhpJir`)
  }

  const cleanUsername = text.trim().startsWith('@') ? text.trim() : `@${text.trim()}`
  reply(global.mess?.wait || '⏳ Mohon tunggu, sedang mencari data grup Telegram...')

  try {
    const url = global.API('kyzz', '/api/stalker/telegram-group', { username: cleanUsername }, 'apikey')
    const res = await fetch(url)
    const json = await res.json()

    if (!json.status || !json.id) {
      return reply(`❌ Grup Telegram *${cleanUsername}* tidak ditemukan.`)
    }

    const caption = `✈️ *TELEGRAM GROUP STALKER*\n\n` +
      `📛 *Title:* ${json.title || '-'}\n` +
      `🆔 *ID:* ${json.id || '-'}\n` +
      `🏷️ *Username:* ${json.username || cleanUsername}\n` +
      `📝 *Description:* ${json.description || '-'}\n` +
      `👥 *Members:* ${json.members || '-'}\n` +
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
    console.error('[TGGROUP ERROR]', e)
    return reply(`❌ Terjadi kesalahan saat stalk grup Telegram:\n${e.message}`)
  }
}

handler.help = ['tggroup <username>', 'telegramgroup <username>']
handler.tags = ['stalker']
handler.command = ['tggroup', 'telegramgroup', 'tggroupstalk']
handler.limit = true
handler.register = true

export default handler
