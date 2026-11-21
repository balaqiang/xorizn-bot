const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const botName = global.namaBot;
	const query = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : '');

	if (!query) {
		return reply(
			`🤖 *JARVIS MEME GENERATOR*\n\n` +
			`Format:\n` +
			`• \`${usedPrefix + command} <teks meme>\`\n` +
			`• Atau balas pesan dengan \`${usedPrefix + command}\`\n\n` +
			`*Contoh:*\n` +
			`• \`${usedPrefix + command} Jarvis, tolong nyalakan lampu kamar\``
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const res = await global.fetchApi('kyzz', 'api/meme/jarvis', {
			text: query.trim()
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
			throw new Error(res?.message || 'Gagal memproses gambar meme Jarvis.');
		} else {
			imageBuffer = Buffer.from(res);
		}

		const caption = [
			'🤖 *JARVIS MEME*',
			'─────────────────────────',
			`💬 "${query.trim()}"`,
			'',
			`© ${botName}`
		].join('\n');

		await sock.sendMessage(m.chat, {
			image: imageBuffer,
			caption
		}, { quoted: m });

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[MEME JARVIS ERROR]:', e.response?.data || e.message || e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal membuat meme Jarvis: ${e.response?.data?.message || e.message || e}`);
	}
};

handler.help = ['jarvis <teks>', 'memejarvis <teks>'];
handler.tags = ['maker', 'tools'];
handler.command = ['jarvis', 'memejarvis'];
handler.limit = true;

export default handler;