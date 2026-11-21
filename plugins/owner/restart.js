// Port dari 'plugin baru' (restart.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const {spawn} = require('child_process')

const handler = async (m, { sock, reply }) => {
	const restartServer = () => {
		if (process.env.pm_id) process.exit(0); // di bawah pm2: cukup keluar, pm2 menyalakan ulang
		const newProcess = spawn(process.argv[0], process.argv.slice(1), {
			detached: true,
			stdio: 'inherit',
		});
		process.exit(0);
	};

	await reply(`\`\`\`Restarting bot . . .\`\`\``);
	setTimeout(() => restartServer(), 4500);
};

handler.command = ['rst', 'restart'];
handler.owner = true;
handler.noJadiBot = true
handler.mainOwner = true

module.exports = S.wrap(handler, {"category": "owner"})
