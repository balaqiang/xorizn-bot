// Port dari 'plugin baru' (bratvermeil.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const sharp = require('sharp')

const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	if (!text) return reply(`Ketik teksnya!\n*Contoh:* \`${pfx}${command} vermeil manis\``);

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const buff = await global.fetchApi('kyzz', '/api/maker/brat-vermail', {
			text
		}, { responseType: 'arraybuffer' });

		const webpBuff = await sharp(buff)
			.resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
			.webp({ quality: 100 })
			.toBuffer();

		const stickerBuff = await global.addExif(webpBuff, global.packname || 'only', global.author || 'sahril2nd.dev');

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
		return await sock.sendMessage(m.chat, { sticker: stickerBuff }, { quoted: m });
	} catch (e) {
		console.error('[BRATVERMEIL ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal membuat brat vermeil: ${e.message}`);
	}
};

handler.help = ['bratvermeil <teks>'];
handler.tags = ['maker'];
handler.command = ['bratvermeil', 'bratvermail'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "sticker"})
