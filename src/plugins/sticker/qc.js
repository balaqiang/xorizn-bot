// Port dari 'plugin baru' (qc.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const FormData = require('form-data')

const DEFAULT_AVATAR = 'https://files.catbox.moe/sd61v3.jpg';

const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const txt = text || (m.quoted ? m.quoted.text || m.quoted.caption : '');

	if (!txt) {
		return reply(`⚠️ Masukkan teks untuk membuat Quote Sticker!\n\n*Contoh:* \`${pfx}${command} Halo Semuanya!\``);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const sender = m.quoted ? m.quoted.sender : m.sender;

		let name = '';
		if (m.quoted && m.quoted.sender === sender) {
			name = m.quoted.pushName || m.quoted.name || m.quoted.vname || m.quoted.verifiedName || '';
		} else {
			name = m.pushName || m.pushname || m.name || m.vname || m.verifiedName || '';
		}

		if ((!name || name.includes('@') || /^\d+$/.test(name.trim())) && typeof sock?.getName === 'function') {
			try {
				const cName = await sock.getName(sender);
				if (cName && !cName.includes('@') && !/^\d+$/.test(cName.trim())) {
					name = cName;
				}
			} catch (_) {}
		}

		if (!name || name.includes('@')) {
			name = sender.split('@')[0].split(':')[0];
		}

		let pfpBuffer = null;
		try {
			const pfpUrl = await sock.profilePictureUrl(sender, 'image').catch(() => null);
			if (pfpUrl && typeof global.getBuffer === 'function') {
				const buf = await global.getBuffer(pfpUrl).catch(() => null);
				if (buf && buf.length > 100) pfpBuffer = buf;
			}
		} catch (_) {}

		if (!pfpBuffer) {
			const localAv = path.join(process.cwd(), 'src/avatar_contact.png');
			if (fs.existsSync(localAv)) {
				try { pfpBuffer = fs.readFileSync(localAv); } catch (_) {}
			}
		}

		if (!pfpBuffer && typeof global.getBuffer === 'function') {
			const defaultAvatars = [
				DEFAULT_AVATAR,
				'https://i.ibb.co/3Fh9V6p/avatar-contact.png',
				'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
			];
			for (const avatarUrl of defaultAvatars) {
				try {
					const buf = await global.getBuffer(avatarUrl).catch(() => null);
					if (buf && buf.length > 100) {
						pfpBuffer = buf;
						break;
					}
				} catch (_) {}
			}
		}

		if (!pfpBuffer) {
			const svgAvatar = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
				<rect width="512" height="512" fill="#cfd8dc"/>
				<circle cx="256" cy="190" r="90" fill="#ffffff"/>
				<path d="M256 310 c-110 0 -170 60 -170 140 L426 450 c0 -80 -60 -140 -170 -140 Z" fill="#ffffff"/>
			</svg>`;
			pfpBuffer = Buffer.from(svgAvatar);
		}

		const form = new FormData();
		form.append('media', pfpBuffer, { filename: 'avatar.jpg', contentType: 'image/jpeg' });
		form.append('text', txt);
		form.append('name', name);

		const res = await global.postApi('kyzz', '/api/maker/qc', form, {
			responseType: 'arraybuffer'
		});

		let rawBuffer = null;
		const strRes = Buffer.from(res).toString('utf-8');

		if (strRes.startsWith('{') && strRes.endsWith('}')) {
			try {
				const json = JSON.parse(strRes);
				if (json.status === false || json.error) {
					throw new Error(json.message || json.error || 'Gagal membuat Quote Sticker.');
				}
				const imgUrl = json.url || json.result || json.image;
				if (imgUrl && typeof global.getBuffer === 'function') {
					rawBuffer = await global.getBuffer(imgUrl);
				} else {
					throw new Error('Respon API tidak memuat gambar sticker.');
				}
			} catch (parseErr) {
				rawBuffer = Buffer.from(res);
			}
		} else {
			rawBuffer = Buffer.from(res);
		}

		const packname = global.packname || 'only';
		const author = global.author || 'xorizn-bot';

		const webpFull = await sharp(rawBuffer)
			.trim()
			.resize(512, 512, {
				fit: 'contain',
				background: { r: 0, g: 0, b: 0, alpha: 0 }
			})
			.webp()
			.toBuffer();

		const stickerBuffer = await global.addExif(webpFull, packname, author);

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

		return await sock.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });

	} catch (e) {
		console.error('[QC ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ *Gagal membuat QC:* ${e.message || 'Terjadi kesalahan pada server.'}`);
	}
};

handler.help = ['qc <teks>'];
handler.tags = ['maker'];
handler.command = ['qc', 'quotechat'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "sticker", "extra": ["fakechat", "fc"]})
