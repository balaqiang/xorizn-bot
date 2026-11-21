
import axios from 'axios'

const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const quotedText = m.quoted ? (m.quoted.text || m.quoted.caption || m.quoted.description || m.quoted.msg?.caption || m.quoted.msg?.text || '') : ''
	const rawInput = (text || quotedText || '').trim()
	const urlMatch = rawInput.match(/https?:\/\/(?:www\.)?mediafire\.com\/[^\s]+/i) || rawInput.match(/https?:\/\/[^\s]+/i)
	const targetUrl = urlMatch ? urlMatch[0] : rawInput

	if (!targetUrl || !targetUrl.includes('mediafire.com')) {
		return reply(`*MediaFire Downloader*\n\nContoh:\n${usedPrefix}${command} https://www.mediafire.com/file/bmvz1yq81hbrg69/ALYA+v12.zip/file\nAtau reply pesan yang berisi link MediaFire!`)
	}

	reply(global.mess.wait)

	try {
		const apiUrl = global.API('kyzz', '/api/download/mediafire', { url: targetUrl }, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 20000 })

		if (!data.status || !data.result) {
			return reply('❌ Gagal mengunduh file MediaFire dari API.')
		}

		const { title, size, link, mime: apiMime } = data.result

		const extMimeMap = {
			zip: 'application/zip',
			rar: 'application/x-rar-compressed',
			'7z': 'application/x-7z-compressed',
			tar: 'application/x-tar',
			gz: 'application/gzip',
			pdf: 'application/pdf',
			apk: 'application/vnd.android.package-archive',
			mp4: 'video/mp4',
			mp3: 'audio/mpeg',
			jpg: 'image/jpeg',
			jpeg: 'image/jpeg',
			png: 'image/png',
			webp: 'image/webp',
			txt: 'text/plain',
			doc: 'application/msword',
			docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			xls: 'application/vnd.ms-excel',
			xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		}

		let fileName = title || 'mediafire_file'
		const extMatch = fileName.match(/\.([a-zA-Z0-9]+)$/)
		const ext = extMatch ? extMatch[1].toLowerCase() : ''
		const mimetype = apiMime || extMimeMap[ext] || 'application/zip'

		const caption = `📁 *MEDIAFIRE DOWNLOADER*\n\n` +
			`📄 *Nama:* ${fileName}\n` +
			`📦 *Ukuran:* ${size || '-'}\n\n` +
			`⏳ Mengirim berkas...`

		await sock.sendMessage(m.chat, { text: caption }, { quoted: m })

		await sock.sendMessage(m.chat, {
			document: { url: link },
			fileName: fileName,
			mimetype: mimetype
		}, { quoted: m })

	} catch (e) {
		console.error('[MEDIAFIRE ERROR]', e.response?.data || e)
		return reply('❌ Terjadi kesalahan saat mengunduh berkas MediaFire.')
	}
}

handler.help = ['mediafire <url>']
handler.tags = ['downloader']
handler.command = ['mediafire', 'mf']
handler.limit = true;

handler.register = true

export default handler
