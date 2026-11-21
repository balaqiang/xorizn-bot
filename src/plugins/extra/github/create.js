// Feature: GitHub Suite Automation

import axios from 'axios';

const handler = async (m, { sock, args, usedPrefix, command }) => {
	if (!global.tokengh) {
		return m.reply(`❌ *Token GitHub Belum Diset!*\n\nGunakan *${usedPrefix}setghtoken ghp_xxxx* untuk mengatur token.`);
	}

	if (!args[0]) {
		return m.reply(`❌ *Format Salah!*\n\nContoh: *${usedPrefix}${command} my-new-bot public*\natau *${usedPrefix}${command} my-secret-project private*`);
	}

	const repoName = args[0].trim().replace(/[^a-zA-Z0-9_-]/g, '');
	const isPrivate = args[1] && args[1].toLowerCase() === 'private';

	await m.react('⏳');

	try {
		const headers = {
			'user-agent': 'Mozilla/5.0',
			'Authorization': `token ${global.tokengh}`,
			'Accept': 'application/vnd.github.v3+json'
		};

		const { data } = await axios.post('https://api.github.com/user/repos', {
			name: repoName,
			description: `Repository created via ${global.namaBot || 'WhatsApp Bot'}`,
			private: isPrivate,
			auto_init: true
		}, { headers, timeout: 15000 });

		const textMsg = `✅ *REPOSITORI GITHUB BERHASIL DIBUAT!*\n\n` +
			`• *Nama Repo:* ${data.name}\n` +
			`• *Full Name:* ${data.full_name}\n` +
			`• *Tipe:* ${data.private ? '🔒 Private' : '🌐 Public'}\n` +
			`• *Default Branch:* ${data.default_branch}\n` +
			`• *Clone URL:* ${data.clone_url}\n` +
			`• *Web URL:* ${data.html_url}`;

		await sock.sendButtons(m.chat, {
			location: {
				degreesLatitude: 0,
				degreesLongitude: 0,
				address: `GitHub Repo Manager • ${data.name}`,
				jpegThumbnail: global.getThumbBuffer ? Buffer.from(global.getThumbBuffer(), 'base64') : Buffer.alloc(0),
			},
			text: textMsg,
			footer: `${global.namaBot || 'Bot'} • GitHub API Manager`,
			buttons: [
				{ url: data.html_url, text: '🌐 Buka Repository' },
				{ id: `${usedPrefix}ghclone ${data.full_name}`, text: '📦 Download ZIP' }
			]
		}, { quoted: m });

		await m.react('✅');
	} catch (err) {
		console.error('[GHCREATE ERROR]', err?.response?.data || err?.message || err);
		await m.react('❌');
		const errMsg = err?.response?.data?.message || err?.message || 'Error occurred';
		return m.reply(`❌ Gagal membuat repositori GitHub!\nReason: ${errMsg}`);
	}
};

handler.help = ['ghcreate'];
handler.tags = ['github'];
handler.command = ['ghcreate', 'createrepo', 'newrepo'];
handler.limit = true;
handler.owner = true;
handler.noJadiBot = true;

handler.register = true;

export default handler;
