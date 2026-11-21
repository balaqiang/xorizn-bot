import sendCecan from '../../lib/scrape/cecan.js';

const handler = async (m, { sock, reply }) => {
	try {
		await sendCecan(sock, m, reply, 'Indonesia');
	} catch (e) {
		console.error('[CECAN INDONESIA ERROR]', e);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		reply('❌ Gagal mengambil gambar cecan Indonesia.');
	}
};

handler.command = ['indonesia'];
handler.limit = true;

export default handler;