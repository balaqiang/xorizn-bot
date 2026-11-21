// Port dari 'plugin baru' (hd.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const {downloadMediaMessage} = require('@whiskeysockets/baileys')
const {hdr, reminiHDFallback} = require('../../lib/engine/core/hd')

const handler = async (m, { sock, reply, usedPrefix, command }) => {
	const botName = global.namaBot;
	const quoted = m.quoted ? m.quoted : m;
	const mime = (quoted.msg || quoted).mimetype || quoted.mediaType || '';

	if (!/image\/(jpe?g|png)/.test(mime)) {
		return reply(
			'*AI IMAGE HD & UPSCALE*\n\n' +
			'Format:\n' +
			'- Balas atau kirim gambar dengan `' + usedPrefix + command + '`\n\n' +
			'*Perintah:*\n' +
			'- `' + usedPrefix + 'hd` (Peningkatan 2x)\n' +
			'- `' + usedPrefix + 'hdr` (Peningkatan 4x)'
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '\u23F3', key: m.key } }).catch(() => null);

	try {
		let media;
		if (typeof quoted.download === 'function') {
			media = await quoted.download();
		} else {
			media = await downloadMediaMessage(quoted, 'buffer', {});
		}

		if (!media) throw new Error('Gagal mengunduh gambar.');

		const scale = /^hdr$/i.test(command) ? 4 : 2;
		let resultBuffer = null;

		try {
			resultBuffer = await hdr(media, scale);
		} catch (e) {
			console.warn('[iLoveIMG Error] Mengalihkan ke Remini Fallback:', e.message);
			resultBuffer = await reminiHDFallback(media);
		}

		if (!resultBuffer) throw new Error('Gambar hasil upscale tidak ditemukan.');

		const caption = [
			'*AI IMAGE ENHANCE / HD*',
			'----------------------------------------',
			'*Tingkat Scale:* ' + scale + 'x',
			'*Status:* Berhasil dijernihkan',
			'',
			`© ${botName}`
		].join('\n');

		await sock.sendMessage(
			m.chat,
			{
				image: resultBuffer,
				caption
			},
			{ quoted: m }
		);

		await sock.sendMessage(m.chat, { react: { text: '\u2728', key: m.key } }).catch(() => null);

	} catch (err) {
		console.error('[HD ERROR]:', err);
		await sock.sendMessage(m.chat, { react: { text: '\u274C', key: m.key } }).catch(() => null);
		return reply('Gagal memproses gambar: ' + (err.message || err));
	}
};

handler.help = ['hd', 'hdr'];
handler.tags = ['tools'];
handler.command = ['hd', 'hdr'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "tools"})
