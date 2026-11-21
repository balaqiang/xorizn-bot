const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const WORDS = [
	{ word: 'Serendipity', meaning: 'Menemukan sesuatu yang indah atau baik tanpa direncanakan sebelumnya.' },
	{ word: 'Petrichor', meaning: 'Aroma khas dan menenangkan dari tanah setelah hujan pertama turun.' },
	{ word: 'Ephemeral', meaning: 'Sesuatu yang berlangsung sangat singkat namun meninggalkan keindahan.' },
	{ word: 'Wanderlust', meaning: 'Hasrat dan dorongan kuat untuk terus menjelajah dan bepergian ke tempat baru.' },
	{ word: 'Resilience', meaning: 'Kemampuan untuk bangkit dan pulih kembali saat menghadapi kesulitan.' },
	{ word: 'Euphoria', meaning: 'Perasaan bahagia dan gembira yang luar biasa meluap-luap.' }
];

const handler = async (m, { sock }) => {
	await sock.sendMessage(m.chat, { react: { text: '📖', key: m.key } }).catch(() => null);

	const w = pick(WORDS);
	const caption = `📖 *KATA HARI INI* 📖\n\n` +
		`*${w.word}*\n` +
		`_${w.meaning}_\n\n` +
		`© ${global.namaBot}`;

	return sock.sendMessage(m.chat, { text: caption }, { quoted: m });
};

handler.help = ['wordofday'];
handler.tags = ['fun'];
handler.command = ['wordofday', 'katabijak'];
handler.limit = true

export default handler;