import sendCecan from '../../lib/scrape/cecan.js';

const handler = async (m, { sock, reply }) => {
	try {
		await sendCecan(sock, m, reply, 'Ryujin');
	} catch (e) {
		console.error('[CECAN RYUJIN ERROR]', e);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		reply('❌ Gagal mengambil gambar cecan Ryujin.');
	}
};

handler.help = ['ryujin'];
handler.tags = ['cewerandom'];
handler.command = ['ryujin'];
handler.limit = true;

export default handler;