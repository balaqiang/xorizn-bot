// Port dari 'plugin baru' (ttmp3.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
async function tikwm(url) {
	if (!url) throw new Error('URL TikTok tidak boleh kosong.');

	const res = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(url), {
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
		},
		signal: AbortSignal.timeout(30000)
	});

	const json = await res.json().catch(() => ({}));
	if (!json || json.code !== 0) throw new Error(json?.msg || 'Gagal mengambil data dari TikWM.');
	const d = json.data;

	return {
		id: d.id,
		title: d.title,
		author: {
			username: d.author?.unique_id || '-',
			nickname: d.author?.nickname || '-'
		},
		stats: {
			play: d.play_count || 0,
			like: d.digg_count || 0,
			comment: d.comment_count || 0,
			share: d.share_count || 0
		},
		music: {
			url: d.music,
			title: d.music_info?.title || 'tiktok_audio',
			author: d.music_info?.author || '-'
		}
	};
}

const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const botName = global.namaBot;
	const input = text || (m.quoted && (m.quoted.text || m.quoted.caption));

	if (!input) {
		return reply(
			'🎵 *TIKTOK AUDIO DOWNLOADER*\n\n' +
			'Unduh audio/soundtrack langsung dari video TikTok.\n\n' +
			'*Contoh Penggunaan:*\n' +
			'• `' + pfx + command + ' https://vt.tiktok.com/xxxxxx/`\n' +
			'• Balas pesan link TikTok dengan `' + pfx + command + '`'
		);
	}

	const urlMatch = input.trim().match(/https?:\/\/(?:[a-zA-Z0-9-]+\.)?tiktok\.com\/\S+/i);
	if (!urlMatch) {
		return reply('❌ URL tidak valid. Pastikan menyertakan tautan TikTok yang benar.');
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const d = await tikwm(urlMatch[0]);
		if (!d.music?.url) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
			return reply('❌ Audio tidak ditemukan atau video ini tidak memiliki file audio yang dapat diakses.');
		}

		const caption = [
			'🎵 *TIKTOK AUDIO IDENTIFIED*',
			'',
			'• 📌 *Judul:* ' + (d.title ? d.title.slice(0, 100) : '-'),
			'• 👤 *Author:* ' + d.author.nickname + ' (@' + d.author.username + ')',
			'• 🎼 *Sound:* ' + d.music.title + ' - ' + d.music.author,
			'• 👁️ *Plays:* ' + Number(d.stats.play).toLocaleString('id-ID'),
			'• ❤️ *Likes:* ' + Number(d.stats.like).toLocaleString('id-ID'),
			'',
			'© ' + botName
		].join('\n');

		await reply(caption);

		const res = await fetch(d.music.url, { signal: AbortSignal.timeout(45000) });
		if (!res.ok) throw new Error('Gagal mengunduh streaming audio dari CDN TikTok.');

		const buffer = Buffer.from(await res.arrayBuffer());
		const cleanTitle = (d.music.title || 'tiktok_audio')
			.replace(/[\\/:*?"<>|]/g, '')
			.trim()
			.slice(0, 60) || 'tiktok_audio';

		await sock.sendMessage(
			m.chat,
			{
				audio: buffer,
				mimetype: 'audio/mpeg',
				fileName: cleanTitle + '.mp3',
				ptt: false
			},
			{ quoted: m }
		);

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[TIKTOK AUDIO ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply('❌ Gagal mengunduh audio TikTok: ' + (e.message || e));
	}
};

handler.help = ['ttmp3 <link tiktok>', 'ttaudio <link tiktok>'];
handler.tags = ['downloader'];
handler.command = ['ttmp3', 'ttaudio', 'tiktokmp3', 'tiktokaudio'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "downloader"})
