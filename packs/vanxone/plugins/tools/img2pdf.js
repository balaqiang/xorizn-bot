// Port dari 'plugin baru' (img2pdf.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const PDFDocument = require('pdfkit')
const sharp = require('sharp')
const {downloadMediaMessage} = require('@whiskeysockets/baileys')

const extractMediaBuffer = async (msgObj, sock) => {
	if (!msgObj) return null;
	if (Buffer.isBuffer(msgObj)) return msgObj;
	if (typeof msgObj.download === 'function') {
		try {
			const buf = await msgObj.download();
			if (buf && Buffer.isBuffer(buf)) return buf;
		} catch (_) {}
	}

	const rawMsg = msgObj.message || msgObj.msg || msgObj;
	const innerMsg = rawMsg.imageMessage || rawMsg.documentMessage || rawMsg.viewOnceMessageV2?.message?.imageMessage || rawMsg.viewOnceMessage?.message?.imageMessage;

	if (innerMsg) {
		try {
			const buf = await downloadMediaMessage(
				{ key: msgObj.key || {}, message: rawMsg },
				'buffer',
				{},
				{ logger: console, reuploadRequest: sock?.updateMediaMessage }
			);
			if (buf && Buffer.isBuffer(buf)) return buf;
		} catch (_) {}
	}
	return null;
};

const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const botName = global.namaBot;
	const qmsg = m.quoted ? m.quoted : m;

	let targetMessages = [];

	if (m.quoted) {
		const qId = m.quoted.id || m.quoted.key?.id;
		const cachedAlbum = qId ? global.albumCache?.get(qId) : null;

		if (cachedAlbum && Array.isArray(cachedAlbum.messages) && cachedAlbum.messages.length > 0) {
			targetMessages = cachedAlbum.messages;
		} else {
			const qFake = m.quoted.fakeObj || {};
			const qFakeMsg = qFake.message || qFake.msg || {};
			const qMsgObj = m.quoted.message || m.quoted.msg || {};

			if (Array.isArray(m.quoted.messages) && m.quoted.messages.length > 0) {
				targetMessages = m.quoted.messages;
			} else if (Array.isArray(m.quoted.medias) && m.quoted.medias.length > 0) {
				targetMessages = m.quoted.medias;
			} else if (m.quoted.album && Array.isArray(m.quoted.album)) {
				targetMessages = m.quoted.album;
			} else if (qFakeMsg?.albumMessage) {
				const alb = qFakeMsg.albumMessage;
				targetMessages = alb.messages || alb.medias || alb.items || alb.contents || [];
			} else if (qMsgObj?.albumMessage) {
				const alb = qMsgObj.albumMessage;
				targetMessages = alb.messages || alb.medias || alb.items || alb.contents || [];
			}
		}

		if (targetMessages.length <= 1) {
			const rawTs = m.quoted.messageTimestamp || m.quoted.msg?.messageTimestamp || 0;
			const qTs = typeof rawTs === 'number' && !isNaN(rawTs) ? rawTs : 0;
			const qSender = m.quoted.sender || m.quoted.key?.participant || m.quoted.key?.remoteJid;

			const storeMsgs = (global._recentMediaCache?.get(m.chat) || []).concat(global.db?.data?.messages?.[m.chat] || global.store?.messages?.[m.chat]?.array || []);
			if (storeMsgs.length > 0) {
				const albumCluster = storeMsgs.filter(msg => {
					const ts = msg.messageTimestamp || msg.msg?.messageTimestamp || 0;
					const sender = msg.sender || msg.key?.participant || msg.key?.remoteJid;
					const sameSender = qSender ? (sender === qSender) : true;
					const validTime = (qTs > 0 && ts > 0) ? Math.abs(ts - qTs) <= 25 : true;
					const mime = msg.mimetype || msg.msg?.mimetype || '';
					const isImg = msg.mtype === 'imageMessage' || /image/.test(mime);
					return sameSender && validTime && isImg;
				});
				if (albumCluster.length > 1) {
					targetMessages = albumCluster;
				}
			}
		}

		if (targetMessages.length === 0) {
			targetMessages = [qmsg];
		}
	} else {
		targetMessages = [m];
	}

	const isImageCandidate = (msg) => {
		if (!msg) return false;
		if (msg.mtype === 'imageMessage') return true;
		const mime = msg.mimetype || msg.msg?.mimetype || (msg.message?.imageMessage?.mimetype) || '';
		return /image\/(png|jpe?g|webp|bmp)/i.test(mime);
	};

	const validMediaMsgs = targetMessages.filter(isImageCandidate);

	if (!validMediaMsgs.length) {
		const help = [
			'📄 *IMAGE TO PDF CONVERTER*',
			'',
			'Kirim atau balas foto / album foto untuk digabungkan menjadi dokumen PDF.',
			'',
			`*Format Penggunaan:* \`${pfx + command} [namafile]\``,
			`*Contoh:* \`${pfx + command} Dokumen_Tugas\``,
			'',
			'• Mendukung single image dan album multi-image sekaligus.'
		].join('\n');
		return reply(help);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const imageBuffers = [];
		for (const msg of validMediaMsgs) {
			const buf = await extractMediaBuffer(msg, sock);
			if (buf) {
				const convertedJpeg = await sharp(buf)
					.jpeg({ quality: 90 })
					.toBuffer()
					.catch(() => null);

				if (convertedJpeg) {
					const meta = await sharp(convertedJpeg).metadata().catch(() => null);
					imageBuffers.push({
						buffer: convertedJpeg,
						width: meta?.width || 595.28,
						height: meta?.height || 841.89
					});
				}
			}
		}

		if (!imageBuffers.length) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
			return reply('❌ Gagal mengunduh dan memproses media gambar.');
		}

		const customFileName = (text || '').trim().replace(/[^a-zA-Z0-9_\- ]/g, '') || `Elysia_Doc_${Date.now()}`;
		const finalPdfName = customFileName.endsWith('.pdf') ? customFileName : `${customFileName}.pdf`;

		const doc = new PDFDocument({ autoFirstPage: false });
		const chunks = [];

		doc.on('data', chunk => chunks.push(chunk));

		for (const img of imageBuffers) {
			doc.addPage({
				size: [img.width, img.height],
				margin: 0
			});
			doc.image(img.buffer, 0, 0, {
				width: img.width,
				height: img.height
			});
		}

		doc.end();

		const pdfBuffer = await new Promise((resolve) => {
			doc.on('end', () => resolve(Buffer.concat(chunks)));
		});

		const caption = [
			'📄 *DOKUMEN PDF BERHASIL DIBUAT*',
			'',
			`• 📝 *Nama File:* ${finalPdfName}`,
			`• 🖼️ *Total Halaman:* ${imageBuffers.length} Halaman`,
			`• 📦 *Ukuran File:* ${(pdfBuffer.length / 1024).toFixed(2)} KB`,
			'',
			`© ${botName}`
		].join('\n');

		// Kirim dokumen dengan native button download/copy
		await S.sendButtons(sock, m.chat, {
			media: { document: pdfBuffer, mimetype: 'application/pdf', fileName: finalPdfName },
			text: caption,
			buttons: [
				{ displayText: '📋 Salin Nama File', copy: finalPdfName }
			]
		}, { quoted: m });

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[IMG2PDF ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Terjadi kesalahan saat membuat PDF: ${e.message || e}`);
	}
};

handler.help = ['img2pdf [namafile]', 'topdf [namafile]'];
handler.tags = ['tools'];
handler.command = ['img2pdf', 'topdf', 'imagetopdf', 'fototopdf'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "tools"})
