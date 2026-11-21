const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const botName = global.namaBot
	const query = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : '');

	if (!query) {
		return reply(
			`🔍 *FELO AI SEARCH ASSISTANT*\n\n` +
			`Format:\n` +
			`• \`${usedPrefix + command} <pertanyaan / topik pencarian>\`\n` +
			`• Atau balas pesan dengan \`${usedPrefix + command}\`\n\n` +
			`*Contoh:*\n` +
			`• \`${usedPrefix + command} Apa itu bot wa\``
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const json = await global.fetchApi('faa', 'faa/feloai', {
			text: query.trim()
		});

		if (!json?.status || !json?.result) {
			throw new Error(json?.message || 'Gagal mendapatkan respon dari server Felo AI.');
		}

		let hasil = (json.result || '').toString().trim();
		if (!hasil) {
			throw new Error('Jawaban Felo AI kosong.');
		}

		if (Array.isArray(json.sources) && json.sources.length > 0) {
			const sumber = json.sources
				.slice(0, 5)
				.map((v, i) => `${i + 1}. *${v.title || 'Sumber'}*\n🔗 ${v.url}`)
				.join('\n\n');

			hasil += `\n\n📚 *Sumber Referensi:*\n${sumber}`;
		}

		await reply(`${hasil}\n\n© ${botName}`);
		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[FELO AI ERROR]:', e.response?.data || e.message || e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal mengambil data dari Felo AI: ${e.response?.data?.message || e.message || e}`);
	}
};

handler.help = ['felo <pertanyaan>', 'feloai <pertanyaan>'];
handler.tags = ['ai', 'search'];
handler.command = ['felo', 'feloai'];
handler.limit = true;

export default handler;