const handler = async (m, { sock, text, reply, example }) => {
	if (!text) return reply(example('hai'));

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

	try {
		const data = await global.fetchApi('kyzz', '/api/ai/alya', {
			message: text,
			session: m.sender
		});

		if (!data.status) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
			return reply(data.message || 'Terjadi kesalahan dari API.');
		}

		const responseText = data.reply || data.result?.reply || data.result || 'Tidak ada balasan.';

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
		return reply(responseText);

	} catch (e) {
		console.error('[ALYA ERROR]', e.response?.data || e.message);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		return reply('❌ Gagal menghubungi Alya.');
	}
};

handler.help = ['alya <pesan>'];
handler.tags = ['ai'];
handler.command = ['alya'];
handler.limit = true;

export default handler;