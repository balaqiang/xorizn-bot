// Port dari 'plugin baru' (premium.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const fs = require('fs')

const handler = async (m, { sock, text, args, command, reply, premium, example }) => {
	switch (command) {
		case 'listprem':
		case 'listpremium':
			{
				if (m.isBaileys) return m.reply('ngapain 😂?');
				if (premium.length < 1) return m.reply('Tidak ada user premium');
				let teks = `*List Pengguna Premium*\n\n`;
				for (let i of premium) {
					teks += `* ${i.split('@')[0]} (@${i.split('@')[0]})\n`;
				}
				sock.sendMessage(m.chat, { text: teks, mentions: premium }, { quoted: m });
			}
			break;

		case 'addprem':
		case 'addpremium':
			{
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

				if (!require('../../lib/engine/pulse-owner').addPrem(targetJid)) return reply('Nomor sudah ada di daftar premium');
				reply(`Berhasil menambahkan ${targetJid.split('@')[0]}${isLid ? ' (lid)' : ''} ke daftar premium`);
			}
			break;

		case 'delprem':
		case 'delpremium':
			{
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

				if (!require('../../lib/engine/pulse-owner').delPrem(targetJid)) return reply('Nomor tidak ditemukan di daftar premium');
				const removed = targetJid;
				reply(`Berhasil menghapus ${removed.split('@')[0]} dari daftar premium`);
			}
			break;
	}
};

handler.command = ['listpremium', 'listprem', 'addprem', 'addpremium', 'delpremium', 'delprem'];
handler.owner = true;
handler.noJadiBot = true
handler.mainOwner = true

module.exports = S.wrap(handler, {"category": "owner"})
