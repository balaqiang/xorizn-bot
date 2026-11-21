
import axios from 'axios'

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
	if (!text) {
		return reply(`*Mobile Legends Stalker (Kyzz API)*\n\nContoh:\n${usedPrefix}${command} 12345678|1234`)
	}

	const parts = text.split('|').map(s => s.trim())
	if (parts.length < 2) return reply(`❌ Masukkan format ID|ZoneId\nContoh: ${usedPrefix}${command} 12345678|1234`)

	reply(global.mess.wait)

	try {
		const apiUrl = global.API('kyzz', '/api/stalker/ml', { id: parts[0], zone_id: parts[1] }, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 20000 })

		if (!data.status || !data.result) return reply('❌ Akun Mobile Legends tidak ditemukan / ID salah.')
		const res = data.result
		const caption = `🎮 *MOBILE LEGENDS STALKER*\n\n` +
			`👤 *Nickname:* ${res.username || res.nickname || '-'}\n` +
			`🆔 *User ID:* ${parts[0]}\n` +
			`🌐 *Zone ID:* ${parts[1]}`

		return reply(caption)
	} catch (e) {
		console.error('[ML STALK ERROR]', e)
		return reply('❌ Terjadi kesalahan saat melakukan stalk Mobile Legends.')
	}
}

handler.help = ['mlstalk <id>|<zone_id>', 'mlbbstalk <id>|<zone_id>']
handler.tags = ['stalker']
handler.command = ['mlstalk', 'mlbbstalk']
handler.limit = true;
handler.register = true

export default handler
