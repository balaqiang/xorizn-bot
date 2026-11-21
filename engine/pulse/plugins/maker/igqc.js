import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const q = m.quoted ? m.quoted : m;
	const mime = (q.msg || q).mimetype || '';
	const txt = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : '');

	if (!txt) return reply(`Ketik teksnya!\n*Contoh:* \`${pfx}${command} lawak\``);

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		let imgBuffer = null;

		if (/image/.test(mime)) {
			if (typeof q.download === 'function') {
				imgBuffer = await q.download().catch(() => null);
			} else if (typeof sock.downloadMediaMessage === 'function') {
				imgBuffer = await sock.downloadMediaMessage(q).catch(() => null);
			}
		}

		if (!imgBuffer) {
			const localAv = path.join(process.cwd(), 'src/avatar_contact.png');
			const pfp = await sock.profilePictureUrl(m.sender, 'image').catch(() => null);

			if (pfp && typeof global.getBuffer === 'function') {
				imgBuffer = await global.getBuffer(pfp).catch(() => null);
			}

			if (!imgBuffer && fs.existsSync(localAv)) {
				try { imgBuffer = fs.readFileSync(localAv); } catch (_) {}
			}

			if (!imgBuffer && typeof global.getBuffer === 'function') {
				imgBuffer = await global.getBuffer('https://files.catbox.moe/sd61v3.jpg').catch(() => null);
			}
		}

		if (!imgBuffer) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
			return reply('❌ Gagal memuat avatar profil pengguna.');
		}

		const form = new FormData();
		form.append('image', imgBuffer, { filename: 'image.png', contentType: 'image/png' });
		form.append('txt', txt);
		form.append('menuTimeStr', '');

		const res = await global.postApi('kyzz', '/api/canvas/igqc', form, {
			responseType: 'arraybuffer'
		});

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

		return await sock.sendMessage(m.chat, {
			image: Buffer.from(res)
		}, { quoted: m });

	} catch (e) {
		console.error('[IGQC ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Error: ${e.message || e}`);
	}
};

handler.help = ['igc <teks>'];
handler.tags = ['maker'];
handler.command = ['igqc', 'igc'];
handler.limit = true;

export default handler;