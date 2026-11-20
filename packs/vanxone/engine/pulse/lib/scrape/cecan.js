const sendCecan = async (sock, m, reply, category) => {
	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

	try {
		const data = await global.fetchApi('kyzz', `/api/cecan/${category}`, {}, {
			responseType: 'arraybuffer',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
				'Accept': 'image/*,*/*'
			}
		});

		const buffer = Buffer.from(data);

		await sock.sendMessage(m.chat, {
			image: buffer,
			caption: `🎴 *Cewe Random — ${category}*\n\n© ${global.namaBot}`
		}, { quoted: m });

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

	} catch (e) {
		console.error(`[CEWERANDOM:${category}]`, e.response?.data ? e.response.data.toString() : e.message);
		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
		reply(`❌ Gagal mengambil gambar ${category}.`);
	}
};

export default sendCecan;