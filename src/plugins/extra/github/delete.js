// Feature: GitHub Suite Automation

import axios from 'axios';

const handler = async (m, { sock, args, usedPrefix, command }) => {
	if (!global.tokengh) {
		return m.reply(`❌ *Token GitHub Belum Diset!*\n\nGunakan *${usedPrefix}setghtoken ghp_xxxx* untuk mengatur token.`);
	}

	if (!args[0]) {
		return m.reply(`❌ *Format Salah!*\n\nContoh: *${usedPrefix}${command} nama-repo-yang-ingin-dihapus*`);
	}

	await m.react('⏳');

	try {
		const headers = {
			'user-agent': 'Mozilla/5.0',
			'Authorization': `token ${global.tokengh}`,
			'Accept': 'application/vnd.github.v3+json'
		};

		const { data: user } = await axios.get('https://api.github.com/user', { headers, timeout: 10000 });
		const repoName = args[0].trim().replace(/^https?:\/\/github\.com\//i, '').replace(/^[^\/]+\//, '').replace(/\/$/, '');
		await axios.delete(`https://api.github.com/repos/${user.login}/${repoName}`, { headers, timeout: 15000 });

		await m.react('✅');
		return m.reply(`🗑️ *REPOSITORI BERHASIL DIHAPUS*\n\nRepositori *${user.login}/${repoName}* telah berhasil dihapus secara permanen dari akun GitHub.`);
	} catch (err) {
		console.error('[GHDELETE ERROR]', err?.response?.data || err?.message || err);
		await m.react('❌');
		const errMsg = err?.response?.data?.message || err?.message || 'Error occurred';
		return m.reply(`❌ Gagal menghapus repositori GitHub!\nReason: ${errMsg}`);
	}
};

handler.help = ['ghdelete'];
handler.tags = ['github'];
handler.command = ['ghdelete', 'ghdel', 'deleterepo'];
handler.limit = true;
handler.owner = true;
handler.noJadiBot = true;

handler.register = true;

export default handler;
