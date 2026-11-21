import { renderCekCanvas, getAvatarBuffer } from '../../lib/canvas-fun.js';

let handler = async (m, { conn, sock }) => {
	const client = conn || sock;
	if (typeof global.react === 'function') await global.react(client, m, 'loading');

	const who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
	const avatarBuffer = await getAvatarBuffer(client, who);

	const score = Math.floor(Math.random() * 101);
	let verdict = '';

	if (score < 20) verdict = 'Aman, masih waras dan punya akal sehat! 😇';
	else if (score < 40) verdict = 'Bego dikit-dikit pas disuruh mikir logika~ 🙈';
	else if (score < 60) verdict = 'Sering loading lama kalo diajak ngobrol! 🤦‍♂️';
	else if (score < 80) verdict = 'Bego stadium 3, jangan biarin bikin keputusan! 😭';
	else verdict = 'BEGO TANPA BATAS, OTAKNYA HILANG KETINGGALAN DI RUMAH! 💀';

	const canvasBuffer = await renderCekCanvas({
		title: '🤪 CEK TINGKAT BEGO 🤪',
		name: `@${who.split('@')[0]}`,
		score: `${score}%`,
		ratingText: verdict,
		avatarBuffer,
		emoji: '🤪'
	});

	await client.sendMessage(
		m.chat,
		{
			image: canvasBuffer,
			caption: `🤪 CEK TINGKAT BEGO 🤪\n\n👤 *Target:* @${who.split('@')[0]}\n📊 *Hasil:* *${score}%*\n\n💬 *Penilaian:* _${verdict}_`,
			mentions: [who]
		},
		{ quoted: m }
	);

	if (typeof global.react === 'function') await global.react(client, m, 'success');
};

handler.help = ['cekbego'];
handler.tags = ['fun'];
handler.command = /^(cekbego)$/i;
handler.limit = true;
handler.register = true;

export default handler;
