import sendCecan from '../../lib/scrape/cecan.js';

const handler = async (m, { sock, reply }) => {
	try {
		await sendCecan(sock, m, reply, 'Vietnam');
	} catch (e) {
		console.error('[CECAN VIETNAM ERROR]', e);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		reply('❌ Gagal mengambil gambar cecan Vietnam.');
	}
};

handler.help = ['vietnam'];
handler.tags = ['cewerandom'];
handler.command = ['vietnam'];
handler.limit = true;

export default handler;