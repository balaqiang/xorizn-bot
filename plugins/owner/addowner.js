// Port dari 'plugin baru' (addown.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
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

	const isLid = targetJid.endsWith('@lid');

	if (!isLid) {
		let ceknya = await sock.onWhatsApp(targetJid);
		if (ceknya.length == 0) return reply(`Masukkan nomor yang valid dan terdaftar di WhatsApp!`);
	}

	if (!require('../../lib/owners').add(targetJid)) return reply('Nomor sudah ada di daftar owner.');
	reply(`Berhasil menambahkan ${targetJid.split('@')[0]}${isLid ? ' (lid)' : ''} ke daftar owner.`);
};

handler.command = ['addown', 'addowner'];
handler.owner = true;
handler.noJadiBot = true
handler.mainOwner = true

module.exports = S.wrap(handler, {"category": "owner", "extra": ["tambahowner"], "mainOnly": true})
