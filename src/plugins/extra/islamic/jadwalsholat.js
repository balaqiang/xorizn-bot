
import axios from 'axios';

const handler = async (m, { sock, conn, text, usedPrefix, command, reply }) => {
	const client = sock || conn;
	const kota = text?.trim() || 'Jakarta';

	try {
		await global.react?.(client, m, '🕒').catch(() => {});

		const apiUrl = `global.API('kyzz', '/api/islamic/jadwal-sholat', { wilayah: kota }, 'apikey')`;
		const { data } = await axios.get(apiUrl, { timeout: 15000 });

		if (!data?.status || !data?.result?.today) {
			await global.react?.(client, m, '❌').catch(() => {});
			return reply(`❌ Jadwal sholat untuk wilayah *${kota}* tidak ditemukan.`);
		}

		const res = data.result;
		const today = res.today;

		const caption = `🕋 *JADWAL SHOLAT*\n\n` +
			`📍 *Wilayah:* ${res.cityName}\n` +
			`📅 *Tanggal:* Tanggal ${today.tanggal} (${today.hijriyah})\n\n` +
			`🌆 *Imsyak:* ${today.imsyak}\n` +
			`🌅 *Subuh:* ${today.subuh}\n` +
			`☀️ *Terbit:* ${today.terbit}\n` +
			`🌤️ *Dhuha:* ${today.dhuha}\n` +
			`🌞 *Dzuhur:* ${today.dzuhur}\n` +
			`🌇 *Ashar:* ${today.ashar}\n` +
			`🌆 *Maghrib:* ${today.maghrib}\n` +
			`🌌 *Isya:* ${today.isya}\n\n` +
			`💡 *Tips:* Ketik \`${usedPrefix}${command} Banjarnegara\` untuk kota lain.`;

		await reply(caption);
		await global.react?.(client, m, '✅').catch(() => {});

	} catch (err) {
		console.error('[JADWAL SHOLAT ERROR]', err);
		await global.react?.(client, m, '❌').catch(() => {});
		return reply('❌ Terjadi kesalahan saat mengambil Jadwal Sholat!');
	}
};

handler.help = ['jadwalsholat <wilayah/kota>'];
handler.tags = ['islamic'];
handler.command = ['jadwalsholat'];
handler.limit = true;

handler.register = true;

export default handler;
