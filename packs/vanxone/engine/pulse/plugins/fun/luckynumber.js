const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const handler = async (m, { sock }) => {
	await sock.sendMessage(m.chat, { react: { text: '🍀', key: m.key } }).catch(() => null);

	const number = randInt(1, 99);
	const text = `🍀 *ANGKA KEBERUNTUNGAN HARI INI* 🍀\n\n` +
		`🎯 Angka Hoki: *${number}*\n\n` +
		`Semoga harimu penuh keberuntungan!\n\n` +
		`© ${global.namaBot}`;

	return sock.sendMessage(m.chat, { text }, { quoted: m });
};

handler.help = ['luckynumber'];
handler.tags = ['fun'];
handler.command = ['luckynumber', 'angkehoki'];
handler.limit = true

export default handler;