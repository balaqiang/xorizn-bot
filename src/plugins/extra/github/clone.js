// Feature: GitHub Suite Automation

import axios from 'axios';

const handler = async (m, { sock, text, usedPrefix, command }) => {
	if (!text) {
		return m.reply(`❌ *Format Salah!*\n\nContoh: *${usedPrefix}${command} whiskeysockets/baileys*\natau Link URL GitHub Repo.`);
	}

	let repoPath = text.trim();
	const urlMatch = repoPath.match(/github\.com\/([^\/]+\/[^\/]+)/);
	if (urlMatch) {
		repoPath = urlMatch[1].replace(/\.git$/, '');
	}

	const parts = repoPath.split('/');
	if (parts.length < 2) {
		return m.reply(`❌ Format repositori tidak valid! Gunakan format *owner/repository*.`);
	}

	const owner = parts[0];
	const repo = parts[1].replace(/\.git$/, '');

	await m.react('⏳');

	try {
		const headers = { 'user-agent': 'Mozilla/5.0' };
		if (global.tokengh) headers['Authorization'] = `token ${global.tokengh}`;

		const { data: repoInfo } = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers, timeout: 10000 });

		const defaultBranch = repoInfo.default_branch || 'main';
		const zipUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/${defaultBranch}`;

		const zipRes = await axios.get(zipUrl, {
			headers,
			responseType: 'arraybuffer',
			timeout: 30000
		});

		const buffer = Buffer.from(zipRes.data);
		if (!buffer || buffer.length < 100) {
			throw new Error('Buffer zip repositori kosong');
		}

		const caption = `📦 *GITHUB REPOSITORY CLONE*\n\n` +
			`• *Repo:* ${repoInfo.full_name}\n` +
			`• *Branch:* ${defaultBranch}\n` +
			`• *Stars:* ⭐ ${repoInfo.stargazers_count} | 🔀 ${repoInfo.forks_count} Forks\n` +
			`• *Ukuran ZIP:* ${(buffer.length / (1024 * 1024)).toFixed(2)} MB\n` +
			`• *Deskripsi:* ${repoInfo.description || '-'}`;

		await sock.sendMessage(m.chat, {
			document: buffer,
			fileName: `${repo}-${defaultBranch}.zip`,
			mimetype: 'application/zip',
			caption
		}, { quoted: m });

		await m.react('✅');
	} catch (err) {
		console.error('[GHCLONE ERROR]', err?.message || err);
		await m.react('❌');
		if (err?.response?.status === 404) {
			return m.reply(`❌ Repositori GitHub *${owner}/${repo}* tidak ditemukan atau bersifat Private!`);
		}
		return m.reply(`❌ Gagal mengunduh ZIP repositori GitHub: ${err?.message || 'Error occurred'}`);
	}
};

handler.command = ['ghclone', 'gitclone', 'downloadrepo'];
handler.limit = true;
handler.help = ['ghclone'];
handler.tags = ['github'];
handler.description = 'Unduh ZIP repositori publik dari GitHub';

handler.register = true;

handler.noJadiBot = true;

export default handler;
