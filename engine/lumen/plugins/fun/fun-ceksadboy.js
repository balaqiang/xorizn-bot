import { renderCekCanvas, getAvatarBuffer } from '../../lib/canvas-fun.js';

let handler = async (m, { conn, sock }) => {
	const client = conn || sock;
	if (typeof global.react === 'function') await global.react(client, m, 'loading');

	const who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
	const avatarBuffer = await getAvatarBuffer(client, who);

	const score = Math.floor(Math.random() * 101);
	let verdict = '';

	if (score < 20) verdict = 'Hatinya bahagia tanpa trauma cinta! ☀️';
	else if (score < 40) verdict = 'Kadang melow kalo denger lagu galau pas hujan~ 🌧️';
	else if (score < 60) verdict = 'Sering stalking sosmed mantan tengah malem! 📱';
	else if (score < 80) verdict = 'Spesialis korban ghosting dan cinta bertepuk sebelah tangan! 🥀';
	else verdict = 'SADBOY SEJATI, AIR MATANYA BISA BIKIN BANJIR IBU KOTA! 😭💔';

	const canvasBuffer = await renderCekCanvas({
		title: '🥀 CEK KADAR SADBOY 🥀',
		name: `@${who.split('@')[0]}`,
		score: `${score}%`,
		ratingText: verdict,
		avatarBuffer,
		emoji: '💔'
	});

	await client.sendMessage(
		m.chat,
		{
			image: canvasBuffer,
			caption: `🥀 CEK KADAR SADBOY 🥀\n\n👤 *Target:* @${who.split('@')[0]}\n📊 *Hasil:* *${score}%*\n\n💬 *Penilaian:* _${verdict}_`,
			mentions: [who]
		},
		{ quoted: m }
	);

	if (typeof global.react === 'function') await global.react(client, m, 'success');
};

handler.help = ['ceksadboy'];
handler.tags = ['fun'];
handler.command = /^(ceksadboy)$/i;
handler.limit = true;
handler.register = true;

export default handler;
