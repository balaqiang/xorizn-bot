// Port dari 'plugin baru' (aio.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const axios = require('axios')

const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const botName = global.namaBot;
	const urlTarget = (text || (m.quoted ? (m.quoted.text || m.quoted.caption) : ''))?.trim();

	if (!urlTarget || !/^https?:\/\//i.test(urlTarget)) {
		return reply(
			`📥 *ALL-IN-ONE DOWNLOADER*\n\n` +
			`Format:\n` +
			`• \`${usedPrefix + command} <url media>\`\n` +
			`• Atau balas pesan yang berisi link dengan \`${usedPrefix + command}\`\n\n` +
			`*Contoh:*\n` +
			`• \`${usedPrefix + command} https://vm.tiktok.com/ZSXwf1TAm/\``
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const apiUrl = `https://api.nexray.eu.cc/downloader/aio?url=${encodeURIComponent(urlTarget)}`;
		const { data: json } = await axios.get(apiUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
			},
			timeout: 35000
		});

		if (!json?.status) {
			throw new Error(json?.message || 'Gagal mengambil media dari URL tersebut.');
		}

		const data = json.result;
		if (!data || !Array.isArray(data.medias) || !data.medias.length) {
			throw new Error('Media tidak ditemukan atau link tidak didukung.');
		}

		const media =
			data.medias.find(v => v.type === 'video' && v.quality === 'hd_no_watermark') ||
			data.medias.find(v => v.type === 'video') ||
			data.medias.find(v => v.type === 'audio');

		if (!media || !media.url) {
			throw new Error('Format media tidak didukung atau URL file kosong.');
		}

		const caption = [
			'📥 *ALL-IN-ONE DOWNLOADER*',
			'─────────────────────────',
			`👤 *Author:* ${data.author || '-'}`,
			`⏱️ *Durasi:* ${data.duration ? Math.floor(data.duration / 1000) + ' Detik' : '-'}`,
			`📌 *Judul:* ${data.title || '-'}`,
			'',
			`© ${botName}`
		].join('\n');

		if (media.type === 'audio') {
			await sock.sendMessage(m.chat, {
				audio: { url: media.url },
				mimetype: 'audio/mpeg',
				fileName: `${(data.title || 'audio').replace(/[\\/:*?"<>|]/g, '')}.mp3`,
				ptt: false
			}, { quoted: m });
		} else {
			const size = media.data_size || 0;
			const isLarge = size > 50 * 1024 * 1024; // > 50MB kirim via document agar Baileys tidak timeout

			if (isLarge) {
				await sock.sendMessage(m.chat, {
					document: { url: media.url },
					fileName: `${(data.title || 'video').replace(/[\\/:*?"<>|]/g, '')}.mp4`,
					mimetype: 'video/mp4',
					caption
				}, { quoted: m });
			} else {
				await sock.sendMessage(m.chat, {
					video: { url: media.url },
					caption
				}, { quoted: m });
			}
		}

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[AIO DOWNLOADER ERROR]:', e.response?.data || e.message || e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal mendownload media: ${e.response?.data?.message || e.message || e}`);
	}
};

handler.help = ['aio <url>'];
handler.tags = ['downloader'];
handler.command = ['aio', 'aiodl'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "downloader", "extra": ["allindl"]})
