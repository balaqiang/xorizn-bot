import brandcrowd from '../../lib/scrape/brandcrowd.js';

const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const botName = global.namaBot;
	const input = text || (m.quoted && (m.quoted.text || m.quoted.caption));

	if (!input) {
		return reply(
			'🎨 *BRANDCROWD LOGO MAKER*\n\n' +
			'Cari inspirasi dan generate logo otomatis berdasarkan nama brand/usaha kamu.\n\n' +
			'*Format Penggunaan:*\n' +
			`• \`${pfx + command} <nama brand / teks>\`\n\n` +
			'*Contoh:*\n' +
			`• \`${pfx + command} portkit2nd Cafe\`\n` +
			`• \`${pfx + command} Zyro Cyber\``
		);
	}

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const logos = await brandcrowd.searchLogos(input.trim());

		if (!logos || !logos.length) {
			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
			return reply(`❌ Tidak ditemukan template logo untuk nama: *${input.trim()}*`);
		}

		const randomLogo = logos[Math.floor(Math.random() * logos.length)];

		const caption = [
			'🎨 *BRANDCROWD LOGO DESIGN*',
			'',
			`• 🏷️ *Brand:* ${input.trim()}`,
			`• 📦 *Total Pilihan:* ${logos.length} Desain`,
			'',
			`Ketik ulang perintah \`${pfx + command}${input.trim()}\` untuk mencari variasi desain lainnya.`,
			'',
			`© ${botName}`
		].join('\n');

		await sock.sendMessage(
			m.chat,
			{
				image: { url: randomLogo },
				caption
			},
			{ quoted: m }
		);

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[BRANDCROWD ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal mengambil template logo: ${e.message || e}`);
	}
};

handler.help = ['brandcrowd <nama brand>'];
handler.tags = ['maker', 'internet'];
handler.command = ['brandcrowd', 'bcrowd', 'logomaker'];
handler.limit = true

export default handler;