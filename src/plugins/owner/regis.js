// Port dari 'plugin baru' (auto-register.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const handler = async (m, { reply, args, usedPrefix, command, botSet, setSetting }) => {

	const mode = (args[0] || '').toLowerCase();

	if (!['on', 'off'].includes(mode)) {
		return reply(`*Regis settings*
- Status saat ini: *${botSet.regis ? 'ON' : 'OFF'}*

*Command*
- ${usedPrefix + command} on *user wajib daftar sebelum pakai bot*
- ${usedPrefix + command} off *user bebas pakai bot tanpa daftar*`
		);
	}

	const now = setSetting('regis', mode === 'on');
	reply(`Auto register ${now ? '*aktif*' : '*nonaktif*'}
${now ? 'User wajib daftar dulu sebelum menggunakan bot' : 'User tidak perlu daftar.'}`);
};

handler.command = ['regis'];
handler.owner = true;

module.exports = S.wrap(handler, {"category": "owner"})
