import { geminiChat } from '../../lib/scrape/gemini.js';

const sessions = new Map();

const handler = async (m, { sock, text, reply, example, usedPrefix, command }) => {
	if (!text) {
		return reply(
			`*Contoh Penggunaan:*\n` +
			`• \`${usedPrefix + command} ${example('jelaskan tentang black hole')}\`\n` +
			`• \`${usedPrefix + command} reset\``
		);
	}

	const isReset = ['reset', 'clear'].includes(text.trim().toLowerCase());
	if (isReset) {
		sessions.delete(m.sender);
		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
		return reply('✨ Sesi percakapan Gemini kamu telah direset.');
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

	try {
		const prevSession = sessions.get(m.sender) || null;
		const res = await geminiChat(text, { sessionId: prevSession });

		if (!res || !res.response) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
			return reply('❌ Gagal mendapatkan respon dari Gemini.');
		}

		if (res.sessionId) {
			sessions.set(m.sender, res.sessionId);
		}

		const result = res.response;
		const codeBlockRegex = /```(\w+)?\r?\n([\s\S]*?)```/g;
		const codeMatches = [...result.matchAll(codeBlockRegex)];

		if (codeMatches.length > 0 && typeof global.AIRich !== 'undefined') {
			try {
				const rich = new global.AIRich(sock);
				let lastIndex = 0;

				for (const match of codeMatches) {
					const textBefore = result.substring(lastIndex, match.index).trim();
					if (textBefore) rich.addText(textBefore);

					const lang = (match[1] || 'javascript').toLowerCase();
					const codeContent = match[2].trim();

					rich.addCode(lang, codeContent);
					lastIndex = match.index + match[0].length;
				}

				const textAfter = result.substring(lastIndex).trim();
				if (textAfter) rich.addText(textAfter);

				await rich.send(m.chat, { quoted: m });
				await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
				return;
			} catch (errRich) {
				console.error('[AIRich Gemini Error]:', errRich);
			}
		}

		await reply(result);
		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

	} catch (e) {
		console.error('[GEMINI PLUGIN ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		await reply(`❌ Terjadi kesalahan: ${e.message || 'Gagal menghubungi Gemini'}`);
	}
};

handler.help = ['gemini <pesan>'];
handler.tags = ['ai'];
handler.command = ['gemini', 'bard'];
handler.limit = true;

export default handler;