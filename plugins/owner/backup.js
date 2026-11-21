// Port dari 'plugin baru' (backup.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const fs = require('fs')
const path = require('path')
const {execSync} = require('child_process')

const handler = async (m, { sock, reply, botNumber }) => {
	const d = new Date();
	const date = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

	function jam(tz = 'Asia/Jakarta') {
		return new Date().toLocaleTimeString('id-ID', {
			timeZone: tz,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	}

	const name = `backup-${Date.now()}`;

	try {
		await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);
		await reply('*Processing Backup Script...*');

		const excludeRoot = ['node_modules', 'session', 'Auth', 'package-lock.json', 'yarn.lock', '.npm', '.cache', '.git', 'sessions_jadibot', `${name}.zip`];

		const filesToZip = fs
			.readdirSync(process.cwd())
			.filter((f) => !excludeRoot.includes(f) && f !== '')
			.map((f) => `"${f}"`)
			.join(' ');

		if (!filesToZip.length) return reply('Tidak ada file yang dapat di-backup.');

		const excludePattern = [
			'node_modules/*',
			'session/*',
			'Auth/*',
			'sessions_jadibot/*',
			'.git/*',
			'*.zip',
			'*crmdb.db*',
			'*/crmdb.db*',
			'data/crmdb.db',
			'data/crmdb.db-wal',
			'data/crmdb.db-shm',
			'data/trash/*',
			'*/trash/*',
			'*/fonts/*',
			'assets',
			'tmp'
		].map(p => `-x "${p}"`).join(' ');

		execSync(`zip -r ${name}.zip ${filesToZip} ${excludePattern}`);

		const singleTrashFile = path.join('data', 'trash', 'sahril2nd');
		if (fs.existsSync(singleTrashFile)) {
			execSync(`zip -u ${name}.zip "${singleTrashFile}"`);
		}

		const stats = fs.statSync(`./${name}.zip`);
		const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

		await sock.sendMessage(
			m.sender,
			{
				document: fs.readFileSync(`./${name}.zip`),
				fileName: `${name}.zip`,
				caption: `*Success backup script*\n\n` +
					`- 📅 Tanggal: ${date}\n` +
					`- ⏰ Waktu: ${jam('Asia/Jakarta')} WIB\n` +
					`- 📦 Ukuran: ${fileSizeInMB} MB\n\n` +
					`© ${global.namaBot}`,
				mimetype: 'application/zip',
			},
			{ quoted: m }
		);

		if (fs.existsSync(`./${name}.zip`)) {
			fs.unlinkSync(`./${name}.zip`);
		}

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

		if (m.isGroup) reply('Script bot berhasil dikirim ke private chat.');
	} catch (err) {
		console.error('Backup Error:', err);
		if (fs.existsSync(`./${name}.zip`)) {
			try { fs.unlinkSync(`./${name}.zip`); } catch (_) {}
		}

		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } }).catch(() => null);

		if (err.message.includes('zip: not found') || err.message.includes("'zip' is not recognized")) {
			reply("❌ Gagal: Command 'zip' tidak ditemukan. Pastikan VPS/Panel sudah terinstall zip.\n(Linux: `apt install zip`)");
		} else {
			reply('❌ Terjadi kesalahan saat melakukan backup.');
		}
	}
};

handler.help = ['backup'];
handler.tags = ['owner'];
handler.command = ['backup', 'bck', 'backupsc'];
handler.owner = true;
handler.noJadiBot = true
handler.mainOwner = true

module.exports = S.wrap(handler, {"category": "owner", "extra": ["bf", "getsc"]})
