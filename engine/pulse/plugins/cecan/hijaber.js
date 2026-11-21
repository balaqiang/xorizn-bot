import sendCecan from '../../lib/scrape/cecan.js';

const handler = async (m, { sock, reply }) => {
	try {
		await sendCecan(sock, m, reply, 'Hijaber');
	} catch (e) {
		console.error('[CECAN HIJABER ERROR]', e);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		reply('❌ Gagal mengambil gambar cecan Hijaber.');
	}
};

handler.command = ['hijaber'];
handler.limit = true;

export default handler;