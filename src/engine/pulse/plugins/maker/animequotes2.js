const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const botName = global.namaBot;
	const query = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : '');

	if (!query) {
		return reply(
			`🌸 *ANIME QUOTES MAKER*\n\n` +
			`Format:\n` +
			`• \`${usedPrefix + command} <quotes> | <username> | <no background>\`\n` +
			`• Atau balas pesan teks dengan \`${usedPrefix + command} <quotes>\`\n\n` +
			`*Contoh:*\n` +
			`• \`${usedPrefix + command} Hidup ini penuh kejutan | Elysia | 5\`\n` +
			`_(Username & Background bersifat opsional, background valid: 1, 4, 5, 6, 7, 8, 9, 10)_`
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const parts = query.split('|').map(v => v.trim());
		const quoteText = parts[0] || query;
		const username = parts[1] || m.pushName || 'Elysia';

		const validBgs = [1, 4, 5, 6, 7, 8, 9, 10];
		let bgNum = parseInt(parts[2], 10);
		if (isNaN(bgNum) || !validBgs.includes(bgNum)) {
			bgNum = validBgs[Math.floor(Math.random() * validBgs.length)];
		}

		const res = await global.fetchApi('kyzz', 'api/canvas/anime-quotes', {
			text: quoteText,
			username: username,
			background: bgNum
		}, {
			responseType: 'arraybuffer'
		});

		let imageBuffer;
		if (Buffer.isBuffer(res)) {
			imageBuffer = res;
		} else if (res?.data && Buffer.isBuffer(res.data)) {
			imageBuffer = res.data;
		} else if (res instanceof ArrayBuffer) {
			imageBuffer = Buffer.from(res);
		} else if (typeof res === 'object' && res?.status === false) {
			throw new Error(res?.message || 'Gagal memproses gambar Anime Quotes.');
		} else {
			imageBuffer = Buffer.from(res);
		}

		const caption = [
			'🌸 *ANIME QUOTES CARD*',
			'─────────────────────────',
			`💬 *Quotes:* "${quoteText}"`,
			`👤 *User:* ${username}`,
			`🖼️ *Background:* #${bgNum}`,
			'',
			`© ${botName}`
		].join('\n');

		await sock.sendMessage(m.chat, {
			image: imageBuffer,
			caption
		}, { quoted: m });

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (err) {
		console.error('[ANIMEQUOTES2 ERROR]:', err.response?.data || err.message || err);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal membuat anime quotes: ${err.response?.data?.message || err.message || err}`);
	}
};

handler.help = ['animequotes2 <quotes>|<user>|<bg>', 'animequote2 <quotes>'];
handler.tags = ['maker', 'anime'];
handler.command = ['animequotes2', 'animequote2', 'quotesanime2', 'qanime2'];
handler.limit = true;

export default handler;