// Port dari 'plugin baru' (primeff.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const formatRupiah = (angka) => {
	return 'Rp ' + Math.round(angka).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const hitungPrimeFF = async (poinPrime) => {
	const poin = parseInt(String(poinPrime).replace(/[^0-9]/g, ''));

	if (isNaN(poin) || poin <= 0) {
		return {
			status: false,
			message: 'Jumlah Poin Prime tidak valid.'
		};
	}

	const url = 'https://rifqistore.com/id/calculator-free-fire';
	let rate = 126;

	try {
		const res = await fetch(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
			}
		});
		const html = await res.text();

		const matchRate = html.match(/(?:Rp\s*|harga[:\s]*)(\d+)\s*\/\s*(?:1)?(?:dm|diamond)/i)
			|| html.match(/(\d+)\s*\/\s*1dm/i)
			|| html.match(/rate\s*[:=]\s*(\d+)/i);

		if (matchRate && matchRate[1]) {
			rate = parseInt(matchRate[1]);
		}
	} catch (err) {
		rate = 126;
	}

	const totalDiamond = poin;
	const totalHarga = totalDiamond * rate;

	return {
		status: true,
		data: {
			poin_prime: poin,
			total_diamond: totalDiamond.toLocaleString('id-ID'),
			harga_per_dm: rate,
			total_harga: totalHarga,
			formatted_harga: formatRupiah(totalHarga)
		}
	};
};

const handler = async (m, { sock, reply, usedPrefix, command, text }) => {
	const botName = global.namaBot;
	const inputPoin = (text || '').trim();

	if (!inputPoin) {
		return reply(`Ketik perintah beserta jumlah Poin Prime.\nContoh:\n*${usedPrefix + command}* 12900`);
	}

	await sock.sendMessage(m.chat, { react: { text: '🧮', key: m.key } }).catch(() => null);

	try {
		const res = await hitungPrimeFF(inputPoin);

		if (!res.status || !res.data) {
			throw new Error(res.message || 'Gagal menghitung konversi Poin Prime.');
		}

		const { poin_prime, total_diamond, harga_per_dm, formatted_harga } = res.data;

		const caption = [
			'💎 *KALKULATOR PRIME FREE FIRE*',
			'----------------------------------------',
			`🪙 *Poin Prime:* ${poin_prime.toLocaleString('id-ID')}`,
			`💎 *Estimasi Diamond:* ${total_diamond} DM`,
			`📈 *Rate Kurs:* Rp ${harga_per_dm} / DM`,
			'----------------------------------------',
			`💵 *Estimasi Rupiah:* ${formatted_harga}`,
			'----------------------------------------',
			`© ${botName}`
		].join('\n');

		await sock.sendMessage(
			m.chat,
			{
				text: caption
			},
			{ quoted: m }
		);

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (error) {
		console.error('[PRIME FF ERROR]:', error.message || error);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`Gagal menghitung Poin Prime:\n> ${error.message || error}`);
	}
};

handler.help = ['primeff <poin>', 'calcpf <poin>'];
handler.tags = ['tools', 'game'];
handler.command = ['primeff', 'calcpf', 'hitungprime', 'primecalc'];
handler.limit = false;

module.exports = S.wrap(handler, {"category": "tools"})
