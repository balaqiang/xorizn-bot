import { renderCekCanvas, getAvatarBuffer } from '../../lib/canvas-fun.js';

let handler = async (m, { conn, sock }) => {
	const client = conn || sock;
	if (typeof global.react === 'function') await global.react(client, m, 'loading');

	const who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
	const avatarBuffer = await getAvatarBuffer(client, who);

	const score = Math.floor(Math.random() * 101);
	let verdict = '';

	if (score < 20) verdict = 'Jarang ibadah, hayo buruan taubat sebelum terlambat! 🥺';
	else if (score < 40) verdict = 'Alim pas ada maunya atau pas kepepet doang~ 😅';
	else if (score < 60) verdict = 'Rajin ibadah, calon menantu idaman mertua! 🤲';
	else if (score < 80) verdict = 'Hafal juz amma dan selalu jaga pandangan, masyaAllah! 📖✨';
	else verdict = 'ALIM TINGKAT TINGGI, AURA KESALEHAN BERSINAR TERANG! 🌟🕋';

	const canvasBuffer = await renderCekCanvas({
		title: '📿 CEK TINGKAT ALIM 📿',
		name: `@${who.split('@')[0]}`,
		score: `${score}%`,
		ratingText: verdict,
		avatarBuffer,
		emoji: '🕌'
	});

	await client.sendMessage(
		m.chat,
		{
			image: canvasBuffer,
			caption: `📿 CEK TINGKAT ALIM 📿\n\n👤 *Target:* @${who.split('@')[0]}\n📊 *Hasil:* *${score}%*\n\n💬 *Penilaian:* _${verdict}_`,
			mentions: [who]
		},
		{ quoted: m }
	);

	if (typeof global.react === 'function') await global.react(client, m, 'success');
};

handler.help = ['cekalim'];
handler.tags = ['fun'];
handler.command = /^(cekalim)$/i;
handler.limit = true;
handler.register = true;

export default handler;
