
import axios from 'axios'

const handler = async (m, { conn, sock, text, reply, usedPrefix, command }) => {
	const client = conn || sock
	if (!text) {
		return reply(`*Lirik Lagu Search*\n\nContoh:\n${usedPrefix}${command} Komang - Raim Laode\n${usedPrefix}${command} Die With A Smile`)
	}

	reply(`⏳ Mencari lirik lagu *"${text}"*...`)

	try {
		const apiUrl = global.API('kyzz', '/api/search/lyrics', { query: text }, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 15000 }).catch(() => ({ data: null }))

		if (data && data.status && data.result) {
			const res = data.result
			const caption = `🎵 *LYRICS SEARCH*\n\n` +
				`📌 *Judul:* ${res.title || text}\n` +
				`👤 *Artis:* ${res.artist || '-'}\n\n` +
				`📜 *Lirik:* \n\n${res.lyrics || res.lirik}`

			if (res.image || res.thumb) {
				return await client.sendMessage(m.chat, { image: { url: res.image || res.thumb }, caption }, { quoted: m })
			} else {
				return reply(caption)
			}
		}

		const fbRes = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(text)}`, { timeout: 10000 }).catch(() => null)
		if (fbRes?.data?.lyrics) {
			const res = fbRes.data
			const caption = `🎵 *LYRICS SEARCH*\n\n` +
				`📌 *Judul:* ${res.title || text}\n` +
				`👤 *Artis:* ${res.artist || '-'}\n\n` +
				`📜 *Lirik:* \n\n${res.lyrics}`

			if (res.image) {
				return await client.sendMessage(m.chat, { image: { url: res.image }, caption }, { quoted: m })
			} else {
				return reply(caption)
			}
		}

		return reply(`❌ Lirik lagu *"${text}"* tidak ditemukan.`)
	} catch (e) {
		console.error('[LYRICS SEARCH ERROR]', e)
		return reply('❌ Terjadi kesalahan saat mencari lirik lagu.')
	}
}

handler.help = ['lirik <judul_lagu>', 'lyrics <judul_lagu>']
handler.tags = ['search']
handler.command = ['lirik', 'lyrics', 'lyric']
handler.limit = true;
handler.register = true

export default handler
