
import axios from 'axios'

const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const quotedText = m.quoted ? (m.quoted.text || m.quoted.caption || m.quoted.description || m.quoted.msg?.caption || m.quoted.msg?.text || '') : ''
	const rawInput = (text || quotedText || '').trim()
	const urlMatch = rawInput.match(/https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+/i) || rawInput.match(/https?:\/\/[^\s]+/i)
	const targetUrl = urlMatch ? urlMatch[0] : rawInput

	if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
		return reply(`*YouTube Video Downloader*\n\nContoh:\n${usedPrefix}${command} https://youtu.be/xxxxxx\nAtau reply pesan yang berisi link YouTube!`)
	}

	reply(global.mess.wait)

	try {
		const apiUrl = global.API('kyzz', '/api/download/ytmp4', { url: targetUrl }, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 25000 })

		if (data && data.status && data.result) {
			const res = data.result
			const videoUrl = res.download || res.url || res.link
			const title = res.title || 'YouTube Video'

			if (videoUrl) {
				return await sock.sendMessage(m.chat, {
					video: { url: videoUrl },
					caption: `🎥 *YOUTUBE MP4*\n\n📌 *Judul:* ${title}`,
					mimetype: 'video/mp4'
				}, { quoted: m })
			}
		}

		return reply('❌ Gagal mengunduh video YouTube. Pastikan link valid!')
	} catch (e) {
		console.error('[YTMP4 ERROR]', e)
		return reply('❌ Terjadi kesalahan saat mengunduh video YouTube.')
	}
}

handler.help = ['ytmp4 <url>']
handler.tags = ['downloader']
handler.command = ['ytmp4', 'ytv']
handler.limit = true;
handler.register = true

export default handler
