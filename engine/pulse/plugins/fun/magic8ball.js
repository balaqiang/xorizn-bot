const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const ANSWERS = [
	'Ya, pasti!', 'Tidak diragukan lagi.', 'Sepertinya begitu.',
	'Tanya lagi nanti.', 'Lebih baik tidak kuberitahu sekarang.',
	'Jangan terlalu berharap.', 'Sangat meragukan.', 'Tidak mungkin.', 'Bisa jadi.',
	'Peluangnya 100%!'
];

const handler = async (m, { sock, text, args }) => {
	const q = (args.join(' ') || text || '').trim();

	await sock.sendMessage(m.chat, { react: { text: '🎱', key: m.key } }).catch(() => null);

	const caption = `🎱 *MAGIC 8-BALL* 🎱\n\n` +
		(q ? `❓ *Pertanyaan:* "${q}"\n\n` : '') +
		`🔮 *Jawaban:* *${pick(ANSWERS)}*\n\n` +
		`© ${global.namaBot}`;

	return sock.sendMessage(m.chat, { text: caption }, { quoted: m });
};

handler.help = ['magic8ball'];
handler.tags = ['fun'];
handler.command = ['magic8ball', '8ball'];
handler.limit = true

export default handler;