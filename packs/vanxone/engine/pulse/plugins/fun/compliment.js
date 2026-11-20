const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const jidNum = (jid = '') => String(jid).split('@')[0].split(':')[0];

const handler = async (m, { sock }) => {
	const target = (m.mentionedJid && m.mentionedJid[0]) || (m.quoted ? m.quoted.sender : null);
	const lines = [
		'punya energi positif yang menular ke orang sekitarnya!',
		'selalu bikin orang sekitar nyaman dan tersenyum.',
		'punya potensi besar dan aura yang memikat!',
		'adalah orang hebat yang pantas dibanggakan.',
		'punya hati yang tulus dan selalu menghangatkan suasana.'
	];
	const puji = pick(lines);

	await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	if (target) {
		const text = `✨ @${jidNum(target)} ${puji}\n\n` +
			`© ${global.namaBot}`;

		return sock.sendMessage(m.chat, {
			text,
			mentions: [target]
		}, { quoted: m });
	} else {
		const text = `✨ Kamu ${puji}\n\n` +
			`© ${global.namaBot}`;

		return sock.sendMessage(m.chat, { text }, { quoted: m });
	}
};

handler.help = ['compliment'];
handler.tags = ['fun'];
handler.command = ['compliment', 'puji'];
handler.limit = true

export default handler;