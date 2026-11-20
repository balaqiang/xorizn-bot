const handler = async (m, { sock }) => {
	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const buffer = await global.fetchApi('kyzz', '/api/image/neko', {}, {
			responseType: 'arraybuffer',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
			}
		});

		await sock.sendMessage(m.chat, { react: { text: '🐱', key: m.key } }).catch(() => null);

		const caption = `🐱 *NEKO*\n\n© ${global.namaBot}`;

		return await sock.sendMessage(m.chat, {
			image: Buffer.from(buffer),
			caption: caption
		}, { quoted: m });

	} catch (e) {
		console.error('[NEKO ERROR]:', e.message);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return m.reply('❌ Gagal mengambil gambar Neko.');
	}
};

handler.command = ['neko'];
handler.limit = true;

export default handler;