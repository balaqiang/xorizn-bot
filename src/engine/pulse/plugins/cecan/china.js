import sendCecan from '../../lib/scrape/cecan.js';

const handler = async (m, { sock, reply }) => {
	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		await sendCecan(sock, m, reply, 'China');
		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
	} catch (e) {
		console.error('[CECAN CHINA ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply('❌ Gagal mengambil gambar cecan China.');
	}
};

handler.help = ['china'];
handler.tags = ['cecan'];
handler.command = ['china', 'cecan-china', 'cecanchina'];
handler.limit = true;

export default handler;