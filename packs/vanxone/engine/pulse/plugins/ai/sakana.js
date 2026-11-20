const AVAILABLE_MODELS = ['namazu', 'sakana', 'namazu-v2', 'namazu-pro', 'llama'];

const handler = async (m, { sock, text, usedPrefix, command, reply }) => {
	if (!text) {
		return reply(
			`*Contoh Penggunaan:*\n` +
			`• \`${usedPrefix + command} halo\`\n` +
			`• \`${usedPrefix + command} --model=sakana --thinking=true buatkan puisi\`\n\n` +
			`*Model Tersedia:*\n` +
			AVAILABLE_MODELS.map(mod => `• ${mod}`).join('\n')
		);
	}

	let question = text;
	let model = 'namazu';
	let thinking = 0;

	const modelMatch = question.match(/--model=([a-zA-Z0-9_-]+)/i);
	if (modelMatch) {
		const reqModel = modelMatch[1].toLowerCase();
		if (AVAILABLE_MODELS.includes(reqModel)) {
			model = reqModel;
		}
		question = question.replace(modelMatch[0], '').trim();
	}

	const thinkMatch = question.match(/--thinking=(true|false|1|0)/i);
	if (thinkMatch) {
		thinking = (thinkMatch[1] === 'true' || thinkMatch[1] === '1') ? 1 : 0;
		question = question.replace(thinkMatch[0], '').trim();
	} else if (/\s*-t\b/i.test(question)) {
		thinking = 1;
		question = question.replace(/\s*-t\b/i, '').trim();
	}

	if (!question) return reply('⚠️ Masukkan pertanyaan!');

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

	try {
		const res = await global.fetchApi('kyzz', '/api/ai/sakana-ai', {
			question: question.trim(),
			model: model,
			thinking: thinking
		}, { timeout: 60000 });

		if (!res || !res.status) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
			return reply(`❌ Gagal: ${res?.message || 'Tidak ada respon'}`);
		}

		const answer = typeof res.result === 'string' ? res.result : (res.result?.text || res.result?.answer || JSON.stringify(res.result));

		await reply(answer.trim());
		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
	} catch (e) {
		console.error('[SAKANA AI ERROR]', e.response?.data || e.message);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		return reply(`❌ Error: ${e.response?.data?.message || e.message}`);
	}
};

handler.help = ['sakana <pertanyaan>'];
handler.tags = ['ai'];
handler.command = ['sakana', 'sakanaai'];
handler.limit = true;

export default handler;