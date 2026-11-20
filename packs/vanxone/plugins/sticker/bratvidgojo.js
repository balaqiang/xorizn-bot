// Port dari 'plugin baru' (bratvidgojo.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	if (!text) return reply(`Ketik teksnya!\n*Contoh:* \`${pfx}${command} hollow purple\``);

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const buff = await global.fetchApi('kyzz', '/api/maker/brat-gojov', {
			text
		}, { responseType: 'arraybuffer' });

		const webpBuff = await global.videoToWebp(buff);
		const stickerBuff = await global.addExif(webpBuff, global.packname || 'only', global.author || 'sahril2nd.dev');

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
		return await sock.sendMessage(m.chat, { sticker: stickerBuff }, { quoted: m });
	} catch (e) {
		console.error('[BRATGOJOV ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal membuat brat video gojo: ${e.message}`);
	}
};

handler.help = ['bratgojov <teks>'];
handler.tags = ['maker'];
handler.command = ['bratvidgojo', 'bratgojov'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "sticker"})
