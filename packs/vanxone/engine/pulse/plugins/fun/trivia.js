const SESSIONS = new Map();

const TRIVIA = [
	{ q: 'Apa ibu kota Jepang?', a: 'tokyo' },
	{ q: 'Berapa jumlah benua di dunia?', a: '7' },
	{ q: 'Planet apa yang dijuluki Planet Merah?', a: 'mars' },
	{ q: 'Apa nama mata uang Jepang?', a: 'yen' },
	{ q: 'Hewan apa yang dijuluki raja hutan?', a: 'singa' },
	{ q: 'Berapa jumlah hari dalam tahun kabisat?', a: '366' },
	{ q: 'Apa bahasa pemrograman yang dibuat oleh Brendan Eich?', a: 'javascript' },
	{ q: 'Apa nama gas yang dihirup manusia untuk bernapas?', a: 'oksigen' },
	{ q: 'Siapa presiden pertama Republik Indonesia?', a: 'soekarno' },
	{ q: 'Apa mamalia terbesar di dunia?', a: 'paus biru' },
	{ q: 'Unsur kimia dengan lambang Au adalah?', a: 'emas' },
	{ q: 'Berapa jumlah warna pada pelangi?', a: '7' },
	{ q: 'Gunung tertinggi di dunia adalah?', a: 'everest' },
	{ q: 'Organ tubuh manusia yang berfungsi memompa darah adalah?', a: 'jantung' },
	{ q: 'Apa ibu kota negara Australia?', a: 'canberra' },
	{ q: 'Penemu lampu pijar adalah?', a: 'thomas alva edison' },
	{ q: 'Apa nama candi Buddha terbesar di dunia yang ada di Indonesia?', a: 'borobudur' },
	{ q: 'Pulau terbesar di Indonesia adalah pulau?', a: 'papua' },
	{ q: 'Apa nama alat musik gesek berkulit kayu dengan 4 senar?', a: 'biola' },
	{ q: 'Berapa sisi yang dimiliki bangun ruang kubus?', a: '6' },
	{ q: 'Negara manakah yang terkenal dengan Menara Pisa?', a: 'italia' },
	{ q: 'Siapakah penemu teori relativitas?', a: 'albert einstein' },
	{ q: 'Burung yang tidak bisa terbang namun pandai berenang di kutub adalah?', a: 'penguin' },
	{ q: 'Bumi berputar pada porosnya disebut?', a: 'rotasi' },
	{ q: 'Apa mata uang negara Korea Selatan?', a: 'won' }
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const handler = async (m, { sock, text, args, usedPrefix, command }) => {
	const cmd = command.toLowerCase();
	const prefix = usedPrefix || '.';

	if (cmd === 'trivia') {
		const item = pick(TRIVIA);
		SESSIONS.set(m.chat, item.a.toLowerCase());

		await sock.sendMessage(m.chat, { react: { text: '🧠', key: m.key } }).catch(() => null);

		const message = `🧠 *TRIVIA TIME!* 🧠\n\n` +
			`${item.q}\n\n` +
			`Jawab dengan: *${prefix}jawabtrivia [jawaban]*\n\n` +
			`© ${global.namaBot}`;

		return sock.sendMessage(m.chat, { text: message }, { quoted: m });
	}

	if (cmd === 'jawabtrivia') {
		const ans = (args.join(' ') || text || '').toLowerCase().trim();
		const correct = SESSIONS.get(m.chat);

		if (!correct) {
			return sock.sendMessage(m.chat, {
				text: `❌ Belum ada trivia aktif di chat ini!\nKetik *${prefix}trivia* untuk memulai pertanyaan baru.\n\n© ${global.namaBot}`
			}, { quoted: m });
		}

		if (!ans) {
			return sock.sendMessage(m.chat, {
				text: `📌 *Format Salah!*\nKetik jawabanmu: *${prefix}jawabtrivia <jawaban>*\n\nContoh: *${prefix}jawabtrivia tokyo*\n\n© ${global.namaBot}`
			}, { quoted: m });
		}

		if (ans === correct) {
			SESSIONS.delete(m.chat);
			await sock.sendMessage(m.chat, { react: { text: '🎉', key: m.key } }).catch(() => null);

			const message = `🎉 *BENAR SEKALI!* 🎉\n\n` +
				`Jawaban kamu tepat: *${correct.toUpperCase()}*!\n` +
				`Kamu pintar banget, terus asah wawasanmu!\n\n` +
				`© ${global.namaBot}`;

			return sock.sendMessage(m.chat, { text: message }, { quoted: m });
		} else {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);

			const message = `❌ *JAWABAN SALAH!*\n\n` +
				`Coba tebak lagi atau ketik *${prefix}trivia* untuk mengganti soal baru.\n\n` +
				`© ${global.namaBot}`;

			return sock.sendMessage(m.chat, { text: message }, { quoted: m });
		}
	}
};

handler.help = ['trivia', 'jawabtrivia'];
handler.tags = ['fun'];
handler.command = ['trivia', 'jawabtrivia'];
handler.limit = true

export default handler;