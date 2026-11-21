import axios from 'axios';

const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const botName = global.namaBot;
	const query = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : '');

	if (!query) {
		return reply(
			`⚡ *REALTIME AI ASSISTANT*\n\n` +
			`Format:\n` +
			`• \`${usedPrefix + command} <pertanyaan / prompt>\`\n` +
			`• Atau balas pesan dengan \`${usedPrefix + command}\`\n\n` +
			`*Contoh:*\n` +
			`• \`${usedPrefix + command} Siapa presiden indonesia sekarang?\``
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const json = await global.fetchApi('faa', 'faa/ai-realtime', {
			text: query.trim()
		});

		if (!json?.status || !json?.result) {
			throw new Error(json?.message || 'Server AI Realtime tidak mengembalikan respon valid.');
		}

		const resultText = (json.result || '').toString().trim();
		if (!resultText) {
			throw new Error('Jawaban dari AI Realtime kosong.');
		}

		await reply(`${resultText}\n\n© ${botName}`);
		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[AI REALTIME ERROR]:', e.response?.data || e.message || e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal mengambil jawaban dari Realtime AI: ${e.response?.data?.message || e.message || e}`);
	}
};

handler.help = ['airealtime <pertanyaan>', 'aireal <pertanyaan>'];
handler.tags = ['ai'];
handler.command = ['airealtime', 'aireal', 'airealt'];
handler.limit = true;

export default handler;