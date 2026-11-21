
import axios from 'axios'

const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const quotedText = m.quoted ? (m.quoted.text || m.quoted.caption || m.quoted.description || m.quoted.msg?.caption || m.quoted.msg?.text || '') : ''
	const rawInput = (text || quotedText || '').trim()
	const urlMatch = rawInput.match(/https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[^\s]+/i) || rawInput.match(/https?:\/\/[^\s]+/i)
	const targetUrl = urlMatch ? urlMatch[0] : rawInput

	if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
		return reply(`*Twitter / X Downloader*\n\nContoh:\n${usedPrefix}${command} https://x.com/user/status/123456789\nAtau reply pesan yang berisi link Twitter/X!`)
	}

	reply(global.mess.wait)

	try {
		const apiUrl = global.API('kyzz', '/api/download/twitter', { url: targetUrl }, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 20000 }).catch(() => ({ data: null }))

		if (data && data.status && data.result) {
			const res = data.result
			const mediaUrl = res.url || res.video || res.HD || res.SD
			if (mediaUrl) {
				if (mediaUrl.includes('.mp4')) {
					return await sock.sendMessage(m.chat, { video: { url: mediaUrl }, caption: `🐦 *Twitter/X Media*\n\n${res.caption || ''}` }, { quoted: m })
				} else {
					return await sock.sendMessage(m.chat, { image: { url: mediaUrl }, caption: `🐦 *Twitter/X Media*\n\n${res.caption || ''}` }, { quoted: m })
				}
			}
		}

		return reply('❌ Gagal mengambil media dari Twitter/X.')
	} catch (e) {
		console.error('[TWITTER ERROR]', e)
		return reply('❌ Terjadi kesalahan saat mengunduh dari Twitter/X.')
	}
}

handler.help = ['twitter <url>']
handler.tags = ['downloader']
handler.command = ['twitter','twit']
handler.limit = true;
handler.register = true

export default handler
