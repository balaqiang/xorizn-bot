
import axios from 'axios'

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
	const client = conn || sock
	if (!text) {
		return reply(`*WhatsApp Channel Stalker (Kyzz API)*\n\nContoh:\n${usedPrefix}${command} https://whatsapp.com/channel/xxxxxx`)
	}

	reply(global.mess.wait)

	try {
		const apiUrl = global.API('kyzz', '/api/stalker/wa-sl-stalk', { url: text.trim() }, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 20000 })

		if (!data.status || !data.result) return reply('❌ Channel WhatsApp tidak ditemukan / link tidak valid.')
		const res = data.result
		const stlkText = `📢 *WHATSAPP CHANNEL STALKER*\n\n` +
			`📌 *Nama Channel:* ${res.name || res.title || '-'}\n` +
			`📝 *Deskripsi:* ${res.desc || res.description || '-'}\n` +
			`🔗 *Link:* ${text}`

		if (res.image || res.img || res.avatar) {
			return await client.sendMessage(m.chat, {
				image: { url: res.image || res.img || res.avatar },
				caption: stlkText
			}, { quoted: m })
		}
		return reply(stlkText)
	} catch (e) {
		console.error('[CHSTALK ERROR]', e.response?.data || e.message)
		return reply('❌ Terjadi kesalahan saat melakukan stalk Channel WhatsApp.')
	}
}

handler.help = ['chstalk <url_channel>', 'channelstalk <url_channel>']
handler.tags = ['stalker']
handler.command = ['chstalk', 'channelstalk']
handler.limit = true;
handler.register = true

export default handler
