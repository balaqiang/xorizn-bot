const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const AFFIRMATIONS = [
	'Kamu jauh lebih kuat dan hebat dari yang kamu kira.',
	'Setiap langkah kecil yang kamu ambil hari ini tetaplah sebuah kemajuan.',
	'Kamu pantas mendapatkan hal-hal baik dan kebahagiaan hari ini.',
	'Kesalahan hari ini adalah guru berharga untuk keberhasilanmu besok.',
	'Percaya pada dirimu sendiri, kamu mampu melewati semua tantangan.'
];

const handler = async (m, { sock, reply }) => {
	await sock.sendMessage(m.chat, { react: { text: '🌻', key: m.key } });

	const text = `🌻 *AFIRMASI HARI INI*\n\n` +
		`"${pick(AFFIRMATIONS)}"\n\n` +
		`© ${global.namaBot}`;

	return reply ? reply(text) : m.reply(text);
};

handler.help = ['affirmation'];
handler.tags = ['fun'];
handler.command = ['affirmation', 'afirmasi'];
handler.limit = true

export default handler;