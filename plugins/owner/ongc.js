// Port dari 'plugin baru' (ongc.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const handler = async (m, { getGroup, updateData, reply, usedPrefix }) => {
	if (!m.isGroup) return reply(`Perintah *${usedPrefix}ongc* hanya bisa dipakai *di dalam grup*!`);

	const group = await getGroup(m.chat);

	if (group.gcbypass === 1) {
		return reply(
			`Grup ini *sudah* dalam status bypass (*ON*).\n` +
			`Member tetap bisa pakai fitur bot walau bot sedang mode *self*.`
		);
	}

	await updateData('groups', m.chat, 'gcbypass', 1);

	return reply(
		`*Bypass mode-self diaktifkan* untuk grup ini!\n\n` +
		`Mulai sekarang, walaupun bot sedang mode *self*, semua member di grup ini tetap bisa memakai fitur-fitur bot.\n\n` +
		`Ketik *${usedPrefix}offgc* untuk mematikan kembali.`
	);
};

handler.command = ['ongc'];
handler.group = true;
handler.owner = true;

module.exports = S.wrap(handler, {"category": "owner"})
