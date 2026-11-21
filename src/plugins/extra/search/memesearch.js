
import axios from 'axios';

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
	const client = conn || sock || global.mainSock;
	if (!text) {
		return reply(`Masukkan kata kunci pencarian meme!\n\nContoh:\n${usedPrefix + command} Naruto\n${usedPrefix + command} Cat`);
	}

	reply('⏳ Sedang mencari meme...');

	try {
		const apiUrl = global.API('kyzz', '/api/search/meme-search', { q: text.trim(), limit: 5 }, 'apikey');
		const { data: res } = await axios.get(apiUrl, { timeout: 30000 });

		if (!res || !res.status || !Array.isArray(res.result) || res.result.length === 0) {
			return reply(`❌ Meme untuk *"${text}"* tidak ditemukan.`);
		}

		const videos = res.result.filter(item => item && item.video);
		if (videos.length === 0) {
			return reply(`❌ Tidak ada video meme yang ditemukan.`);
		}

		const album = await client.sendMessage(m.chat, {
			album: {
				expectedImageCount: 0,
				expectedVideoCount: videos.length
			}
		}, { quoted: m });

		for (const item of videos) {
			await client.sendMessage(m.chat, {
				video: { url: item.video },
				caption: `🎬 *${item.title || 'Meme'}*` + (item.duration ? `\n⏱️ Durasi: ${item.duration}s` : ''),
				albumParentKey: album.key
			});
		}
	} catch (e) {
		console.error('[MEMESEARCH ERROR]', e.message);
		reply(`❌ Terjadi kesalahan: ${e.response?.data?.message || e.message}`);
	}
};

handler.help = ['memesearch <query>', 'carimeme <query>'];
handler.tags = ['search'];
handler.command = ['memesearch', 'carimeme', 'meme'];
handler.limit = true;
handler.register = true;

export default handler;
