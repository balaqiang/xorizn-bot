// Port dari 'plugin baru' (bratvidvermeil.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	if (!text) return reply(`Ketik teksnya!\n*Contoh:* \`${pfx}${command} vermeil gerak\``);

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const buff = await global.fetchApi('kyzz', '/api/maker/bratvid-vermeil', {
			text
		}, { responseType: 'arraybuffer' });

		const webpBuff = await global.videoToWebp(buff);
		const stickerBuff = await global.addExif(webpBuff, global.packname || 'only', global.author || 'xorizn-bot');

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
		return await sock.sendMessage(m.chat, { sticker: stickerBuff }, { quoted: m });
	} catch (e) {
		console.error('[BRATVIDVERMEIL ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal membuat brat video vermeil: ${e.message}`);
	}
};

handler.help = ['bratvidvermeil <teks>'];
handler.tags = ['maker'];
handler.command = ['bratvidvermeil', 'bratvidvermail', 'bratvermeilv', 'bratvermailv'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "sticker"})
