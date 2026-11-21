
import axios from 'axios'

const handler = async (m, { sock, conn, text, reply, usedPrefix, command }) => {
	const client = sock || conn || global.mainSock || global.conn
	const quotedText = m.quoted ? (m.quoted.text || m.quoted.caption || m.quoted.description || m.quoted.msg?.caption || m.quoted.msg?.text || '') : ''
	const rawInput = (text || quotedText || '').trim()
	const urlMatch = rawInput.match(/https?:\/\/(?:www\.|mobile\.)?capcut\.(?:com|net)\/[^\s]+/i) || rawInput.match(/https?:\/\/[^\s]+/i)
	const targetUrl = urlMatch ? urlMatch[0] : rawInput

	if (!targetUrl || !targetUrl.includes('capcut.')) {
		return reply(`*CapCut Downloader*\n\nContoh:\n${usedPrefix}${command} https://www.capcut.com/tv2/ZSqMCQMES/\nAtau reply pesan yang berisi link CapCut!`)
	}

	await global.react?.(client, m, 'loading')
	await reply(global.mess?.wait || '⏳ Sedang mengunduh...')

	try {
		const apiUrl = global.API('kyzz', '/api/download/capcut', { url: targetUrl }, 'apikey')
		const { data } = await axios.get(apiUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
			},
			timeout: 30000
		})

		if (!data?.status || !data?.result?.data) {
			await global.react?.(client, m, 'error')
			return reply('❌ Gagal mendapatkan data CapCut. Pastikan link publik!')
		}

		const resData = data.result.data
		const title = resData.title || 'CapCut Video'
		const mediaUrls = resData.mediaUrls || []

		const selectedMedia = mediaUrls.find(m => m.quality === 'hd_no_watermark') ||
			mediaUrls.find(m => m.quality === 'no_watermark') ||
			mediaUrls.find(m => m.type === 'video' || m.format === 'mp4') ||
			mediaUrls[0]

		if (!selectedMedia?.url) {
			await global.react?.(client, m, 'error')
			return reply('❌ Video CapCut tidak ditemukan.')
		}

		const caption = `*CapCut Downloader*\n\n📌 *Judul:* ${title}`

		await client.sendMessage(
			m.chat,
			{
				video: { url: selectedMedia.url },
				caption: caption,
				mimetype: 'video/mp4'
			},
			{ quoted: m }
		)

		await global.react?.(client, m, 'success')
	} catch (e) {
		console.error('[CAPCUT DOWNLOAD ERROR]', e.response?.data || e)
		await global.react?.(client, m, 'error')
		return reply('❌ Terjadi kesalahan saat mengunduh CapCut.')
	}
}

handler.help = ['capcut <url>']
handler.tags = ['downloader']
handler.command = ['capcut', 'capcutdl', 'cc', 'ccdl']
handler.limit = true
handler.register = true

export default handler
