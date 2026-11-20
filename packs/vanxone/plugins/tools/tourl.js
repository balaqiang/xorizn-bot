// Port dari 'plugin baru' (tourl.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const fs = require('fs')
const os = require('os')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
const { fileTypeFromBuffer } = S

async function uploadNekohime(filePath) {
	const form = new FormData()
	form.append('file', fs.createReadStream(filePath))
	const res = await axios.post('https://cdn.nekohime.site/upload', form, {
		headers: form.getHeaders()
	})
	const files = res.data?.files
	const url = Array.isArray(files) ? files[0]?.url : files
	if (!url) throw new Error('URL tidak ditemukan di response Nekohime')
	return url
}

async function uploadZass(buffer, ext, mime) {
	const form = new FormData()
	form.append('file', buffer, { filename: `${Date.now()}.${ext}`, contentType: mime })
	const res = await axios.post('https://cdn.zass.in/upload', form, {
		headers: form.getHeaders()
	})
	if (!res.data?.url) throw new Error('Gagal upload ke Zass CDN')
	return res.data.url
}

async function uploadTmpfiles(buffer, ext, mime) {
	const form = new FormData()
	form.append('file', buffer, { filename: `${Date.now()}.${ext}`, contentType: mime })
	const res = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
		headers: form.getHeaders()
	})
	if (res.data?.status !== 'success' || !res.data?.data?.url) throw new Error('Gagal upload ke Tmpfiles')
	return res.data.data.url
}

async function uploadUguu(filePath, ext, mime) {
	const form = new FormData()
	form.append('files[]', fs.createReadStream(filePath), { filename: `${Date.now()}.${ext}`, contentType: mime })
	const res = await axios.post('https://uguu.se/upload', form, {
		headers: form.getHeaders()
	})
	if (!res.data?.files?.[0]?.url) throw new Error('Gagal upload ke Uguu')
	return res.data.files[0].url
}

const SERVERS = {
	nekohime: { label: 'Nekohime CDN',     fn: (buf, ext, mime, filePath) => uploadNekohime(filePath) },
	zass:     { label: 'Zass CDN',         fn: (buf, ext, mime, filePath) => uploadZass(buf, ext, mime) },
	tmpfiles: { label: 'Tmpfiles',         fn: (buf, ext, mime, filePath) => uploadTmpfiles(buf, ext, mime) },
	uguu:     { label: 'Uguu (permanent)', fn: (buf, ext, mime, filePath) => uploadUguu(filePath, ext, mime) }
}

const handler = async (m, { sock, args, command, reply, usedPrefix }) => {

	if (command === 'tourlmultiserver') {
		const filePath = args[0]
		const serverId = args[1]

		const server = SERVERS[serverId]
		if (!server) return reply('Server tidak dikenali.')
		// pengamanan: hanya berkas sementara buatan .tourl yang boleh diunggah (cegah baca berkas server sembarang)
		const _safe = filePath && path.resolve(filePath).startsWith(os.tmpdir() + path.sep) && path.basename(filePath).startsWith('tourl_')
		if (!_safe || !fs.existsSync(filePath)) return reply(`File sudah tidak ada, silakan ulangi ${usedPrefix}tourl`)

		await m.react('⌛')

		try {
			const buffer = fs.readFileSync(filePath)
			const type = (await fileTypeFromBuffer(buffer)) || { ext: 'bin', mime: 'application/octet-stream' }

			const url = await server.fn(buffer, type.ext, type.mime, filePath)

			await S.sendButtons(sock, m.chat, {
				text: `Berhasil upload ke *${server.label}*

*URL:* ${url}
*Tipe:* ${type.mime}`,
				footer: `© ${global.namaBot} - uploader`,
				buttons: [
					{ displayText: 'Open', url: url },
					{ displayText: 'Copy', copy: url }
				]
			}, { quoted: m })

		} catch (err) {
			console.error('[tourl] Gagal upload:', err)
			reply(`❌ Gagal mengunggah ke ${server.label}.\n${err.message}`)
		} finally {
			try { fs.unlinkSync(filePath) } catch {}
		}
		return
	}

	const q = m.quoted ? m.quoted : m

	let msgContent = q.message || q
	if (msgContent.documentWithCaptionMessage) msgContent = msgContent.documentWithCaptionMessage.message
	if (msgContent.viewOnceMessageV2) msgContent = msgContent.viewOnceMessageV2.message

	const targetMedia = msgContent.imageMessage || msgContent.videoMessage || msgContent.audioMessage || msgContent.stickerMessage || msgContent.documentMessage || null
	const mime = targetMedia ? targetMedia.mimetype : (q.msg || q).mimetype || ''

	if (!mime) return reply(`Reply foto/video/sticker, atau kirim dengan caption *${usedPrefix + command}*`)

	await m.react('⌛')

	const buffer = await q.download()
	if (!buffer) return reply('❌ Gagal mengunduh media.')

	const detected = (await fileTypeFromBuffer(buffer)) || null
	const ext = detected?.ext || (mime.split('/')[1] || 'bin')
	const realMime = detected?.mime || mime

	const tmpPath = path.join(os.tmpdir(), `tourl_${Date.now()}.${ext}`)
	fs.writeFileSync(tmpPath, buffer)

	const rows = Object.entries(SERVERS).map(([id, { label }]) => ({
		title: label,
		description: '',
		id: `${usedPrefix}tourlmultiserver ${tmpPath} ${id}`
	}))

	await sock.sendButtons(m.chat, {
		text: `Pilih server upload:`,
		footer: `© ${global.namaBot} - uploader`,
		buttons: [
			{
				sectionTitle: `${global.namaBot} - uploader`,
				title: `Upload now`,
				rows
			}
		]
	}, { quoted: m })
}

handler.command = ['tourl', 'tourlmultiserver']
handler.limit = true;

module.exports = S.wrap(handler, {"category": "tools", "extra": ["upload"]})
