const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const PAIRS = [
	['Kucing', 'Anjing'], ['Pagi Hari', 'Malam Hari'], ['Pantai', 'Gunung'],
	['Teh Manis', 'Kopi Susu'], ['Nonton Film', 'Baca Buku'], ['Musim Panas', 'Musim Hujan'],
	['Mie Goreng', 'Mie Kuah'], ['Game PC', 'Game Mobile'], ['Uang Banyak', 'Waktu Luang']
];

const handler = async (m, { sock }) => {
	await sock.sendMessage(m.chat, { react: { text: '⚖️', key: m.key } }).catch(() => null);

	const [a, b] = pick(PAIRS);
	const caption = `⚖️ *THIS OR THAT* ⚖️\n\n` +
		`*${a}* 🆚 *${b}*\n\n` +
		`Pilih salah satu dan tuliskan alasanmu!\n\n` +
		`© ${global.namaBot}`;

	return sock.sendMessage(m.chat, { text: caption }, { quoted: m });
};

handler.help = ['thisorthat'];
handler.tags = ['fun'];
handler.command = ['thisorthat', 'pilihmana'];
handler.limit = true

export default handler;