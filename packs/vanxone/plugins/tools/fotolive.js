// Port dari 'plugin baru' (fotolive.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const ffmpeg = require('fluent-ffmpeg')
const {downloadContentFromMessage, prepareWAMessageMedia, generateWAMessageFromContent} = require('@whiskeysockets/baileys')

const handler = async (m, { sock, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const q = m.quoted ? m.quoted : m;
	const mime = (q.msg || q).mimetype || q.mimetype || q.mtype || '';

	if (!/video/.test(mime)) {
		return reply(
			`*LIVE PHOTO MAKER*\n\n` +
			`Ubah video pendek menjadi WhatsApp Live Photo berpasangan.\n\n` +
			`*Contoh Penggunaan:*\n` +
			`Kirim atau reply video dengan caption: \`${pfx + command}\``
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	const flTmpVideo = path.join(os.tmpdir(), `lv_video_${Date.now()}.mp4`);
	const flTmpThumb = path.join(os.tmpdir(), `lv_thumb_${Date.now()}.jpg`);

	try {
		let flVideoBuffer = null;

		if (typeof q.download === 'function') {
			flVideoBuffer = await q.download();
		} else {
			const flVideoMsgObj = q.msg || q;

			if (!flVideoMsgObj || (!flVideoMsgObj.mediaKey && !flVideoMsgObj.url)) {
				await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
				return reply('❌ Media video tidak valid atau telah kedaluwarsa.');
			}

			const flStream = await downloadContentFromMessage(flVideoMsgObj, 'video');
			const chunks = [];
			for await (const chunk of flStream) {
				chunks.push(chunk);
			}
			flVideoBuffer = Buffer.concat(chunks);
		}

		if (!flVideoBuffer || !Buffer.isBuffer(flVideoBuffer) || flVideoBuffer.length === 0) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
			return reply('❌ Gagal mengunduh media video.');
		}

		await fs.promises.writeFile(flTmpVideo, flVideoBuffer);

		await new Promise((resolve, reject) => {
			ffmpeg(flTmpVideo)
				.outputOptions(['-vframes 1', '-q:v 2'])
				.output(flTmpThumb)
				.on('end', resolve)
				.on('error', reject)
				.run();
		});

		const flThumbBuffer = await fs.promises.readFile(flTmpThumb);

		const flImageMedia = await prepareWAMessageMedia(
			{ image: flThumbBuffer },
			{ upload: sock.waUploadToServer }
		);

		const flVideoMedia = await prepareWAMessageMedia(
			{ video: flVideoBuffer },
			{ upload: sock.waUploadToServer }
		);

		const flPhotoMsg = generateWAMessageFromContent(
			m.chat,
			{
				imageMessage: {
					...flImageMedia.imageMessage,
					contextInfo: { pairedMediaType: 5, statusSourceType: 0 }
				}
			},
			{ quoted: m }
		);

		await sock.relayMessage(m.chat, flPhotoMsg.message, { messageId: flPhotoMsg.key.id });

		await sock.relayMessage(
			m.chat,
			{
				videoMessage: {
					...flVideoMedia.videoMessage,
					contextInfo: { pairedMediaType: 6, statusSourceType: 0 }
				},
				messageContextInfo: {
					messageAssociation: { associationType: 12, parentMessageKey: flPhotoMsg.key }
				}
			},
			{}
		);

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[FOTOLIVE ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal membuat Live Photo: ${e.message || e}`);
	} finally {
		if (fs.existsSync(flTmpVideo)) await fs.promises.unlink(flTmpVideo).catch(() => null);
		if (fs.existsSync(flTmpThumb)) await fs.promises.unlink(flTmpThumb).catch(() => null);
	}
};

handler.help = ['fotolive'];
handler.tags = ['tools'];
handler.command = ['fotolive', 'livephoto', 'livepic'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "tools"})
