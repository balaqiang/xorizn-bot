import FormData from 'form-data';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

const getMediaBuffer = async (sock, msgObj) => {
	try {
		const realMsg = msgObj.fakeObj ? msgObj.fakeObj : (msgObj.message ? msgObj : { message: msgObj.msg || msgObj, key: msgObj.key || {} });
		return await downloadMediaMessage(realMsg, 'buffer', {}, { reuploadRequest: sock.updateMediaMessage });
	} catch (e) {
		try {
			if (typeof sock.downloadMediaMessage === 'function') {
				return await sock.downloadMediaMessage(msgObj);
			}
		} catch (err) {
			console.error('[GET MEDIA BUFFER ERROR]:', err.message);
		}
	}
	return null;
};

const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const q = m.quoted ? m.quoted : m;
	const inner = q.message || q.msg || q;
	const mime = q.mimetype || q.mediaType || inner.mimetype || inner.imageMessage?.mimetype || '';
	const mtype = q.mtype || inner.mtype || '';

	const isImage = /image/.test(mime) || mtype === 'imageMessage' || !!inner.imageMessage;

	if (!isImage) {
		return reply(`Kirim atau balas gambar dengan caption:\n*${pfx}${command} nama | durasi*\n\nContoh:\n*${pfx}${command} Bini | 01:08:00*\n*${pfx}${command} Ayang*`);
	}

	let nama = 'Bini';
	let durasi = '00:15:30';

	const input = (text || '').trim();
	if (input) {
		if (input.includes('|')) {
			const split = input.split('|');
			nama = split[0].trim() || nama;
			durasi = split[1].trim() || durasi;
		} else {
			nama = input;
		}
	} else if (m.pushName) {
		nama = m.pushName;
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const mediaBuffer = await getMediaBuffer(sock, q);
		if (!mediaBuffer || mediaBuffer.length === 0) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
			return reply('❌ Gagal mengunduh foto profil!');
		}

		const form = new FormData();
		form.append('profile', mediaBuffer, { filename: 'profile.jpg', contentType: 'image/jpeg' });
		form.append('nama', nama);
		form.append('durasi', durasi);

		const resultBuffer = await global.postApi('kyzz', '/api/canvas/fake-call', form, {
			responseType: 'arraybuffer'
		});

		if (!resultBuffer || resultBuffer.length === 0) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
			return reply('❌ Gagal membuat gambar fake call.');
		}

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

		return await sock.sendMessage(m.chat, {
			image: Buffer.from(resultBuffer),
			caption: `📞 *FAKE CALL*\n\n👤 *Nama:* ${nama}\n⏱️ *Durasi:* ${durasi}`
		}, { quoted: m });

	} catch (err) {
		console.error('[FAKE CALL ERROR]:', err);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply('❌ Terjadi kesalahan saat membuat fake call!');
	}
};

handler.help = ['fakecall <nama | durasi>'];
handler.tags = ['maker'];
handler.command = ['fakecall', 'fc', 'fakevc'];
handler.limit = true;

export default handler;