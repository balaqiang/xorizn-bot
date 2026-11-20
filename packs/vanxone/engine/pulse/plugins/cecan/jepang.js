import sendCecan from '../../lib/scrape/cecan.js';

const handler = async (m, { sock, reply }) => {
	try {
		await sendCecan(sock, m, reply, 'Japan');
	} catch (e) {
		console.error('[CECAN JAPAN ERROR]', e);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		reply('❌ Gagal mengambil gambar cecan Japan.');
	}
};

handler.command = ['jepang', 'japan'];
handler.limit = true;

export default handler;