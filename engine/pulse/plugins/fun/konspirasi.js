const CONSPIRACY_FUN = [
	'Burung itu sebenarnya drone pengawas pemerintah.',
	'Kucing tidur 16 jam sehari karena merencanakan dominasi dunia.',
	'Setiap kali WiFi lambat, itu karena tetangga lagi download alam semesta paralel.',
	'Semua kaus kaki yang hilang di mesin cuci sebenarnya diculik dimensi lain.',
	'Bulan sebenarnya adalah satelit buatan raksasa yang dipakai untuk pemancar mimpi manusia.',
	'Cermin di rumah kita sebenarnya pintu ke dimensi lain yang cuma terbuka kalau kita gak lihat.'
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const handler = async (m, { sock }) => {
	await sock.sendMessage(m.chat, { react: { text: '👽', key: m.key } }).catch(() => null);

	const caption = `👽 *TEORI KONSPIRASI RANDOM* 👽\n\n` +
		`${pick(CONSPIRACY_FUN)}\n\n` +
		`_(murni untuk hiburan ya!)_\n\n` +
		`© ${global.namaBot}`;

	return sock.sendMessage(m.chat, { text: caption }, { quoted: m });
};

handler.help = ['konspirasi'];
handler.tags = ['fun'];
handler.command = ['konspirasi', 'conspiracy'];
handler.limit = true

export default handler;