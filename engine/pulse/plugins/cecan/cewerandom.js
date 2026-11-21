import sendCecan from '../../lib/scrape/cecan.js';

const allCategories = [
	'China', 'Hijaber', 'Indonesia', 'Japan', 'Jeni', 'Jiso',
	'Korea', 'Justinaxie', 'Malaysia', 'Rose', 'Ryujin', 'Thailand', 'Vietnam'
];

const handler = async (m, { sock, reply }) => {
	try {
		const category = allCategories[Math.floor(Math.random() * allCategories.length)];
		await sendCecan(sock, m, reply, category);
	} catch (e) {
		console.error('[CEWERANDOM ALL ERROR]', e);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		reply('❌ Gagal mengambil gambar cewe random.');
	}
};

handler.help = ['cewerandom'];
handler.tags = ['cewerandom'];
handler.command = ['cewerandom', 'ceweku'];
handler.limit = true;

export default handler;