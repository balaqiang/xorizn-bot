
import axios from 'axios'

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
	const client = conn || sock
	if (!text) {
		return reply(`*JKT48 Member Stalker (Kyzz API)*\n\nContoh:\n${usedPrefix}${command} freya`)
	}

	reply(global.mess.wait)

	try {
		const apiUrl = global.API('kyzz', '/api/stalker/jkt', { username: text.trim() }, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 20000 })

		if (!data.status || !data.result) return reply(`❌ Member JKT48 *${text}* tidak ditemukan.`)
		const res = data.result
		const stlkText = `🌸 *JKT48 MEMBER STALKER*\n\n` +
			`👤 *Nama:* ${res.name || res.nama || '-'}\n` +
			`🎂 *Tanggal Lahir:* ${res.birthdate || res.ttl || '-'}\n` +
			`🩸 *Golongan Darah:* ${res.blood_type || '-'}\n` +
			`📏 *Tinggi Badan:* ${res.height || '-'}\n` +
			`🏷️ *Generasi:* ${res.generation || '-'}`

		if (res.image || res.avatar) {
			return await client.sendMessage(m.chat, {
				image: { url: res.image || res.avatar },
				caption: stlkText
			}, { quoted: m })
		}
		return reply(stlkText)
	} catch (e) {
		console.error('[JKT48 STALK ERROR]', e)
		return reply('❌ Terjadi kesalahan saat melakukan stalk JKT48.')
	}
}

handler.help = ['jktstalk <nama/username>', 'jkt48stalk <nama/username>']
handler.tags = ['stalker']
handler.command = ['jktstalk', 'jkt48stalk']
handler.limit = true;
handler.register = true

export default handler
