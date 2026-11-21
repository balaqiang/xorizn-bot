// Port dari 'plugin baru' (gdrive.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const formatBytes = (bytes, decimals = 2) => {
	if (!bytes || bytes === 0) return '0 Bytes';
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

async function GDriveDl(url) {
	if (!url || !/drive\.google\.com/i.test(url)) throw new Error('URL Google Drive tidak valid.');

	const id = (url.match(/\/?id=([^&]+)/i) || url.match(/\/d\/([^/]+)/i) || [])[1];
	if (!id) throw new Error('ID file Google Drive tidak ditemukan.');

	const res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
		method: 'POST',
		headers: {
			'accept-encoding': 'gzip, deflate, br',
			'content-length': '0',
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			'origin': 'https://drive.google.com',
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
			'x-drive-first-party': 'DriveWebUi',
			'x-json-requested': 'true'
		},
		signal: AbortSignal.timeout(30000)
	});

	const rawText = await res.text();
	const cleanJson = rawText.startsWith(")]}'") ? rawText.slice(4) : rawText;
	const parsed = JSON.parse(cleanJson);

	const { fileName, sizeBytes, downloadUrl } = parsed;
	if (!downloadUrl) throw new Error('Akses unduhan limit atau membutuhkan izin akses.');

	const headRes = await fetch(downloadUrl, { method: 'HEAD' });
	const mimetype = headRes.headers.get('content-type') || 'application/octet-stream';

	return {
		downloadUrl,
		fileName: fileName || `gdrive_file_${id}`,
		fileSize: formatBytes(sizeBytes || 0),
		mimetype
	};
}

const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const input = text || (m.quoted && (m.quoted.text || m.quoted.caption));

	if (!input) {
		return reply(
			`📥 *GOOGLE DRIVE DOWNLOADER*\n\n` +
			`Unduh file publik langsung dari Google Drive.\n\n` +
			`*Contoh Penggunaan:*\n` +
			`• \`${pfx + command} https://drive.google.com/file/d/xxxxxx/view\`\n` +
			`• Balas link Google Drive dengan \`${pfx + command}\``
		);
	}

	const urlMatch = input.trim().match(/https?:\/\/drive\.google\.com\/\S+/i);
	if (!urlMatch) {
		return reply('❌ URL tidak valid. Pastikan tautan berasal dari drive.google.com');
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const res = await GDriveDl(urlMatch[0]);

		const caption = [
			'📥 *GOOGLE DRIVE DOWNLOADED*',
			'',
			`• 📝 *Nama File:* ${res.fileName}`,
			`• 💾 *Ukuran:* ${res.fileSize}`,
			`• 📦 *Mime:* ${res.mimetype}`,
			'',
			`© ${global.namaBot}`
		].join('\n');

		await sock.sendMessage(
			m.chat,
			{
				document: { url: res.downloadUrl },
				fileName: res.fileName,
				mimetype: res.mimetype,
				caption
			},
			{ quoted: m }
		);

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[GDRIVE ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal mengunduh file Google Drive: ${e.message || e}`);
	}
};

handler.help = ['gdrive <link>'];
handler.tags = ['downloader'];
handler.command = ['gdrive', 'gdrivedl', 'googledrive'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "downloader"})
