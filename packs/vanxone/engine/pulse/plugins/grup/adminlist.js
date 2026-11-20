const handler = async (m, { sock, reply, groupMetadata }) => {
	const botName = global.namaBot;

	if (!m.isGroup) {
		return reply('Fitur ini hanya dapat digunakan di dalam grup.');
	}

	await sock.sendMessage(m.chat, { react: { text: '\u23F3', key: m.key } }).catch(() => null);

	try {
		const metadata = groupMetadata || await sock.groupMetadata(m.chat);
		const participants = metadata?.participants || [];

		const admins = participants
			.filter((p) => p.admin === 'admin' || p.admin === 'superadmin')
			.map((p) => p.id);

		if (!admins.length) {
			await sock.sendMessage(m.chat, { react: { text: '\u274C', key: m.key } }).catch(() => null);
			return reply('Tidak ada admin yang terdeteksi di grup ini.');
		}

		const listText = admins.map((jid, i) => `${i + 1}. @${jid.split('@')[0]}`).join('\n');

		const caption = [
			'*DAFTAR ADMIN GRUP*',
			'----------------------------------------',
			`*Nama Grup:* ${metadata.subject || '-'}`,
			`*Total Admin:* ${admins.length}`,
			'',
			listText,
			'',
			`© ${botName}`
		].join('\n');

		await sock.sendMessage(
			m.chat,
			{
				text: caption,
				mentions: admins
			},
			{ quoted: m }
		);

		await sock.sendMessage(m.chat, { react: { text: '\u2728', key: m.key } }).catch(() => null);

	} catch (err) {
		console.error('[ADMINLIST ERROR]:', err);
		await sock.sendMessage(m.chat, { react: { text: '\u274C', key: m.key } }).catch(() => null);
		return reply('Gagal mengambil daftar admin grup.');
	}
};

handler.help = ['adminlist', 'listadmin'];
handler.tags = ['group'];
handler.command = ['adminlist', 'listadmin'];
handler.group = true;

export default handler;