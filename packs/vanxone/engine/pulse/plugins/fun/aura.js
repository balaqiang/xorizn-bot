import { generateFunCard } from '../../lib/canvas/fun.js';

const getCleanTag = (jid) => {
	if (!jid) return '';
	return String(jid).split('@')[0].split(':')[0];
};

const KECANTIKAN_TYPES = [
	'Bidadari Surga Turun Ke Bumi ✨👸',
	'Cewek Skena Estetik Korean Look 💄🌸',
	'Manis Alami Tanpa Filter 💕',
	'Imut Menggemaskan Kayak Anime Girl 👧',
	'Elegan & Anggun Mempesona 🌹'
];

const handler = async (m, { sock, text }) => {
	let targetJid = null;
	let name = text?.trim();

	if (m.mentionedJid && m.mentionedJid.length > 0) {
		targetJid = m.mentionedJid[0];
	} else if (m.quoted && m.quoted.sender) {
		targetJid = m.quoted.sender;
	} else if (!name) {
		targetJid = m.sender;
	}

	let captionTag = name;
	let cardName = name;

	if (targetJid) {
		const cleanTag = getCleanTag(targetJid);
		captionTag = `@${cleanTag}`;
		if (!cardName) {
			cardName = (targetJid === m.sender && m.pushName) ? m.pushName : (m.quoted?.sender === targetJid && m.quoted?.pushName ? m.quoted.pushName : `@${cleanTag}`);
		}
	}

	const rate = Math.floor(Math.random() * 51) + 50;
	const type = KECANTIKAN_TYPES[Math.floor(Math.random() * KECANTIKAN_TYPES.length)];

	let ppUrl = null;
	if (targetJid && sock?.profilePictureUrl) {
		try { 
			ppUrl = await sock.profilePictureUrl(targetJid, 'image').catch(() => null); 
		} catch (_) {}
	}

	const cardBuffer = await generateFunCard({
		title: '👸 CEK AURA KECANTIKAN',
		badgeText: `✨ ${rate}% AURA`,
		titleBg: '#f43f5e',
		badgeBg: '#ffea00',
		name: cardName,
		rate,
		categoryLabel: 'Kategori Aura',
		categoryValue: type,
		descLabel: 'Efek Pesona Aura',
		descValue: 'Tetaplah tersenyum karena senyummu menyinari dunia!',
		footerText: 'Kecantikan sejati bersinar dari kebaikan hatimu!',
		barColor: '#f43f5e',
		ppUrl
	}).catch(() => null);

	const replyText = `👸 *CEK SKOR KECANTIKAN / AURA* 👸\n\n` +
		`👤 *Subjek:* ${captionTag}\n` +
		`✨ *Skor Aura Kecantikan:* *${rate}%*\n` +
		`👑 *Kategori Aura:* ${type}\n\n` +
		`_Pesan: Tetaplah tersenyum karena senyummu menyinari hariku!_ 💖\n\n` +
		`© ${global.namaBot}`;

	await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	const mentions = targetJid ? [targetJid] : [];
	if (cardBuffer) {
		return sock.sendMessage(m.chat, {
			image: cardBuffer,
			caption: replyText,
			mentions
		}, { quoted: m });
	} else {
		return sock.sendMessage(m.chat, {
			text: replyText,
			mentions
		}, { quoted: m });
	}
};

handler.help = ['aura'];
handler.tags = ['fun'];
handler.command = ['aura', 'cekaura', 'auracheck'];
handler.limit = true

export default handler;