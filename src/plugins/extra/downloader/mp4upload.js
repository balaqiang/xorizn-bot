
import axios from 'axios'

const handler = async (m, { conn, sock, text, reply, usedPrefix, command }) => {
	const client = conn || sock
	const quotedText = m.quoted ? (m.quoted.text || m.quoted.caption || m.quoted.description || m.quoted.msg?.caption || m.quoted.msg?.text || '') : ''
	const rawInput = (text || quotedText || '').trim()
	const urlMatch = rawInput.match(/https?:\/\/(?:www\.)?mp4upload\.com\/[^\s]+/i) || rawInput.match(/https?:\/\/[^\s]+/i)
	const targetUrl = urlMatch ? urlMatch[0] : rawInput

	if (!targetUrl || !targetUrl.includes('mp4upload.com')) {
		return reply(`*Mp4Upload Downloader*\n\nContoh:\n${usedPrefix}${command} https://www.mp4upload.com/xxxx\nAtau reply pesan yang berisi link Mp4Upload!`)
	}

	reply(global.mess?.wait || '⏳ Sedang memproses file Mp4Upload...')

	try {
		const apiUrl = typeof global.API === 'function'
			? global.API('kyzz', '/api/download/mp4upload', { url: targetUrl.trim() }, 'apikey')
			: `https://api.kyzzz.xyz/api/download/mp4upload?url=${encodeURIComponent(targetUrl.trim())}&apikey=${global.APIKeys?.['https://api.kyzzz.xyz'] || ''}`

		const { data } = await axios.get(apiUrl, { timeout: 25000 })

		if (!data.status) {
			return reply(`❌ Gagal: ${data.error || 'Terjadi kesalahan saat memproses URL Mp4Upload.'}`)
		}

		const directUrl = data.directUrl || data.url || data.downloadUrl || data.result?.directUrl || data.result?.url || data.result?.downloadUrl
		const fileName = data.fileName || data.title || data.result?.fileName || data.result?.title || 'video.mp4'
		const fileSize = data.fileSize || data.size || data.result?.fileSize || data.result?.size || '-'
		const mimeType = data.mimeType || data.result?.mimeType || 'video/mp4'

		if (!directUrl) {
			return reply('❌ Gagal mendapatkan direct link file video.')
		}

		const caption = `🎬 *MP4UPLOAD DOWNLOADER*\n\n` +
			`📄 *Nama:* ${fileName}\n` +
			`📦 *Ukuran:* ${fileSize}\n` +
			`🔗 *Direct Link:* ${directUrl}\n\n` +
			`⏳ Mengirim video/berkas...`

		await client.sendMessage(m.chat, { text: caption }, { quoted: m })

		await client.sendMessage(m.chat, {
			video: { url: directUrl },
			caption: `🎬 ${fileName}`,
			mimetype: 'video/mp4'
		}, { quoted: m }).catch(async () => {
			await client.sendMessage(m.chat, {
				document: { url: directUrl },
				fileName: fileName,
				mimetype: mimeType
			}, { quoted: m })
		})

	} catch (e) {
		console.error('[MP4UPLOAD ERROR]', e.response?.data || e)
		return reply('❌ Terjadi kesalahan saat mengunduh video Mp4Upload.')
	}
}

handler.help = ['mp4upload <url>']
handler.tags = ['downloader']
handler.command = ['mp4upload', 'mp4u', 'mp4uploaddl']
handler.limit = true;
handler.register = true

export default handler
