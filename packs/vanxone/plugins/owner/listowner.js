// Port dari 'plugin baru' (listown.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const fs = require('fs')

const handler = async (m, { sock, text, reply, owners }) => {
	if (m.isBaileys) return m.reply('ngapain 😂?');

	if (owners.length < 1) return m.reply('Tidak ada owner tambahan');
	let teks = `*List Owner*:\n\n`;
	for (let i of owners) {
		teks += `* ${i.split('@')[0]} (@${i.split('@')[0]})\n`;
	}
	sock.sendMessage(m.chat, { text: teks, mentions: owners }, { quoted: m });
};

handler.command = ['listown', 'listowner'];
handler.owner = true;
handler.noJadiBot = true
handler.mainOwner = true

module.exports = S.wrap(handler, {"category": "owner", "extra": ["daftarowner"]})
