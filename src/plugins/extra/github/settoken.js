// Feature: GitHub Suite Automation

import fs from 'fs';
import path from 'path';

const handler = async (m, { text, usedPrefix, command }) => {
	if (!text) {
		const maskedToken = global.tokengh ? `${global.tokengh.slice(0, 8)}...${global.tokengh.slice(-4)}` : 'Belum diset';
		return m.reply(`🔑 *GITHUB TOKEN SETTING*\n\n• Token Saat Ini: \`${maskedToken}\`\n\nContoh Penggunaan:\n*${usedPrefix}${command} ghp_xxxx...*`);
	}

	const newToken = text.trim();
	global.tokengh = newToken;

	try {
		const settingsPath = path.join(process.cwd(), 'setting.js');
		let content = fs.readFileSync(settingsPath, 'utf-8');

		if (content.includes('global.tokengh')) {
			content = content.replace(/global\.tokengh\s*=\s*['"][^'"]*['"];?/, `global.tokengh = '${newToken}';`);
		} else {
			content += `\nglobal.tokengh = '${newToken}';\n`;
		}

		fs.writeFileSync(settingsPath, content);
		return m.reply(`✅ *TOKEN GITHUB BERHASIL DISIMPAN*\n\nToken baru telah berhasil disimpan ke \`setting.js\` dan siap digunakan.`);
	} catch (e) {
		console.error('[SETGHTOKEN ERROR]', e);
		return m.reply(`✅ Token aktif di memory tetapi gagal menyimpan ke file setting.js.`);
	}
};

handler.help = ['setghtoken'];
handler.tags = ['github'];
handler.command = ['setghtoken'];
handler.limit = true;
handler.owner = true;
handler.noJadiBot = true;

handler.register = true;

export default handler;
