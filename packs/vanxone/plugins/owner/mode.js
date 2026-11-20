// Port dari 'plugin baru' (modebot.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const handler = async (m, { args, command, usedPrefix, botSet, setSetting }) => {
	const text = args[0] ? args[0].toLowerCase() : '';

	if (command === 'public' || (command === 'mode' && text === 'public')) {
		setSetting('public', true);
		return m.reply('Sukses mengubah ke *mode public*');
	}

	if (command === 'self' || (command === 'mode' && text === 'self')) {
		setSetting('public', false);
		return m.reply('Sukses mengubah ke *mode self*');
	}

	if (command === 'mode') {
		const statusStr = botSet.public ? 'Public mode' : 'Self mode';

		return m.reply(
			`*Mode bot settings*\n` +
			`- Mode saat ini: *${statusStr}*\n\n` +
			`*Command vailid*\n` +
			`- ${usedPrefix}mode public *semua orang bisa pakai bot*\n` +
			`- ${usedPrefix}mode self *hanya owner yang bisa pakai bot*`
		);
	}
};

handler.command = ['mode', 'public', 'self'];
handler.owner = true;

module.exports = S.wrap(handler, {"category": "owner"})
