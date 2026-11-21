const handler = async (m, { text, prefix, command, sock, reply }) => {
	const pfx = prefix || '.';

	if (!text) {
		return reply(
			`*Contoh:*\n\`${pfx + command} test|sahril2nd\``
		);
	}

	const [msg, author = global.namaOwner || m.pushName] = text.split('|');

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const buffer = await global.fetchApi('kyzz', '/api/canvas/reminder', {
			text: msg.trim(),
			author: author.trim()
		}, {
			responseType: 'arraybuffer'
		});

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

		return await sock.sendMessage(m.chat, {
			image: Buffer.from(buffer),
			caption: `📌 *REMINDER*\n\n📝 "${msg.trim()}"\n👤 — *${author.trim()}*`
		}, { quoted: m });

	} catch (e) {
		console.error('[REMINDER ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply('❌ Gagal membuat reminder.');
	}
};

handler.help = ['reminder'];
handler.tags = ['maker'];
handler.command = ['reminder'];
handler.limit = true;

export default handler;