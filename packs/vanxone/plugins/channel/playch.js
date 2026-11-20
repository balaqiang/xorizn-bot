// Port dari 'plugin baru' (playch.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const axios = require('axios')
const {prepareWAMessageMedia, generateMessageIDV2, proto} = require('@whiskeysockets/baileys')
const {Toptt, searchYoutube, downloadYoutube} = require('../../lib/engine/core/playch')

const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const botName = global.namaBot;
	const input = (text || '').trim();

	if (!input) {
		return reply(
			'*YOUTUBE PLAY TO CHANNEL (NEWSLETTER)*\n\n' +
			'Format:\n' +
			'- `' + usedPrefix + command + ' <judul lagu> | <id_channel>`\n\n' +
			'*Contoh:*\n' +
			'- `' + usedPrefix + command + ' honeystars | 12036323xxxxxxxxx@newsletter`'
		);
	}

	const totalSeparator = (input.match(/\|/g) || []).length;

	// Mode 1: Kirim audio langsung ke channel via separator |
	if (totalSeparator === 1 || (!input.startsWith('action|send|') && totalSeparator === 0)) {
		const [queryText, channelIdInput] = input.split('|').map((v) => (v ? v.trim() : ''));

		if (!queryText || !channelIdInput || !channelIdInput.endsWith('@newsletter')) {
			return reply(
				'Format salah atau ID Channel tidak valid!\n\n' +
				'*Contoh:*\n' +
				'`' + usedPrefix + command + ' honeystars | 12036323xxxxxxxxx@newsletter`'
			);
		}

		await sock.sendMessage(m.chat, { react: { text: '\u23F3', key: m.key } }).catch(() => null);

		try {
			const searchResults = await searchYoutube(queryText);
			const firstVideo = searchResults[0];

			if (!firstVideo || !firstVideo.link) {
				await sock.sendMessage(m.chat, { react: { text: '\u274C', key: m.key } }).catch(() => null);
				return reply(`Lagu tidak ditemukan untuk pencarian: "${queryText}"`);
			}

			const audioResult = await downloadYoutube(firstVideo.link);
			if (!audioResult || !audioResult.buffer) {
				throw new Error('Gagal mendapatkan audio.');
			}

			const rawBuffer = audioResult.buffer;
			const pttBuffer = await Toptt(rawBuffer);

			const preparedAudio = await prepareWAMessageMedia(
				{
					audio: pttBuffer,
					mimetype: 'audio/ogg; codecs=opus',
					ptt: true
				},
				{ upload: sock.waUploadToServer, jid: channelIdInput }
			);

			const audioMsgPayload = {
				audioMessage: {
					...preparedAudio.audioMessage,
					ptt: true,
					mimetype: 'audio/ogg; codecs=opus',
					waveform: new Uint8Array([100, 80, 60, 100, 40, 80, 100, 50])
				}
			};

			const msgId = typeof generateMessageIDV2 === 'function'
				? generateMessageIDV2(sock.user?.id)
				: (m.key.id || `${Date.now()}`);

			const node = {
				tag: 'message',
				attrs: {
					to: channelIdInput,
					id: msgId,
					type: 'media'
				},
				content: [{
					tag: 'plaintext',
					attrs: { mediatype: 'audio' },
					content: proto.Message.encode(audioMsgPayload).finish()
				}]
			};

			await sock.query(node);

			const successText = [
				'*AUDIO BERHASIL DIKIRIM KE SALURAN!*',
				'----------------------------------------',
				`*Judul:* ${audioResult.title || firstVideo.title}`,
				`*Channel:* ${firstVideo.channel || 'YouTube'}`,
				`*Target:* ${channelIdInput}`,
				`*Sumber:* ${firstVideo.link}`,
				'',
				`© ${botName}`
			].join('\n');

			await reply(successText);
			await sock.sendMessage(m.chat, { react: { text: '\u2728', key: m.key } }).catch(() => null);

		} catch (err) {
			console.error('[PLAYCH ERROR]:', err);
			await sock.sendMessage(m.chat, { react: { text: '\u274C', key: m.key } }).catch(() => null);
			return reply('Gagal memproses audio ke saluran: ' + (err.message || err));
		}
	}

	// Mode 2: Callback Tombol / Payload Spesifik
	else if (input.startsWith('action|send|') || totalSeparator >= 3) {
		const rawText = input.startsWith('action|send|') ? input.replace('action|send|', '') : input;
		const [queryText, thumbUrl, channelName, channelId] = rawText.split('|').map((v) => (v ? v.trim() : ''));

		if (!channelId || !channelId.endsWith('@newsletter')) {
			return reply('ID Channel target tidak valid!');
		}

		await sock.sendMessage(m.chat, { react: { text: '\u23F3', key: m.key } }).catch(() => null);

		try {
			const searchResults = await searchYoutube(queryText);
			const firstVideo = searchResults[0];

			if (!firstVideo || !firstVideo.link) {
				throw new Error('Gagal menemukan tautan lagu dari YouTube.');
			}

			const audioResult = await downloadYoutube(firstVideo.link);
			if (!audioResult || !audioResult.buffer) {
				throw new Error('Gagal mendapatkan audio.');
			}

			const rawBuffer = audioResult.buffer;
			const pttBuffer = await Toptt(rawBuffer);

			const preparedAudio = await prepareWAMessageMedia(
				{
					audio: pttBuffer,
					mimetype: 'audio/ogg; codecs=opus',
					ptt: true
				},
				{ upload: sock.waUploadToServer, jid: channelId }
			);

			const audioMsgPayload = {
				audioMessage: {
					...preparedAudio.audioMessage,
					ptt: true,
					mimetype: 'audio/ogg; codecs=opus',
					waveform: new Uint8Array([100, 80, 60, 100, 40, 80, 100, 50])
				}
			};

			const msgId = typeof generateMessageIDV2 === 'function'
				? generateMessageIDV2(sock.user?.id)
				: (m.key.id || `${Date.now()}`);

			const node = {
				tag: 'message',
				attrs: {
					to: channelId,
					id: msgId,
					type: 'media'
				},
				content: [{
					tag: 'plaintext',
					attrs: { mediatype: 'audio' },
					content: proto.Message.encode(audioMsgPayload).finish()
				}]
			};

			await sock.query(node);

			const successText = [
				'*AUDIO BERHASIL DIKIRIM KE SALURAN!*',
				'----------------------------------------',
				`*Judul:* ${audioResult.title || queryText}`,
				`*Channel:* ${channelName || 'YouTube'}`,
				`*Target:* ${channelId}`,
				`*Sumber:* ${firstVideo.link}`,
				'',
				`© ${botName}`
			].join('\n');

			await reply(successText);
			await sock.sendMessage(m.chat, { react: { text: '\u2728', key: m.key } }).catch(() => null);

		} catch (err) {
			console.error('[PLAYCH CALLBACK ERROR]:', err);
			await sock.sendMessage(m.chat, { react: { text: '\u274C', key: m.key } }).catch(() => null);
			return reply('Gagal memproses audio ke saluran: ' + (err.message || err));
		}
	}
};

handler.help = ['playch <lagu> | <id@newsletter>'];
handler.tags = ['owner', 'premium'];
handler.command = ['playch', 'ytplaych'];
handler.owner = true;
handler.mainOwner = true

module.exports = S.wrap(handler, {"category": "channel", "extra": ["laguch", "musikch"]})
