const handler = async (m, { sock }) => {
	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const buffer = await global.fetchApi('kyzz', '/api/image/papayang', {}, {
			responseType: 'arraybuffer',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
			}
		});

		await sock.sendMessage(m.chat, { react: { text: '📱', key: m.key } }).catch(() => null);

		const caption = `📱 *PAP AYANG*\n\n© ${global.namaBot}`;

		return await sock.sendMessage(m.chat, {
			image: Buffer.from(buffer),
			caption: caption
		}, { quoted: m });

	} catch (e) {
		console.error('[PAPAYANG ERROR]:', e.message);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return m.reply('❌ Gagal mengambil gambar Pap Ayang.');
	}
};

handler.command = ['papayang', 'papdoi'];
handler.limit = true;

export default handler;