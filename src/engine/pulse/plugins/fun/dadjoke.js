const DAD_JOKES = [
	'Kenapa programmer suka alam? Karena banyak tree (pohon data)!',
	'Apa minuman favorit hantu? Es kunti(lanak)... eh, es teh maksudnya.',
	'Kenapa komputer gak pernah lapar? Karena udah punya byte!',
	'Kenapa laut gak pernah pinjam uang? Karena udah banyak "bank" (pantai)!',
	'Kenapa bebek goreng enak rasanya? Karena ada huruf B nya, coba kalau gak ada... jadi ekek goreng!',
	'Pocong apa yang paling disenangi ibu-ibu? Pocongan harga!',
	'Kenapa matahari tenggelam? Karena gak bisa berenang!',
	'Hewan apa yang bersaudara? Katak-beradik!',
	'Jus apa yang paling gak enak? Just friend...',
	'Kenapa superman bajunya ketat? Karena kalau longgar namanya super jumbo!'
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const handler = async (m, { sock }) => {
	await sock.sendMessage(m.chat, { react: { text: '😂', key: m.key } }).catch(() => null);

	const caption = `😂 *DAD JOKE* 😂\n\n` +
		`${pick(DAD_JOKES)}\n\n` +
		`© ${global.namaBot}`;

	return sock.sendMessage(m.chat, { text: caption }, { quoted: m });
};

handler.help = ['dadjoke'];
handler.tags = ['fun'];
handler.command = ['dadjoke', 'jokes'];
handler.limit = true

export default handler;