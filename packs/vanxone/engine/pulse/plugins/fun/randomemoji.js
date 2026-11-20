const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const EMOJIS = ['😀','😎','🤔','🥳','😴','🤯','🥶','😇','🤖','👻','🦄','🔥','💎','🌈','⚡','✨','🦊','🐱','🌸','🎉'];

const handler = async (m, { sock }) => {
	const emoji = pick(EMOJIS);

	await sock.sendMessage(m.chat, { react: { text: emoji, key: m.key } }).catch(() => null);

	const caption = `🎲 *Emoji Random:* ${emoji}\n\n` +
		`© ${global.namaBot}`;

	return sock.sendMessage(m.chat, { text: caption }, { quoted: m });
};

handler.help = ['randomemoji'];
handler.tags = ['fun'];
handler.command = ['randomemoji'];
handler.limit = true

export default handler;