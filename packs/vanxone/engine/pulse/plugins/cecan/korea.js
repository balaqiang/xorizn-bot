import sendCecan from '../../lib/scrape/cecan.js';

const handler = async (m, { sock, reply }) => {
	try {
		await sendCecan(sock, m, reply, 'Korea');
	} catch (e) {
		console.error('[CECAN KOREA ERROR]', e);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		reply('❌ Gagal mengambil gambar cecan Korea.');
	}
};

handler.command = ['korea'];
handler.limit = true;

export default handler;