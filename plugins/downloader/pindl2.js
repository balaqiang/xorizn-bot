// Port dari 'plugin baru' (pindl2.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const axios = require('axios')

const formatBytes = (bytes) => {
	if (!bytes || isNaN(bytes) || bytes === 0) return '-';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

async function pinterestDownload(url) {
	try {
		const api = 'https://pinterestdownloader.io/frontendService/DownloaderService';
		const { data } = await axios.get(api, {
			params: { url },
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
			},
			timeout: 25000
		});
		return data;
	} catch (e) {
		return { error: e.response?.data?.message || e.message || e };
	}
}

const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const botName = global.namaBot;
	const input = text || (m.quoted && (m.quoted.text || m.quoted.caption));

	if (!input) {
		return reply(
			`📥 *PINTEREST DOWNLOADER*\n\n` +
			`Unduh gambar atau video kualitas HD dari Pinterest.\n\n` +
			`*Contoh Penggunaan:*\n` +
			`• \`${pfx + command} https://pin.it/xxxxxx\`\n` +
			`• \`${pfx + command} https://id.pinterest.com/pin/xxxxxx/\`\n` +
			`• Balas tautan Pinterest dengan \`${pfx + command}\``
		);
	}

	const urlMatch = input.trim().match(/https?:\/\/(?:[a-zA-Z0-9-]+\.)?pinterest\.(?:com|[a-z]{2,3})\/pin\/\S+|https?:\/\/pin\.it\/\S+/i);
	if (!urlMatch) {
		return reply('❌ URL Pinterest tidak valid. Pastikan format link pin.it atau pinterest.com');
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const res = await pinterestDownload(urlMatch[0]);

		if (res.error) {
			throw new Error(res.error);
		}

		const medias = res.medias || res.data || [];
		if (!Array.isArray(medias) || medias.length === 0) {
			throw new Error('Media tidak ditemukan atau tautan tidak dapat diproses.');
		}

		const mp4 = medias.filter(v => v.extension === 'mp4' || v.url?.includes('.mp4') || v.type === 'video');

		if (mp4.length > 0) {
			// Urutkan video dari ukuran file atau kualitas terbesar (HD)
			mp4.sort((a, b) => (b.size || 0) - (a.size || 0));
			const targetVid = mp4[0];

			const caption = [
				'📥 *PINTEREST VIDEO DOWNLOADED (HD)*',
				'',
				`• 🎥 *Kualitas:* ${targetVid.quality || 'HD / 1080p'}`,
				`• 💾 *Ukuran:* ${formatBytes(targetVid.size)}`,
				'',
				`© ${botName}`
			].join('\n');

			await sock.sendMessage(
				m.chat,
				{
					video: { url: targetVid.url },
					caption
				},
				{ quoted: m }
			);
		} else {
			// Filter gambar dan ambil kualitas/ukuran tertinggi
			const images = medias.filter(v => v.extension === 'jpg' || v.extension === 'png' || v.type === 'image');
			if (images.length > 0) {
				images.sort((a, b) => (b.size || 0) - (a.size || 0));
			}

			let img = images[0] || medias[0];
			if (!img?.url) throw new Error('URL gambar tidak valid.');

			// Paksa URL gambar ke kualitas asli (originals / HD) jika merupakan CDN Pinterest
			let hdImageUrl = img.url.replace(/\/(?:236x|474x|564x|736x)\//, '/originals/');

			const caption = [
				'📥 *PINTEREST IMAGE DOWNLOADED (HD)*',
				'',
				`• 🖼️ *Kualitas:* Ultra HD / Original`,
				'',
				`© ${botName}`
			].join('\n');

			await sock.sendMessage(
				m.chat,
				{
					image: { url: hdImageUrl },
					caption
				},
				{ quoted: m }
			);
		}

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[PINDL ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal mengunduh media Pinterest: ${e.message || e}`);
	}
};

handler.help = ['pindl <link>', 'pinterestdl <link>'];
handler.tags = ['downloader'];
handler.command = ['pindl2', 'pindownload2', 'pinterestdl2'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "downloader"})
