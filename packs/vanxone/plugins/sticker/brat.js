// Port dari 'plugin baru' (brat.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const bratGen = async (...a) => (await import('brat-canvas')).bratGen(...a)

const handler = async (m, { sock, text, usedPrefix, reply }) => {
	const input = text || m.quoted?.text || m.quoted?.body
	if (!input) return reply(`Contoh: ${usedPrefix}brat halo semua`)
	if (input.length > 200) return reply('Teks terlalu panjang! Maksimal 200 karakter.')

	try {
		await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

		const img = await bratGen(input)
		await sock.sendImageAsSticker(m.chat, img, m, {
			packname: global.packname,
			author: global.author
		})

		await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
	} catch (err) {
		console.error(err)
		reply('Gagal membuat brat, coba lagi.')
	}
}

handler.command = ['brat']
handler.limit = true;

module.exports = S.wrap(handler, {"category": "sticker"})
