// Port dari 'plugin baru' (spotifydl.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const axios = require('axios')

async function getAudioBuffer(url) {
	const res = await axios.get(url, {
		responseType: 'arraybuffer',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
			'Accept': '*/*',
			'Accept-Encoding': 'gzip, deflate, br',
			'Referer': 'https://musicfab.org/'
		},
		timeout: 60000,
		maxRedirects: 10
	});
	return Buffer.from(res.data);
}

const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const botName = global.namaBot;
	const input = text || (m.quoted && (m.quoted.text || m.quoted.caption));

	if (!input) {
		return reply(
			'🎵 *SPOTIFY TRACK DOWNLOADER*\n\n' +
			'Unduh audio musik resmi dari Spotify format MP3.\n\n' +
			'*Format Penggunaan:*\n' +
			`• \`${pfx + command} <URL Spotify Track>\`\n\n` +
			'*Contoh:*\n' +
			`• \`${pfx + command} https://open.spotify.com/track/6pkIfOjEd2euk5ZEA9WNwU\``
		);
	}

	const spotifyRegex = /https?:\/\/(open\.)?spotify\.com\/(track|episode)\/[a-zA-Z0-9]+/;
	const match = input.match(spotifyRegex);

	if (!match) {
		return reply('❌ Tautan tidak valid. Masukkan link track Spotify yang benar.');
	}

	const spotifyUrl = match[0];
	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const json = await global.fetchApi('azbry', '/api/download/spotify', { url: spotifyUrl });

		if (!json?.status || (!json?.downloadLink && !json?.rawLink)) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
			return reply('❌ Gagal memproses lagu. Pastikan tautan tidak diprivat atau coba sesaat lagi.');
		}

		const title = json.title || 'Spotify Audio';
		const artist = json.author || 'Unknown Artist';
		const audioUrl = json.downloadLink || json.rawLink;

		const infoCaption = [
			'🎧 *SPOTIFY MUSIC DOWNLOADER*',
			'─────────────────────────',
			'',
			`• 🎵 *Judul:* ${title}`,
			`• 👤 *Artis:* ${artist}`,
			`• 🌐 *Sumber:* ${json.source || 'Spotify'}`,
			'',
			'Sedang mengambil berkas audio, mohon tunggu...',
			'',
			`© ${botName}`
		].join('\n');

		if (json.cover) {
			await sock.sendMessage(
				m.chat,
				{
					image: { url: json.cover },
					caption: infoCaption
				},
				{ quoted: m }
			);
		} else {
			await reply(infoCaption);
		}

		const audioBuffer = await getAudioBuffer(audioUrl);

		await sock.sendMessage(
			m.chat,
			{
				audio: audioBuffer,
				mimetype: 'audio/mpeg',
				fileName: `${title} - ${artist}.mp3`,
			},
			{ quoted: m }
		);

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[SPOTIFY DOWNLOAD ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Terjadi kesalahan saat mengunduh lagu: ${e.message || e}`);
	}
};

handler.help = ['spotify <url>', 'spotidl <url>'];
handler.tags = ['downloader'];
handler.command = ['spotifydl', 'spotidl'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "downloader", "extra": ["spotify"]})
