const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const botName = global.namaBot
	const query = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : '');

	if (!query) {
		return reply(
			`🎨 *AI PROMPT GENERATOR*\n\n` +
			`Format:\n` +
			`• \`${usedPrefix + command} <deskripsi ide / konsep>\`\n` +
			`• Atau balas pesan dengan \`${usedPrefix + command}\`\n\n` +
			`*Contoh:*\n` +
			`• \`${usedPrefix + command} gambar naga di balik gunung es aesthetic 8k\``
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const json = await global.fetchApi('kyzz', 'api/ai/prompt-generator', {
			text: query.trim()
		});

		if (!json?.status || !json?.result) {
			throw new Error(json?.message || 'Server Prompt Generator tidak mengembalikan respon valid.');
		}

		const english = json.result.english || json.result.en || '-';
		const indonesian = json.result.indonesian || json.result.id || '-';

		const caption = [
			'✨ *AI PROMPT GENERATOR*',
			'─────────────────────────',
			`📌 *Input:* ${json.input || query.trim()}`,
			'',
			'🌐 *English (Stable Diffusion / Midjourney):*',
			`\`\`\`${english}\`\`\``,
			'',
			'🇮🇩 *Bahasa Indonesia:*',
			`\`\`\`${indonesian}\`\`\``,
			'',
			`© ${botName}`
		].join('\n');

		await reply(caption);
		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[PROMPT GEN ERROR]:', e.response?.data || e.message || e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal membuat prompt AI: ${e.response?.data?.message || e.message || e}`);
	}
};

handler.help = ['promptgen <deskripsi>', 'promptai <deskripsi>', 'genprompt <deskripsi>', 'prompt <deskripsi>'];
handler.tags = ['ai', 'tools'];
handler.command = ['promptgen', 'promptai', 'genprompt', 'prompt'];
handler.limit = true;

export default handler;