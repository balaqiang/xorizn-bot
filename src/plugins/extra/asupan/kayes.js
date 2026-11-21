
import axios from 'axios'

const handler = async (m, { sock, reply }) => {
	reply(global.mess.wait)

	try {
		const apiUrl = global.API('kyzz', '/api/asupan/kayes', {}, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 15000 }).catch(() => ({ data: null }))

		let mediaUrl = apiUrl
		if (data) {
			if (typeof data === 'string' && data.startsWith('http')) mediaUrl = data
			else if (data.url) mediaUrl = data.url
			else if (data.result) mediaUrl = typeof data.result === 'string' ? data.result : (data.result.url || data.result.link)
		}

		await sock.sendMessage(m.chat, {
			video: { url: mediaUrl },
			caption: '🎥 *Asupan Kayes*',
			mimetype: 'video/mp4'
		}, { quoted: m }).catch(async () => {
			await sock.sendMessage(m.chat, {
				image: { url: mediaUrl },
				caption: '📸 *Asupan Kayes*'
			}, { quoted: m })
		})

	} catch (e) {
		console.error('[ASUPAN KAYES ERROR]', e)
		reply('❌ Gagal mengambil asupan Kayes.')
	}
}

handler.help = ['kayes']
handler.tags = ['asupan']
handler.command = ['kayes']
handler.limit = true;
handler.register = true

export default handler
