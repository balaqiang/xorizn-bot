// Port dari 'plugin baru' (bratvidv2.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	if (!text) return reply(`Ketik teksnya!\n*Contoh:* \`${pfx}${command} halo per kata cepat\``);

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const buff = await global.fetchApi('kyzz', '/api/maker/bratvid-v2', {
			text,
			theme: 'white',
			format: 'gif'
		}, { responseType: 'arraybuffer' });

		const webpBuff = await global.videoToWebp(buff);
		const stickerBuff = await global.addExif(webpBuff, global.packname || 'only', global.author || 'sahril2nd.dev');

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
		return await sock.sendMessage(m.chat, { sticker: stickerBuff }, { quoted: m });
	} catch (e) {
		console.error('[BRATVIDV2 ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal membuat brat video v2: ${e.message}`);
	}
};

handler.help = ['bratvidv2 <teks>'];
handler.tags = ['maker'];
handler.command = ['bratvidv2'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "sticker"})
