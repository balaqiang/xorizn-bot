// Port dari 'plugin baru' (offgc.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const handler = async (m, { getGroup, updateData, reply, usedPrefix }) => {
	if (!m.isGroup) return reply(`Perintah *${usedPrefix}offgc* hanya bisa dipakai *di dalam grup*!`);

	const group = await getGroup(m.chat);

	if (!group.gcbypass || group.gcbypass === 0) {
		return reply(
			`Grup ini *sudah* dalam status normal (*OFF*).\n` +
			`Saat bot mode *self*, hanya owner yang bisa pakai fitur bot di grup ini.`
		);
	}

	await updateData('groups', m.chat, 'gcbypass', 0);

	return reply(
		`❌ *Bypass mode-self dimatikan* untuk grup ini.\n\n` +
		`Jika bot sedang mode *self*, member selain owner tidak bisa lagi memakai fitur bot di grup ini.`
	);
};

handler.command = ['offgc'];
handler.group = true;
handler.owner = true;

module.exports = S.wrap(handler, {"category": "owner"})
