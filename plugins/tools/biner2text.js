// Port dari 'plugin baru' (biner2text.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const input = text || (m.quoted && (m.quoted.text || m.quoted.caption));

	if (!input) {
		return reply(
			`🚩 *BINARY TO TEXT*\n\n` +
			`Masukkan kode biner yang ingin diubah menjadi teks biasa!\n\n` +
			`*Contoh Penggunaan:*\n` +
			`\`${pfx + command} 01001000 01100001 01101100 01101111\``
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const binary = input.trim().replace(/\s+/g, '');

		if (!/^[01]+$/.test(binary)) {
			throw new Error('Input hanya boleh berisi angka 0 dan 1.');
		}

		if (binary.length % 8 !== 0) {
			throw new Error('Format biner tidak valid (panjang bit harus kelipatan 8 bit).');
		}

		const chunks = binary.match(/.{1,8}/g);
		const result = chunks.map(bin => String.fromCharCode(parseInt(bin, 2))).join('');

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

		return await reply(`✨ *HASIL BINARY TO TEXT:*\n\n\`\`\`${result}\`\`\``);

	} catch (e) {
		console.error('[BINER2TEXT ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ *Error:* ${e.message || e}`);
	}
};

handler.help = ['biner2text <kode biner>'];
handler.tags = ['tools'];
handler.command = ['biner2text', 'binarytotext'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "tools"})
