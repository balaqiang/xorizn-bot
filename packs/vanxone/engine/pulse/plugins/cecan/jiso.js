import sendCecan from '../../lib/scrape/cecan.js';

const handler = async (m, { sock, reply }) => {
	try {
		await sendCecan(sock, m, reply, 'Jiso');
	} catch (e) {
		console.error('[CECAN JISO ERROR]', e);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		reply('❌ Gagal mengambil gambar cecan Jiso.');
	}
};

handler.command = ['jiso', 'jisoo'];
handler.limit = true;

export default handler;