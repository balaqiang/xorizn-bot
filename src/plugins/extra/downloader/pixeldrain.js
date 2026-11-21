
import axios from 'axios'

const handler = async (m, { conn, sock, text, reply, usedPrefix, command }) => {
	const client = conn || sock
	const quotedText = m.quoted ? (m.quoted.text || m.quoted.caption || m.quoted.description || m.quoted.msg?.caption || m.quoted.msg?.text || '') : ''
	const rawInput = (text || quotedText || '').trim()
	const urlMatch = rawInput.match(/https?:\/\/(?:www\.)?pixeldrain\.com\/[^\s]+/i) || rawInput.match(/https?:\/\/[^\s]+/i)
	const targetUrl = urlMatch ? urlMatch[0] : rawInput

	if (!targetUrl || !targetUrl.includes('pixeldrain.com')) {
		return reply(`*Pixeldrain Downloader*\n\nContoh:\n${usedPrefix}${command} https://pixeldrain.com/u/KdRTpxHE\nAtau reply pesan yang berisi link Pixeldrain!`)
	}

	reply(global.mess?.wait || '⏳ Sedang memproses file Pixeldrain...')

	try {
		const apiUrl = typeof global.API === 'function' 
			? global.API('kyzz', '/api/download/pixeldrain', { url: targetUrl.trim() }, 'apikey')
			: `https://api.kyzzz.xyz/api/download/pixeldrain?url=${encodeURIComponent(targetUrl.trim())}&apikey=${global.APIKeys?.['https://api.kyzzz.xyz'] || ''}`

		const { data } = await axios.get(apiUrl, { timeout: 25000 })

		if (!data.status) {
			return reply(`❌ Gagal: ${data.error || 'Terjadi kesalahan saat memproses URL Pixeldrain.'}`)
		}

		const directUrl = data.directUrl || data.url || data.result?.directUrl || data.result?.url
		const fileName = data.fileName || data.result?.fileName || 'pixeldrain_file'
		const fileSize = data.fileSize || data.result?.fileSize || '-'
		const mimeType = data.mimeType || data.result?.mimeType || 'application/octet-stream'

		if (!directUrl) {
			return reply('❌ Gagal mendapatkan direct link file.')
		}

		const caption = `📁 *PIXELDRAIN DOWNLOADER*\n\n` +
			`📄 *Nama:* ${fileName}\n` +
			`📦 *Ukuran:* ${fileSize}\n` +
			`🔗 *Direct Link:* ${directUrl}\n\n` +
			`⏳ Mengirim berkas...`

		await client.sendMessage(m.chat, { text: caption }, { quoted: m })

		await client.sendMessage(m.chat, {
			document: { url: directUrl },
			fileName: fileName,
			mimetype: mimeType
		}, { quoted: m })

	} catch (e) {
		console.error('[PIXELDRAIN ERROR]', e.response?.data || e)
		return reply('❌ Terjadi kesalahan saat mengunduh berkas Pixeldrain.')
	}
}

handler.help = ['pixeldrain <url>']
handler.tags = ['downloader']
handler.command = ['pixeldrain', 'pxl', 'pxldl']
handler.limit = true;
handler.register = true

export default handler
