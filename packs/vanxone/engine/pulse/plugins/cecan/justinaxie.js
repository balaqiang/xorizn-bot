import sendCecan from '../../lib/scrape/cecan.js';

const handler = async (m, { sock, reply }) => {
	try {
		await sendCecan(sock, m, reply, 'Justinaxie');
	} catch (e) {
		console.error('[CECAN JUSTINAXIE ERROR]', e);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		reply('❌ Gagal mengambil gambar cecan Justinaxie.');
	}
};

handler.command = ['justinaxie'];
handler.limit = true;

export default handler;