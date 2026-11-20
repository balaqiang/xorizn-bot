const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const name = text?.trim();

	if (!name) {
		return reply(`Masukkan nama!\n\n*Contoh:*\n\`${pfx}${command} Ujang\``);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const buffer = await global.fetchApi('kyzz', '/api/canvas/sertifikat-tolol', { 
			name 
		}, { 
			responseType: 'arraybuffer' 
		});

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

		return await sock.sendMessage(m.chat, {
			image: Buffer.from(buffer),
			caption: `📜 *SERTIFIKAT TOLOL*\n\n👤 Diberikan kepada: *${name}*`
		}, { quoted: m });

	} catch (e) {
		console.error('[SERTIFIKAT TOLOL ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Error: ${e.message || e}`);
	}
};

handler.help = ['sertifikattolol'];
handler.tags = ['maker'];
handler.command = ['sertifikattolol', 'sertitolol'];
handler.limit = true;

export default handler;