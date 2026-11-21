// Port dari 'plugin baru' (whatmusic.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const {downloadMediaMessage} = require('@whiskeysockets/baileys')

async function identifyAudio(buffer) {
	const form = new FormData();
	form.append('file', new Blob([buffer], { type: 'audio/mpeg' }), 'sample.mp3');
	form.append('api_token', 'test');
	form.append('return', 'apple_music,spotify');

	const res = await fetch('https://api.audd.io/', {
		method: 'POST',
		body: form
	});

	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const data = await res.json();

	if (data.status !== 'success' || !data.result) return null;
	return data.result;
}

const getMediaBuffer = async (sock, msgObj) => {
	if (!msgObj) return null;
	if (Buffer.isBuffer(msgObj)) return msgObj;
	if (typeof msgObj.download === 'function') {
		try {
			const buf = await msgObj.download();
			if (buf && Buffer.isBuffer(buf)) return buf;
		} catch (_) {}
	}

	try {
		const realMsg = msgObj.fakeObj ? msgObj.fakeObj : (msgObj.message ? msgObj : { message: msgObj.msg || msgObj, key: msgObj.key || {} });
		return await downloadMediaMessage(
			realMsg,
			'buffer',
			{},
			{ logger: console, reuploadRequest: sock?.updateMediaMessage }
		);
	} catch (e) {
		console.error('[GET MEDIA BUFFER ERROR]:', e.message);
	}
	return null;
};

const handler = async (m, { sock, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const target = m.quoted ? m.quoted : m;
	const msgBody = target.message || target.msg || target;
	const mime = msgBody.mimetype || target.mimetype || target.mtype || '';

	if (!/audio|video/.test(mime)) {
		return reply(
			`🎵 *SONG FINDER / WHAT MUSIC*\n\n` +
			`Deteksi judul lagu dari cuplikan audio atau video.\n\n` +
			`*Contoh Penggunaan:*\n` +
			`Kirim atau reply audio/video dengan: \`${pfx + command}\``
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const media = await getMediaBuffer(sock, target);
		if (!media || !Buffer.isBuffer(media) || media.length === 0) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
			return reply('❌ Gagal mengunduh file media audio/video.');
		}

		const track = await identifyAudio(media);

		if (!track) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
			return reply('❌ Lagu tidak ditemukan atau tidak terdeteksi oleh sistem.');
		}

		const title = track.title || '-';
		const artist = track.artist || '-';
		const album = track.album || '-';
		const release = track.release_date || '-';
		const spotifyUrl = track.spotify?.external_urls?.spotify || '';
		const appleUrl = track.apple_music?.url || '';
		const primaryUrl = spotifyUrl || appleUrl || '';

		const captionLines = [
			'🎵 *SONG IDENTIFIED*',
			'',
			`📌 *Judul:* ${title}`,
			`👤 *Artis:* ${artist}`,
			`💿 *Album:* ${album}`,
			`📅 *Rilis:* ${release}`
		];

		if (primaryUrl) {
			captionLines.push(`🔗 *Link:* ${primaryUrl}`);
		}

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

		return await reply(captionLines.join('\n'));

	} catch (e) {
		console.error('[SONGFINDER ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Error saat mendeteksi lagu: ${e.message || e}`);
	}
};

handler.help = ['whatmusic', 'songfinder'];
handler.tags = ['tools'];
handler.command = ['whatmusic', 'songfinder', 'shazam'];
handler.limit = true

module.exports = S.wrap(handler, {"category": "tools"})
