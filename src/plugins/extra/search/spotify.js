
import axios from 'axios'

const handler = async (m, { conn, sock, text, reply, usedPrefix, command }) => {
	const client = conn || sock
	if (!text) {
		return reply(`*Spotify Track Search*\n\nContoh:\n${usedPrefix}${command} Heavy Is The Crown\n${usedPrefix}${command} Feast Peradaban`)
	}

	reply(`⏳ Mencari lagu di Spotify untuk *"${text}"*...`)

	try {
		const apiUrl = global.API('kyzz', '/api/search/spotify', { query: text }, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 15000 }).catch(() => ({ data: null }))

		let tracks = []
		if (data && data.status && Array.isArray(data.result)) {
			tracks = data.result
		}

		if (tracks.length === 0) {
			return reply(`❌ Lagu *"${text}"* tidak ditemukan di Spotify.`)
		}

		const listRows = tracks.slice(0, 10).map((item, idx) => ({
			title: `${idx + 1}. ${(item.title || item.name || '').slice(0, 20)}`,
			description: `Artis: ${item.artist || item.artists || '-'} • Durasi: ${item.duration || '-'}`,
			id: `${usedPrefix}play ${item.title || item.name} ${item.artist || ''}`
		}))

		const listMessage = {
			title: '🎧 HASIL SPOTIFY SEARCH',
			sections: [{ title: `Pencarian: ${text}`, rows: listRows }]
		}

		if (client.relayMessage) {
			return await client.relayMessage(
				m.chat,
				{
					viewOnceMessage: {
						message: {
							interactiveMessage: {
								body: { text: `🎧 *SPOTIFY TRACK SEARCH*\n\nDitemukan *${tracks.length}* lagu untuk *"${text}"*.\nKlik tombol di bawah untuk memutar lagu:` },
								footer: { text: `© ${global.botName || 'xorizn-bot'} • Spotify` },
								nativeFlowMessage: {
									buttons: [{
										name: "single_select",
										buttonParamsJson: JSON.stringify(listMessage)
									}]
								}
							}
						}
					}
				},
				{ quoted: m }
			)
		} else {
			let caption = `🎧 *SPOTIFY TRACK SEARCH*\n\n`
			tracks.slice(0, 10).forEach((t, i) => {
				caption += `*${i + 1}. ${t.title || t.name}*\n   👤 Artis: ${t.artist || '-'}\n   🔗 Link: ${t.url || '-'}\n\n`
			})
			return reply(caption)
		}
	} catch (e) {
		console.error('[SPOTIFY SEARCH ERROR]', e)
		return reply('❌ Terjadi kesalahan saat mencari di Spotify.')
	}
}

handler.help = ['spotify <judul_lagu>', 'spotisearch <judul_lagu>']
handler.tags = ['search']
handler.command = ['spotify', 'spotisearch', 'spsearch']
handler.limit = true;
handler.register = true

export default handler
