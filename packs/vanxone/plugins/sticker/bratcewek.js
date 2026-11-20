// Port dari 'plugin baru' (bratcewek.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const handler = async (m, { sock, text, prefix, command, reply }) => {
	const p = prefix || '.';
	const input = text || (m.quoted && (m.quoted.text || m.quoted.caption));

	if (!input) {
		return reply(
			'🖼️ *BRAT CEWEK STICKER*\n\n' +
			'> Masukkan teks\n\n' +
			`\`Contoh: ${p + command} Hai semua\``
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		// Ambil base URL murni dari settings.js
		const baseUrl = global.APIs.deline;
		const stickerUrl = `${baseUrl}/maker/cewekbrat?text=${encodeURIComponent(input.trim())}`;

		await sock.sendImageAsSticker(m.chat, stickerUrl, m, {
			packname: global.packname,
			author: global.author
		});

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[BRAT CEWEK ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply('❌ Gagal membuat sticker, API sedang bermasalah.');
	}
};

handler.help = ['bratcewek <teks>', 'cewekbrat <teks>', 'bratgirl <teks>'];
handler.tags = ['maker'];
handler.command = ['bratcewek', 'cewekbrat', 'bratperempuan', 'bratgirl'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "sticker"})
