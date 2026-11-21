const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const LINES = [
	'Seseorang di grup ini diam-diam selalu memperhatikan chat kamu.',
	'Ada yang selalu tersenyum saat melihat foto profil atau pesanmu.',
	'Seseorang menyimpan pesan lucumu sebagai favorit.',
	'Ada seseorang yang merasa hari-harinya lebih berwarna karena kamu.'
];

const handler = async (m, { sock }) => {
	await sock.sendMessage(m.chat, { react: { text: '💌', key: m.key } }).catch(() => null);

	const caption = `💌 *PESAN MISTERIUS* 💌\n\n` +
		`"${pick(LINES)}"\n\n` +
		`© ${global.namaBot}`;

	return sock.sendMessage(m.chat, { text: caption }, { quoted: m });
};

handler.help = ['secretadmirer'];
handler.tags = ['fun'];
handler.command = ['secretadmirer'];
handler.limit = true

export default handler;