
import axios from 'axios';
import { prepareWAMessageMedia } from 'xorizn-baileys';

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
	const client = conn || sock || global.mainSock;
	if (!text) {
		return reply(`Masukkan kata kunci pencarian Pixiv!\n\nContoh:\n${usedPrefix + command} Anime\n${usedPrefix + command} Genshin`);
	}

	reply('⏳ Sedang mencari di Pixiv...');

	try {
		const apiUrl = global.API('kyzz', '/api/search/pixiv', { query: text.trim(), page: 1, limit: 5 }, 'apikey');
		const { data: res } = await axios.get(apiUrl, { timeout: 30000 });

		if (!res || !res.status || !Array.isArray(res.results) || res.results.length === 0) {
			return reply(`❌ Gambar Pixiv untuk *"${text}"* tidak ditemukan.`);
		}

		const items = res.results.filter(item => item && (item.image || item.thumbnail));
		if (items.length === 0) {
			return reply(`❌ Tidak ada hasil gambar yang valid.`);
		}

		const cardPromises = items.map(async (item, idx) => {
			try {
				const imgUrl = item.image || item.thumbnail;
				const media = await prepareWAMessageMedia(
					{ image: { url: imgUrl } },
					{ upload: client.waUploadToServer }
				);

				const tags = Array.isArray(item.tags) ? item.tags.slice(0, 5).join(', ') : '-';
				const caption = `🎨 *Title:* ${item.title || '-'}\n` +
					`👤 *Author:* ${item.author || '-'}\n` +
					`🏷️ *Tags:* ${tags}`;

				return {
					body: { text: caption },
					footer: { text: `© ${global.botName || 'xorizn-bot'} • Pixiv` },
					header: {
						title: `🖼️ Hasil ${idx + 1}/${items.length}`,
						hasMediaAttachment: true,
						imageMessage: media.imageMessage
					},
					nativeFlowMessage: {
						buttons: [{
							name: 'cta_url',
							buttonParamsJson: JSON.stringify({
								display_text: '🌐 Buka di Pixiv',
								url: item.url || `https://www.pixiv.net/en/artworks/${item.id}`
							})
						}]
					}
				};
			} catch (err) {
				return null;
			}
		});

		const cards = (await Promise.all(cardPromises)).filter(Boolean);

		if (cards.length > 0) {
			await client.relayMessage(m.chat, { viewOnceMessage: { message: { interactiveMessage: { body: { text: `Result:` }, footer: { text: `© ${global.botName || "xorizn-bot"}` }, carouselMessage: { cards: resolvedCards } } } } }, { quoted: m });
		} else {
			
			const first = items[0];
			await client.sendMessage(m.chat, {
				image: { url: first.image || first.thumbnail },
				caption: `🎨 *${first.title}*\n👤 *Author:* ${first.author}\n🔗 *Link:* ${first.url}`
			}, { quoted: m });
		}
	} catch (e) {
		console.error('[PIXIV SEARCH ERROR]', e.message);
		reply(`❌ Terjadi kesalahan: ${e.response?.data?.message || e.message}`);
	}
};

handler.help = ['pixiv <query>', 'pixivsearch <query>'];
handler.tags = ['search'];
handler.command = ['pixiv', 'pixivsearch'];
handler.limit = true;
handler.register = true;

export default handler;
