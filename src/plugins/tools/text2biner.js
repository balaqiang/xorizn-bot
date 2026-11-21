// Port dari 'plugin baru' (text2biner.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const input = text || (m.quoted && (m.quoted.text || m.quoted.caption));

	if (!input) {
		return reply(
			`🚩 *TEXT TO BINARY*\n\n` +
			`Masukkan teks yang ingin diubah menjadi kode biner!\n\n` +
			`*Contoh Penggunaan:*\n` +
			`\`${pfx + command} Halo dunia\``
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const binary = input.split('').map(char => {
			return char.charCodeAt(0).toString(2).padStart(8, '0');
		}).join(' ');

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

		return await reply(`✨ *HASIL TEXT TO BINARY:*\n\n\`\`\`${binary}\`\`\``);

	} catch (e) {
		console.error('[TEXT2BINER ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ *Error:* ${e.message || e}`);
	}
};

handler.help = ['text2biner <teks>'];
handler.tags = ['tools'];
handler.command = ['text2biner', 'texttobinary'];
handler.limit = true

module.exports = S.wrap(handler, {"category": "tools"})
