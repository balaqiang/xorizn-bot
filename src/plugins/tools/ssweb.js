// Port dari 'plugin baru' (ssweb.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const handler = async (m, { sock, text, args, usedPrefix, command, reply }) => {
	const botName = global.namaBot;
	let inputUrl = args[0] || (m.quoted ? (m.quoted.text || '') : '');
	let device = 'desktop';

	// Mengatur jenis device berdasarkan perintah khusus (sshp/sspc) atau argumen
	if (command === 'sshp') {
		device = 'mobile';
	} else if (command === 'sspc') {
		device = 'desktop';
	} else if (args.length > 1) {
		const devInput = args[1].toLowerCase();
		if (['desktop', 'mobile', 'tablet'].includes(devInput)) {
			device = devInput;
		}
	} else if (/--(mobile|tablet|desktop)/i.test(text)) {
		const match = text.match(/--(mobile|tablet|desktop)/i);
		device = match[1].toLowerCase();
		inputUrl = text.replace(/--(mobile|tablet|desktop)/gi, '').trim();
	}

	if (!inputUrl) {
		return reply(
			`🌐 *SCREENSHOT WEBSITE*\n\n` +
			`Masukkan URL website yang ingin diambil tangkapan layarnya.\n\n` +
			`*Contoh:* ${usedPrefix + command} https://google.com mobile\n` +
			`*Pilihan Device:* desktop, mobile, tablet`
		);
	}

	const cleanUrl = inputUrl.trim();
	const targetUrl = /^https?:\/\//i.test(cleanUrl) ? cleanUrl : `https://${cleanUrl}`;

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const apiUrl = global.API('kyzz', '/api/tools/ssweb', { url: targetUrl, device }, 'apikey');
		const res = await fetch(apiUrl);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);

		const json = await res.json();
		if (!json.status || !json.result || !json.result.screenshot_url) {
			throw new Error(json.message || 'Gagal mengambil screenshot dari API.');
		}

		const screenshotUrl = json.result.screenshot_url;
		const imgRes = await fetch(screenshotUrl);
		if (!imgRes.ok) throw new Error('Gagal mengunduh gambar hasil screenshot.');

		const imgBuffer = Buffer.from(await imgRes.arrayBuffer());

		const caption = [
			'🌐 *SCREENSHOT WEBSITE*',
			'----------------------------------------',
			`🔗 *URL:* ${json.result.target_url || targetUrl}`,
			`📱 *Device:* ${json.result.device || device}`,
			`📦 *Size:* ${json.result.size || '-'}`,
			`📐 *Dimensions:* ${json.result.dimensions ? `${json.result.dimensions.width}x${json.result.dimensions.height}` : '-'}`,
			'----------------------------------------',
			`© ${botName}`
		].join('\n');

		await sock.sendMessage(
			m.chat,
			{
				image: imgBuffer,
				caption
			},
			{ quoted: m }
		);

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[SSWEB ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`Gagal mengambil tangkapan layar website:\n> ${e.message || e}`);
	}
};

handler.help = ['ssweb <url> [device]', 'sshp <url>', 'sspc <url>'];
handler.tags = ['tools'];
handler.command = ['ssweb', 'sshp', 'sspc', 'screenshot'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "tools", "extra": ["ss"]})
