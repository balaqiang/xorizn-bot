const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const query = text || m.quoted?.text || '';

	if (!query) {
		return reply(`Gunakan format:\n*${pfx}${command} <pertanyaan/teks>*\n\nContoh:\n*${pfx}${command} Apa hukumnya Menikahi cwe Bondol?*`);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const buffer = await global.fetchApi('kyzz', '/api/canvas/pak-ustadz', {
			text: query.trim()
		}, {
			responseType: 'arraybuffer'
		});

		if (!buffer || buffer.length === 0) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
			return reply('❌ Gagal membuat gambar Pak Ustadz.');
		}

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

		return await sock.sendMessage(m.chat, {
			image: Buffer.from(buffer),
			caption: `👳‍♂️ *PAK USTADZ MENJAWAB*\n\n❓ *Tanya:* ${query.trim()}`
		}, { quoted: m });

	} catch (err) {
		console.error('[PAK USTADZ ERROR]:', err);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply('❌ Terjadi kesalahan saat memproses Pak Ustadz!');
	}
};

handler.help = ['pakustadz'];
handler.tags = ['maker'];
handler.command = ['pakustadz', 'ustadz', 'ustad'];
handler.limit = true;

export default handler;