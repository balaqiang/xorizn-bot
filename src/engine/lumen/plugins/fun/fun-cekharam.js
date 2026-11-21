import { renderCekCanvas, getAvatarBuffer } from '../../lib/canvas-fun.js';

let handler = async (m, { conn, sock }) => {
	const client = conn || sock;
	if (typeof global.react === 'function') await global.react(client, m, 'loading');

	const who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
	const avatarBuffer = await getAvatarBuffer(client, who);

	const score = Math.floor(Math.random() * 101);
	let verdict = '';

	if (score < 20) verdict = 'Suci bersih bagaikan bayi baru lahir! 🕊️';
	else if (score < 40) verdict = 'Dosa kecil dikit pas ghibahin tetangga doang~ 🤭';
	else if (score < 60) verdict = 'Kelakuan agak haram, sering bolos dan rebahan! 😈';
	else if (score < 80) verdict = 'Pikiran dan tingkahnya kotor banget astaga! 🙈';
	else verdict = 'HARAM BIANG KELADI, SETAN AJA SUJUD SUNGKEM! 👹🔥';

	const canvasBuffer = await renderCekCanvas({
		title: '☠️ CEK KADAR HARAM ☠️',
		name: `@${who.split('@')[0]}`,
		score: `${score}%`,
		ratingText: verdict,
		avatarBuffer,
		emoji: '🔥'
	});

	await client.sendMessage(
		m.chat,
		{
			image: canvasBuffer,
			caption: `☠️ CEK KADAR HARAM ☠️\n\n👤 *Target:* @${who.split('@')[0]}\n📊 *Hasil:* *${score}%*\n\n💬 *Penilaian:* _${verdict}_`,
			mentions: [who]
		},
		{ quoted: m }
	);

	if (typeof global.react === 'function') await global.react(client, m, 'success');
};

handler.help = ['cekharam'];
handler.tags = ['fun'];
handler.command = /^(cekharam)$/i;
handler.limit = true;
handler.register = true;

export default handler;
