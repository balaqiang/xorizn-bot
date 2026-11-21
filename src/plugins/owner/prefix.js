// Port dari 'plugin baru' (prefix.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const handler = async (m, { args, usedPrefix, command, botSet, setSetting }) => {
	if (command === 'setprefix') {
		if (!args[0])
			return m.reply(`*Cara penggunan:*
- ${usedPrefix}setprefix [new prefix]

*Contoh penggunaan*
- ${usedPrefix}setprefix /`);

		const newPrefix = args[0];
		setSetting('prefix', newPrefix);

		return m.reply(`Prefix *[ ${usedPrefix} ]* berhasil di ubah menjadi *[ ${newPrefix} ]*`);
	}

	if (command === 'delprefix') {
		setSetting('prefix', '.');

		return m.reply(`Prefix berhasil di hapus!`);
	}

	if (command === 'prefix') {
		const mode = args[0] ? args[0].toLowerCase() : '';

		if (mode === 'on') {
			if (botSet.multiprefix) return m.reply('Sudah dalam mode aktif!');
			const p = botSet.prefix || '.';
			setSetting('multiprefix', true);
			return m.reply(`*Prefix ON ✅*
            
Gunakan awalan prefix *${p}* untuk memulai bot!

${usedPrefix}setprefix *untuk mengganti prefix*
${usedPrefix}prefix off *agar tanpa prefix*`);
		}

		if (mode === 'off') {
			if (!botSet.multiprefix) return m.reply('Sudah dalam mode offline!');

			setSetting('multiprefix', false);
			return m.reply(`*Prefix OFF ✅*
            
*Gunakan bot tanpa awalan prefix*
${usedPrefix}prefix on *agar menggunakan prefix*`);
		}

		const status = botSet.multiprefix ? 'ON' : 'OFF';
		const p = botSet.prefix || '.';

		return m.reply(`*Prefix settings*
- Mode prefix : *${status}*
- Prefix saat ini : *${p}*

*Command :*
- ${usedPrefix}prefix on *menggunakan prefix*
- ${usedPrefix}prefix off *tanpa prefix*
- ${usedPrefix}setprefix *settings prefix*`);
	}
};

handler.command = ['prefix', 'setprefix', 'delprefix'];
handler.owner = true;

module.exports = S.wrap(handler, {"category": "owner"})
