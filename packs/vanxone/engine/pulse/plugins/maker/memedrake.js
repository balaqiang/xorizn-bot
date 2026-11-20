const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const botName = global.namaBot;
	const query = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : '');

	if (!query || !query.includes('|')) {
		return reply(
			`🎭 *DRAKE MEME GENERATOR*\n\n` +
			`Format:\n` +
			`• \`${usedPrefix + command} teks atas | teks bawah\`\n` +
			`• Atau balas pesan dengan \`${usedPrefix + command} teks atas | teks bawah\`\n\n` +
			`*Contoh:*\n` +
			`• \`${usedPrefix + command} Belajar Coding | Rebahan Seharian\``
		);
	}

	const [teks1, teks2] = query.split('|').map(v => v.trim());
	if (!teks1 || !teks2) {
		return reply(
			`❌ *Format Tidak Lengkap!*\n\n` +
			`Teks atas dan teks bawah wajib diisi dan dipisahkan dengan tanda pipa (\`|\`).\n` +
			`*Contoh:* \`${usedPrefix + command} Belajar | Rebahan\``
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const res = await global.fetchApi('kyzz', 'api/meme/meme-drake', {
			teks1: teks1,
			teks2: teks2
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
			throw new Error(res?.message || 'Gagal memproses meme Drake.');
		} else {
			imageBuffer = Buffer.from(res);
		}

		const caption = [
			'🎭 *DRAKE MEME*',
			'─────────────────────────',
			`❌ ${teks1}`,
			`✅ ${teks2}`,
			'',
			`© ${botName}`
		].join('\n');

		await sock.sendMessage(m.chat, {
			image: imageBuffer,
			caption
		}, { quoted: m });

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[MEME DRAKE ERROR]:', e.response?.data || e.message || e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal membuat meme Drake: ${e.response?.data?.message || e.message || e}`);
	}
};

handler.help = ['memedrake <teks1>|<teks2>', 'drake <teks1>|<teks2>'];
handler.tags = ['maker', 'tools'];
handler.command = ['memedrake', 'drake'];
handler.limit = true;

export default handler;