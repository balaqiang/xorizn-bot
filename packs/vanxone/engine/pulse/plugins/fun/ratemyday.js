const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const handler = async (m, { sock }) => {
	await sock.sendMessage(m.chat, { react: { text: '📅', key: m.key } }).catch(() => null);

	const score = randInt(1, 10);
	const comments = {
		low: 'Hari yang cukup berat dan melelahkan, tapi besok pasti jauh lebih baik! Tetap semangat ya!',
		mid: 'Hari yang cukup stabil dan oke, pertahankan energi positifmu!',
		high: 'Hari yang sangat luar biasa indah, bersyukur dan nikmati harimu!'
	};
	const tier = score <= 3 ? 'low' : score <= 7 ? 'mid' : 'high';

	const caption = `📅 *RATING HARI INI* 📅\n\n` +
		`📊 Skor Harimu: *${score}/10*\n` +
		`💬 _"${comments[tier]}"_\n\n` +
		`© ${global.namaBot}`;

	return sock.sendMessage(m.chat, { text: caption }, { quoted: m });
};

handler.help = ['ratemyday'];
handler.tags = ['fun'];
handler.command = ['ratemyday'];
handler.limit = true

export default handler;