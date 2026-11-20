const sessionCounters = new Map();

const handler = async (m, { sock, text, reply, example }) => {
	if (!text) {
		return reply(`*Shizuku AI*\n\nContoh:\n${example('hai shizuku')}`);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

	try {
		const currentCount = (sessionCounters.get(m.sender) || 0) + 1;
		sessionCounters.set(m.sender, currentCount);

		const sessionCycle = Math.floor((currentCount - 1) / 20);
		const sessionId = `${m.sender}_${sessionCycle}`;

		const data = await global.fetchApi('kyzz', '/api/ai/shizuku', {
			message: text.trim(),
			session: sessionId
		});

		if (!data.status) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
			return reply(data.message || 'Terjadi kesalahan.');
		}

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
		return reply(data.reply);
	} catch (e) {
		console.error('[SHIZUKU ERROR]', e.response?.data || e.message);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		return reply('❌ Gagal menghubungi Shizuku.');
	}
};

handler.help = ['shizuku <pesan>'];
handler.tags = ['ai'];
handler.command = ['shizuku'];
handler.limit = true;

export default handler;