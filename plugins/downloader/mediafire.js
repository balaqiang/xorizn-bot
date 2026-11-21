// Port dari 'plugin baru' (mediafire.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const cheerio = require('cheerio')
const {basename, extname} = require('node:path')
const mime = require('mime-types')

async function mediafire(url) {
	const res = await fetch(url.trim(), {
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
		},
		signal: AbortSignal.timeout(30000)
	});

	if (!res.ok) throw new Error(`HTTP error ${res.status}`);
	const html = await res.text();
	const $ = cheerio.load(html);

	const title = $("meta[property='og:title']").attr('content')?.trim() || $('div.filename').text()?.trim() || 'Unknown';
	const size = /Download\s*\(([\d.]+\s*[KMGT]?B)\)/i.exec(html)?.[1] || $('a#downloadButton').text()?.match(/\((.*?)\)/)?.[1]?.trim() || 'Unknown';
	const dl = $("a#downloadButton").attr('href')?.trim() || $("a.popsok[href^='https://download']").attr('href')?.trim() || $("a.popsok:not([href^='javascript'])").attr('href')?.trim();

	if (!dl) throw new Error('Tautan unduhan langsung (direct download link) tidak ditemukan.');

	return {
		name: title,
		filename: basename(dl),
		type: extname(dl),
		size,
		download: dl,
		link: url.trim()
	};
}

const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const botName = global.namaBot;
	const input = text || (m.quoted && (m.quoted.text || m.quoted.caption));

	if (!input) {
		return reply(
			`📥 *MEDIAFIRE DOWNLOADER*\n\n` +
			`Unduh file dokumen atau aplikasi dari tautan MediaFire.\n\n` +
			`*Contoh Penggunaan:*\n` +
			`• \`${pfx + command} https://www.mediafire.com/file/xxxxxx/app.apk/file\`\n` +
			`• Balas tautan MediaFire dengan \`${pfx + command}\``
		);
	}

	const urlMatch = input.trim().match(/https?:\/\/(?:www\.)?mediafire\.com\/\S+/i);
	if (!urlMatch) {
		return reply('❌ URL tidak valid. Pastikan menyertakan tautan dari mediafire.com');
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const data = await mediafire(urlMatch[0]);
		const mimetype = mime.lookup(data.filename) || 'application/octet-stream';

		const caption = [
			'📥 *MEDIAFIRE DOWNLOADED*',
			'',
			`• 📝 *Nama File:* ${data.name || data.filename}`,
			`• 💾 *Ukuran:* ${data.size}`,
			`• 📦 *Ekstensi:* ${data.type || 'file'}`,
			'',
			`© ${botName}`
		].join('\n');

		await sock.sendMessage(
			m.chat,
			{
				document: { url: data.download },
				mimetype,
				fileName: data.filename,
				caption
			},
			{ quoted: m }
		);

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[MEDIAFIRE ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal mengunduh file MediaFire: ${e.message || e}`);
	}
};

handler.help = ['mediafire <link>'];
handler.tags = ['downloader'];
handler.command = ['mediafire', 'mf', 'mfdl'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "downloader"})
