const handler = async (m, { text, prefix, command, sock, reply }) => {
	const pfx = prefix || '.';

	if (!text) {
		return reply(
			`*Contoh:*\n\`${pfx + command} Halo dunia|sahrilrzy\``
		);
	}

	const [message, sender = global.namaOwner || m.pushName] = text.split('|');

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const buffer = await global.fetchApi('kyzz', '/api/canvas/quote-nokia', {
			message: message.trim(),
			sender: sender.trim()
		}, {
			responseType: 'arraybuffer'
		});

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

		return await sock.sendMessage(m.chat, {
			image: Buffer.from(buffer),
			mimetype: 'image/png',
			caption: `📱 *QUOTE NOKIA*\n\n💬 "${message.trim()}"\n👤 — *${sender.trim()}*`
		}, { quoted: m });

	} catch (e) {
		console.error('[QUOTE NOKIA ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply('❌ Gagal membuat Quote Nokia.');
	}
};

handler.help = ['quotenokia'];
handler.tags = ['maker'];
handler.command = ['quotenokia', 'qnokia'];
handler.limit = true;

export default handler;