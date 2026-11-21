// Port dari 'plugin baru' (listgc-bypass.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const handler = async (m, { sock, reply, getAllBypassGroups }) => {
	let groups = [];

	try {
		groups = await getAllBypassGroups();
	} catch (e) {
		console.error('[listgc] gagal ambil data grup:', e.message);
		return reply('Terjadi kesalahan saat membaca data grup.');
	}

	if (!groups.length) {
		return reply('Belum ada grup yang di-*bypass* (semua grup masih status normal / OFF).');
	}

	let teks = `*Daftar Grup Bypass Mode-Self*\nTotal: ${groups.length} grup\n\n`;

	for (let i = 0; i < groups.length; i++) {
		const jid = groups[i].id;
		let name = jid;
		try {
			const meta = sock.getCachedGroupMetadata
				? await sock.getCachedGroupMetadata(jid)
				: await sock.groupMetadata(jid);
			name = meta?.subject || jid;
		} catch (_) {
			name = jid;
		}
		teks += `${i + 1}. *${name}*\n    └ ${jid}\n`;
	}

	return reply(teks.trim());
};

handler.command = ['listgc', 'lgc'];
handler.owner = true;

module.exports = S.wrap(handler, {"category": "owner"})
