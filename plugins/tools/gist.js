// Port dari 'plugin baru' (gist.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const axios = require('axios')

const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const botName = global.namaBot;
	const token = global.ghTokens;

	if (!token) {
		return reply('⚠️ Token GitHub belum diset di settings.js! (global.ghTokens)');
	}

	const q = m.quoted && !text ? m.quoted : m;
	const txt = text ? text : typeof q.text === 'string' ? q.text : '';

	if (!txt) {
		return reply(
			`⚙️ *Format Salah!*\n\n` +
			`Gunakan:\n` +
			`• \`${usedPrefix + command} nama_file.js | isi_kode\`\n\n` +
			`Atau balas pesan teks dengan:\n` +
			`• \`${usedPrefix + command} nama_file.js\``
		);
	}

	const rawText = m.text?.trim() || '';
	const cleanText = rawText.replace(new RegExp(`^\\${usedPrefix}${command}\\s*`, 'i'), '').trim();

	let filename = '';
	let content = '';

	if (m.quoted && m.quoted.text && !cleanText.includes('|')) {
		filename = cleanText.replace(/--raw/gi, '').trim() || 'reply.js';
		content = m.quoted.text;
	} else {
		const [fname, ...contentArr] = cleanText.split('|');
		filename = (fname || 'untitled.js').replace(/--raw/gi, '').trim();
		content = contentArr.join('|').trim();
	}

	if (!filename || !content) {
		return reply(
			`⚙️ *Format Salah!*\n\n` +
			`*Contoh:*\n` +
			`\`${usedPrefix + command} index.js | console.log("Halo dunia!")\``
		);
	}

	const description = `${global.namaOwner || 'sahril2nd'} masih perawan`;

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const { data } = await axios.post(
			'https://api.github.com/gists',
			{
				description,
				public: true,
				files: {
					[filename]: { content }
				}
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'User-Agent': 'WhatsApp-Bot'
				},
				timeout: 30000
			}
		);

		const gistUrl = data.html_url;

		const msg = [
			`·˚ ༘₊· ͟͟͞͞꒰ ${botName} ꒱ ₊˚ · ˚`,
			` ✿ *Nama* : ${filename}`,
			` ✿ *Tipe* : plugin esm`,
			` ✿ *Author* : ${global.namaOwner || 'sahril2nd'}`,
			` ✿ *Code* : ${gistUrl}`,
			` ✿ *Manfaat:* gtw`,
			` ✿ *Note:* idk`,
			`꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷`
		].join('\n');

		await reply(msg);
		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[GIST ERROR]:', e.response?.data || e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal upload Gist:\n${e.response?.data?.message || e.message}`);
	}
};

handler.help = ['gist <file|code>', 'uploadgist'];
handler.tags = ['tools', 'owner'];
handler.command = ['gist', 'uptogist', 'uploadgist'];

module.exports = S.wrap(handler, {"category": "tools"})
