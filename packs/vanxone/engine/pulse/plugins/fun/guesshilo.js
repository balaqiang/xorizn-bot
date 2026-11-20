const SESSIONS = new Map();
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const handler = async (m, { sock, args, usedPrefix, command }) => {
	const cmd = command.toLowerCase();
	const prefix = usedPrefix || '.';

	if (cmd === 'guesshilo' || cmd === 'hilo') {
		const target = randInt(1, 100);
		SESSIONS.set(m.chat, target);

		await sock.sendMessage(m.chat, { react: { text: '🔢', key: m.key } }).catch(() => null);

		const text = `🔢 *HIGHER OR LOWER* 🔢\n\n` +
			`Aku punya angka rahasia antara 1 sampai 100.\n` +
			`Jawab dengan: *${prefix}tebakhilo [angka]*, bot akan memberitahu apakah angka rahasianya lebih tinggi atau lebih rendah.\n\n` +
			`© ${global.namaBot}`;

		return sock.sendMessage(m.chat, { text }, { quoted: m });
	}

	if (cmd === 'tebakhilo') {
		const guess = parseInt(args[0]);
		const target = SESSIONS.get(m.chat);

		if (target === undefined) {
			return sock.sendMessage(m.chat, {
				text: `❌ Belum ada game aktif di obrolan ini!\nKetik *${prefix}guesshilo* untuk memulai game baru.\n\n© ${global.namaBot}`
			}, { quoted: m });
		}

		if (isNaN(guess)) {
			return sock.sendMessage(m.chat, {
				text: `📌 *Format Salah!*\nCara pakai: *${prefix}tebakhilo [angka]*\n\nContoh: *${prefix}tebakhilo 50*\n\n© ${global.namaBot}`
			}, { quoted: m });
		}

		if (guess === target) {
			SESSIONS.delete(m.chat);
			await sock.sendMessage(m.chat, { react: { text: '🎉', key: m.key } }).catch(() => null);

			const text = `🎉 *TEPAT SEKALI!* 🎉\n\n` +
				`Tebakanmu benar, angka rahasianya memang *${target}*!\n` +
				`Terima kasih sudah bermain.\n\n` +
				`© ${global.namaBot}`;

			return sock.sendMessage(m.chat, { text }, { quoted: m });
		} else if (guess < target) {
			await sock.sendMessage(m.chat, { react: { text: '📈', key: m.key } }).catch(() => null);

			const text = `📈 *LEBIH TINGGI!*\n\n` +
				`Angka rahasia lebih *TINGGI* dari *${guess}*! Coba tebak lagi.\n\n` +
				`© ${global.namaBot}`;

			return sock.sendMessage(m.chat, { text }, { quoted: m });
		} else {
			await sock.sendMessage(m.chat, { react: { text: '📉', key: m.key } }).catch(() => null);

			const text = `📉 *LEBIH RENDAH!*\n\n` +
				`Angka rahasia lebih *RENDAH* dari *${guess}*! Coba tebak lagi.\n\n` +
				`© ${global.namaBot}`;

			return sock.sendMessage(m.chat, { text }, { quoted: m });
		}
	}
};

handler.help = ['guesshilo', 'tebakhilo'];
handler.tags = ['fun'];
handler.command = ['guesshilo', 'hilo', 'tebakhilo'];
handler.limit = true

export default handler;