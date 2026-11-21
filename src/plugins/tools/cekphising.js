// Port dari 'plugin baru' (cekphising.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const axios = require('axios')

const handler = async (m, { sock, text, usedPrefix, command, reply }) => {
	const p = usedPrefix || '.';
	const inputUrl = text || (m.quoted ? (m.quoted.text || m.quoted.body || m.quoted.caption) : '');

	if (!inputUrl) {
		return reply(
			`Halo 👋\n\n` +
			`Silakan masukkan link URL yang ingin dicek keamanannya.\n\n` +
			`Contoh:\n- *${p + command} https://google.com*`
		);
	}

	// Reaction Loading
	await sock.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }).catch(() => null);

	try {
		const apiUrl = `https://api.nexray.eu.cc/tools/webphishing?url=${encodeURIComponent(inputUrl.trim())}`;
		const res = await axios.get(apiUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
			},
			timeout: 20000
		});
		const data = res.data;

		if (!data.status || !data.result) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
			return reply('⚠️ Gagal mengecek URL. Pastikan link yang dimasukkan valid atau coba lagi nanti.');
		}

		const { result } = data;

		let info = `🛡️ *HASIL SCAN URL* 🛡️\n\n`;
		info += `🔗 *URL:* ${result.scanned_url}\n`;
		info += `📊 *Status:* ${result.status_description}\n\n`;
		info += `*DETAIL SCAN:*\n`;
		info += `- Phishing: ${result.is_phishing ? '🚨 Ya' : '✅ Tidak'}\n`;
		info += `- Mengandung Malware: ${result.contains_malware ? '🚨 Ya' : '✅ Tidak'}\n`;
		info += `- Membawa ke Situs Berbahaya: ${result.sends_to_harmful_sites ? '🚨 Ya' : '✅ Tidak'}\n`;
		info += `- Menginstal Software Jahat: ${result.installs_malicious_software ? '🚨 Ya' : '✅ Tidak'}\n`;
		info += `- Unduhan Tidak Wajar: ${result.uncommon_downloads ? '🚨 Ya' : '✅ Tidak'}\n\n`;
		info += `_Terakhir dipindai: ${new Date(result.last_modified).toLocaleString('id-ID')}_`;

		// Reaction Sukses & Kirim Hasil
		await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => null);
		
		await sock.sendMessage(m.chat, {
			text: info,
			contextInfo: {
				isForwarded: true,
				forwardingScore: 9999,
				forwardedNewsletterMessageInfo: {
					newsletterName: global.namech || "xorizn-bot Channel",
					newsletterJid: global.idch || global.channelJid
				}
			}
		}, { quoted: m });

	} catch (error) {
		console.error('[Phishing Check Error]', error);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		reply(`😔 Terjadi kesalahan sistem saat mengecek URL tersebut: ${error.message || error}`);
	}
};

handler.help = ['cekphising <url>', 'checkphishing <url>', 'webphishing <url>', 'phisingataubukan <url>'];
handler.tags = ['tools', 'internet'];
handler.command = ['cekphising', 'phisingataubukan', 'checkphishing', 'webphishing'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "tools"})
