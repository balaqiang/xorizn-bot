import { renderCekCanvas, getAvatarBuffer } from '../../lib/canvas-fun.js';

let handler = async (m, { conn, sock }) => {
	const client = conn || sock;
	if (typeof global.react === 'function') await global.react(client, m, 'loading');

	const who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
	const avatarBuffer = await getAvatarBuffer(client, who);

	const score = Math.floor(Math.random() * 101);
	let verdict = '';

	if (score < 20) verdict = 'Santai tanpa beban, hidup damai sejahtera! 🧘';
	else if (score < 40) verdict = 'Agak pusing tugas/pekerjaan dikit, masih wajar~ ☕';
	else if (score < 60) verdict = 'Mulai sering ngelamun dan overthinking tiap malem! 🌙';
	else if (score < 80) verdict = 'Stres berat butuh liburan ke Bali sekarang juga! 🏖️';
	else verdict = 'STRES MAKSIMAL MAU GILA, BURUAN REFRESHING SEBELUM RUSAK! 💥🚨';

	const canvasBuffer = await renderCekCanvas({
		title: '🤯 CEK TINGKAT STRES 🤯',
		name: `@${who.split('@')[0]}`,
		score: `${score}%`,
		ratingText: verdict,
		avatarBuffer,
		emoji: '😵‍💫'
	});

	await client.sendMessage(
		m.chat,
		{
			image: canvasBuffer,
			caption: `🤯 CEK TINGKAT STRES 🤯\n\n👤 *Target:* @${who.split('@')[0]}\n📊 *Hasil:* *${score}%*\n\n💬 *Penilaian:* _${verdict}_`,
			mentions: [who]
		},
		{ quoted: m }
	);

	if (typeof global.react === 'function') await global.react(client, m, 'success');
};

handler.help = ['cekstres'];
handler.tags = ['fun'];
handler.command = /^(cekstres)$/i;
handler.limit = true;
handler.register = true;

export default handler;
