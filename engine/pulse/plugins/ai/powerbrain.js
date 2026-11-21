const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const botName = global.namaBot
	const query = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : '');

	if (!query) {
		return reply(
			`🧠 *POWERBRAIN AI ASSISTANT*\n\n` +
			`Format:\n` +
			`• \`${usedPrefix + command} <pertanyaan / prompt>\`\n` +
			`• Atau balas pesan dengan \`${usedPrefix + command}\`\n\n` +
			`*Contoh:*\n` +
			`• \`${usedPrefix + command} Siapa Ryo Yamada\``
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const json = await global.fetchApi('faa', 'faa/powerbrain-ai', {
			text: query.trim()
		});

		if (!json?.status || !json?.result) {
			throw new Error(json?.message || 'Server PowerBrain AI tidak memberikan respon valid.');
		}

		const resultText = (json.result || '').toString().trim();
		if (!resultText) {
			throw new Error('Jawaban dari PowerBrain AI kosong.');
		}

		await reply(`${resultText}\n\n© ${botName}`);
		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[POWERBRAIN ERROR]:', e.response?.data || e.message || e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal mengambil jawaban dari PowerBrain AI: ${e.response?.data?.message || e.message || e}`);
	}
};

handler.help = ['powerbrain <pertanyaan>', 'powerbrainai <pertanyaan>'];
handler.tags = ['ai'];
handler.command = ['powerbrain', 'powerbrainai'];
handler.limit = true;

export default handler;