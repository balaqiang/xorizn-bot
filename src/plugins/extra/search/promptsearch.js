
import axios from 'axios';

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
	const client = conn || sock || global.mainSock;
	if (!text) {
		return reply(`Masukkan kata kunci pencarian prompt AI!\n\nContoh:\n${usedPrefix + command} Naruto\n${usedPrefix + command} Cyberpunk`);
	}

	reply('⏳ Sedang mencari prompt AI...');

	try {
		const apiUrl = global.API('kyzz', '/api/search/prompt-search', { q: text.trim() }, 'apikey');
		const { data: res } = await axios.get(apiUrl, { timeout: 30000 });

		if (!res || !res.status || !Array.isArray(res.hasil) || res.hasil.length === 0) {
			return reply(`❌ Prompt untuk *"${text}"* tidak ditemukan.`);
		}

		const list = res.hasil.slice(0, 5);
		let caption = `🔍 *HASIL PENCARIAN PROMPT AI: ${text}*\n\n`;

		list.forEach((item, index) => {
			caption += `*${index + 1}. ${item.judul || 'AI Prompt'}*\n`;
			caption += ` ├ 🤖 *Model:* ${item.model || '-'} (${item.versi || '-'})\n`;
			caption += ` ├ 🏷️ *Kategori:* ${item.kategori || '-'}\n`;
			caption += ` ├ 📝 *Prompt:*\n\`\`\`${item.prompt}\`\`\`\n\n`;
		});

		caption += `© ${global.botName || 'xorizn-bot'}`;

		const firstImage = list.find(i => i.gambar)?.gambar;
		if (firstImage) {
			await client.sendMessage(m.chat, {
				image: { url: firstImage },
				caption: caption.trim()
			}, { quoted: m });
		} else {
			await reply(caption.trim());
		}
	} catch (e) {
		console.error('[PROMPT SEARCH ERROR]', e.message);
		reply(`❌ Terjadi kesalahan: ${e.response?.data?.message || e.message}`);
	}
};

handler.help = ['promptsearch <query>', 'cariprompt <query>'];
handler.tags = ['search'];
handler.command = ['promptsearch', 'cariprompt', 'searchprompt'];
handler.limit = true;
handler.register = true;

export default handler;
