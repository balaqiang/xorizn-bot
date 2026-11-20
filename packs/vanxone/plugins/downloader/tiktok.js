// Port dari 'plugin baru' (ttdl.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const fetch = S.fetch

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getAuthor(data) {
	return data.author?.nickname || data.author?.unique_id || data.author || '-';
}

function formatNumber(num = 0) {
	return Number(num).toLocaleString('id-ID');
}

function formatDuration(sec = 0) {
	const s = Number(sec);
	const m = Math.floor(s / 60).toString().padStart(2, '0');
	const rem = Math.floor(s % 60).toString().padStart(2, '0');
	return `${m}:${rem}`;
}

async function getTikTok(url) {
	try {
		const res = await (await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`, { timeout: 25000 })).json();
		if (res?.data) {
			return res.data;
		}
	} catch {}

	try {
		const res = await global.fetchApi('siputzx', 'api/d/tiktok', { url });
		if (res?.data) {
			const d = res.data;
			return {
				title: d.title || d.desc,
				play_count: d.stats?.playCount || d.play_count || 0,
				author: d.author,
				duration: d.duration,
				play: d.video || d.no_watermark || d.play,
				music: d.music || d.audio,
				images: d.images || d.photo || d.images_url
			};
		}
	} catch {}

	return null;
}

const handler = async (m, { sock, text, usedPrefix, command, reply }) => {
	const botName = global.namaBot;
	const input = (m.quoted ? (m.quoted.text || m.quoted.caption) : text)?.trim();

	if (!input) {
		return reply(
			'*TIKTOK DOWNLOADER & SEARCH*\n\n' +
			'Format:\n' +
			'- `' + usedPrefix + command + ' <link tiktok>`\n' +
			'- `' + usedPrefix + command + ' <kata kunci pencarian>`\n\n' +
			'*Contoh:*\n' +
			'- `' + usedPrefix + command + ' https://vt.tiktok.com/ZSbmR9kCu/`\n'
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '\u23F3', key: m.key } }).catch(() => null);

	try {
		const regex = /(https:\/\/(vt|vm)\.tiktok\.com\/[^\s]+|https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+)/;
		const matchUrl = input.match(regex)?.[0];

		let data = null;

		if (matchUrl) {
			data = await getTikTok(matchUrl);
			if (!data) {
				await sock.sendMessage(m.chat, { react: { text: '\u274C', key: m.key } }).catch(() => null);
				return reply('Semua server API TikTok gagal mengambil data video.');
			}
		} else {
			const searchRes = await (
				await fetch(
					`https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(input)}&count=1&cursor=0&web=1&hd=1`,
					{ timeout: 25000 }
				)
			).json();

			const video = searchRes?.data?.videos?.[0];
			if (!video) {
				await sock.sendMessage(m.chat, { react: { text: '\u274C', key: m.key } }).catch(() => null);
				return reply('Pencarian tidak ditemukan untuk kata kunci: "' + input + '"');
			}

			const directUrl = `https://www.tiktok.com/@${video.author?.unique_id || 'tiktok'}/video/${video.video_id}`;
			data = await getTikTok(directUrl);

			if (!data) {
				await sock.sendMessage(m.chat, { react: { text: '\u274C', key: m.key } }).catch(() => null);
				return reply('Gagal mengambil data video dari hasil pencarian.');
			}
		}

		const images = data.images || data.image || data.photo || data.images_url;
		if (images && images.length) {
			for (let i = 0; i < images.length; i++) {
				const caption = i === 0 ? [
					'*TIKTOK PHOTO SLIDE*',
					'----------------------------------------',
					'*Judul:* ' + (data.title || '-'),
					'*Uploader:* ' + getAuthor(data),
					'*Total Foto:* ' + images.length,
					'*Views:* ' + formatNumber(data.play_count),
					'',
					`© ${botName}`
				].join('\n') : '';

				await sock.sendMessage(
					m.chat,
					{
						image: { url: images[i] },
						caption
					},
					{ quoted: m }
				);

				if (i < images.length - 1) await delay(1500);
			}

			await sock.sendMessage(m.chat, { react: { text: '\u2728', key: m.key } }).catch(() => null);
			return;
		}

		const videoUrl = data.play || data.video || data.no_watermark || data.play_url || data.video_url;
		if (videoUrl) {
			const caption = [
				'*TIKTOK VIDEO DOWNLOADER*',
				'----------------------------------------',
				'*Judul:* ' + (data.title || '-'),
				'*Uploader:* ' + getAuthor(data),
				'*Durasi:* ' + formatDuration(data.duration),
				'*Views:* ' + formatNumber(data.play_count),
				'',
				`© ${botName}`
			].join('\n');

			await sock.sendMessage(
				m.chat,
				{
					video: { url: videoUrl },
					caption,
					mimetype: 'video/mp4'
				},
				{ quoted: m }
			);
		}

		const audio = data.music_info?.play || data.music || data.audio || data.music_url;
		if (audio) {
			await sock.sendMessage(
				m.chat,
				{
					audio: { url: audio },
					mimetype: 'audio/mpeg',
					fileName: `${data.title || 'tiktok_audio'}.mp3`
				},
				{ quoted: m }
			);
		}

		await sock.sendMessage(m.chat, { react: { text: '\u2728', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[TIKTOK ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '\u274C', key: m.key } }).catch(() => null);
		return reply('Terjadi kesalahan saat memproses TikTok: ' + (e.message || e));
	}
};

handler.help = ['tt <link|query>', 'ttdl <link|query>', 'tiktok <link|query>'];
handler.tags = ['downloader'];
handler.command = ['tt', 'ttdl', 'tiktok'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "downloader", "extra": ["tiktokdl"]})
