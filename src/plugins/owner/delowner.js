// Port dari 'plugin baru' (delown.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const fs = require('fs')

const handler = async (m, { sock, text, args, reply, owners, example }) => {
	if (m.isBaileys) return m.reply('ngapain 😂?');

	let targetJid = null;
	if (args[0]) {
		const clean = args[0].replace(/[^0-9]/g, '');
		if (!clean) return reply(example(`reply/tag/nomor`));
		targetJid = clean + '@s.whatsapp.net';
	} else if (m.quoted?.sender) {
		targetJid = m.quoted.sender;
	} else if (m.mentionedJid?.[0]) {
		targetJid = m.mentionedJid[0];
	}
	if (!targetJid) return reply(example(`reply/tag/nomor`));

	const _r = require('../../lib/owners').remove(targetJid);
	if (_r === 'fixed') return reply('Owner utama (developer / settings.js) tidak bisa dihapus.');
	if (!_r) return reply('Nomor tidak ditemukan di daftar owner.');
	const removed = targetJid;
	reply(`Berhasil menghapus ${removed.split('@')[0]} dari daftar owner.`);
};

handler.command = ['delown', 'delowner'];
handler.owner = true;
handler.noJadiBot = true
handler.mainOwner = true

module.exports = S.wrap(handler, {"category": "owner", "extra": ["hapusowner"], "mainOnly": true})
