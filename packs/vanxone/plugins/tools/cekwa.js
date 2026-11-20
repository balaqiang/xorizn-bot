// Port dari 'plugin baru' (cekwa.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const axios = require('axios')

const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const botName = global.namaBot;

	// Ambil nomor target dari input text, reply, atau mention
	let targetNumber = (text || '').replace(/[^0-9]/g, '');

	if (!targetNumber && m.quoted?.sender) {
		targetNumber = m.quoted.sender.replace(/[^0-9]/g, '');
	}

	const rawMentions = m.mentionedJid || m.mentions || [];
	if (!targetNumber && rawMentions[0]) {
		targetNumber = rawMentions[0].replace(/[^0-9]/g, '');
	}

	if (!targetNumber) {
		return reply(
			`🔍 *WHATSAPP ACCOUNT CHECKER*\n\n` +
			`Cek status pendaftaran, status ban, dan perangkat nomor WhatsApp.\n\n` +
			`*Format Penggunaan:*\n` +
			`• \`${usedPrefix + command} 628xxxxxxxxxx\`\n` +
			`• Atau balas/reply pesan target dengan \`${usedPrefix + command}\``
		);
	}

	if (targetNumber.startsWith('08')) {
		targetNumber = '62' + targetNumber.slice(1);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const { data } = await axios.get('https://kyuux-r.indevs.in/api/check-whatsapp', {
			params: {
				phone: targetNumber
			},
			timeout: 30000
		});

		if (!data?.success) {
			throw new Error(data?.message || 'API tidak mengembalikan hasil valid.');
		}

		const d = data.data || {};

		const resultText = [
			'📱 *WHATSAPP ACCOUNT INFO*',
			'─────────────────────────',
			`• 📞 *Nomor:* +${d.number || targetNumber}`,
			`• 🟢 *Status Akun:* ${d.status || 'Aktif'}`,
			`• 🚫 *Terbanned:* ${d.banned === true ? 'Ya (Banned)' : d.banned === false ? 'Tidak (Aman)' : '-'}`,
			`• 💻 *Perangkat:* ${d.info?.device || '-'}`,
			`• 📧 *Email Terkait:* ${d.info?.email || '-'}`,
			'',
			`© ${botName}`
		].join('\n');

		await reply(resultText);
		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[CEKWA ERROR]:', e.response?.data || e.message || e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Terjadi kesalahan saat memeriksa nomor: ${e.response?.data?.message || e.message || e}`);
	}
};

handler.help = ['cekwa <nomor / reply>'];
handler.tags = ['owner', 'tools'];
handler.command = ['cekwa', 'checkwa'];

module.exports = S.wrap(handler, {"category": "tools"})
