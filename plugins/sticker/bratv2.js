// Port dari 'plugin baru' (bratv2.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const sharp = require('sharp')

const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	if (!text) return reply(`Gunakan format pemisah \`|\`\n*Contoh:* \`${pfx}${command} teks 1 | teks 2 | teks 3\``);

	const parts = text.split('|').map(s => s.trim()).filter(Boolean);
	const query = {
		text1: parts[0] || text,
		theme: 'white'
	};
	if (parts[1]) query.text2 = parts[1];
	if (parts[2]) query.text3 = parts[2];

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const buff = await global.fetchApi('kyzz', '/api/maker/brat-v2', query, { responseType: 'arraybuffer' });

		const webpBuff = await sharp(buff)
			.resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
			.webp({ quality: 100 })
			.toBuffer();

		const stickerBuff = await global.addExif(webpBuff, global.packname || 'only', global.author || 'sahril2nd.dev');

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
		return await sock.sendMessage(m.chat, { sticker: stickerBuff }, { quoted: m });
	} catch (e) {
		console.error('[BRATV2 ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal membuat brat v2: ${e.message}`);
	}
};

handler.help = ['bratv2 <teks1 | teks2>'];
handler.tags = ['maker'];
handler.command = ['bratv2'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "sticker"})
