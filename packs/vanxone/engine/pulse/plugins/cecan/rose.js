import sendCecan from '../../lib/scrape/cecan.js';

const handler = async (m, { sock, reply }) => {
	try {
		await sendCecan(sock, m, reply, 'Rose');
	} catch (e) {
		console.error('[CECAN ROSE ERROR]', e);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		reply('❌ Gagal mengambil gambar cecan Rose.');
	}
};

handler.help = ['rose'];
handler.tags = ['cewerandom'];
handler.command = ['rose'];
handler.limit = true;

export default handler;