
import axios from 'axios'

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
	const client = conn || sock
	if (!text) {
		return reply(`*Discord Stalker (Kyzz API)*\n\nContoh:\n${usedPrefix}${command} 123456789012345678`)
	}

	reply(global.mess.wait)

	try {
		const apiUrl = global.API('kyzz', '/api/stalker/discord', { id: text.trim() }, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 20000 })

		if (!data.status || !data.result) return reply(`❌ User ID Discord *${text}* tidak ditemukan.`)
		const res = data.result
		const stlkText = `🎮 *DISCORD STALKER*\n\n` +
			`👤 *Global Name:* ${res.global_name || res.username || '-'}\n` +
			`🆔 *Username:* ${res.username || '-'}\n` +
			`🔢 *ID:* \`${res.id}\`\n` +
			`🎨 *Accent Color:* ${res.accent_color || '-'}\n` +
			`🖼️ *Avatar URL:* ${res.avatar || '-'}`

		if ($1) {
			return await client.sendButtons(m.chat, {
				location: {
					degreesLatitude: 0,
					degreesLongitude: 0,
					address: (global.botName || 'xorizn-bot'),
					jpegThumbnail: await (await fetch($1)).arrayBuffer()
				},
				text: '',
				footer: stlkText,
				buttons: [
					{
						displayText: `👑 ${global.namaOwner || 'Owner'}`,
						url: global.website || 'https://api.kyzzz.xyz'
					}
				]
			}, { quoted: m })
		}
		return reply(stlkText)
	} catch (e) {
		console.error('[DISCORD STALK ERROR]', e)
		return reply('❌ Terjadi kesalahan saat melakukan stalk Discord.')
	}
}

handler.help = ['discordstalk <user_id>', 'dcstalk <user_id>']
handler.tags = ['stalker']
handler.command = ['discordstalk', 'dcstalk']
handler.limit = true;
handler.register = true

export default handler
