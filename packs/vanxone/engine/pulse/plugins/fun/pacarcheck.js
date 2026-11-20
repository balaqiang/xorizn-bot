import { generateFunCard } from '../../lib/canvas/fun.js';

const getCleanTag = (jid) => {
	if (!jid) return '';
	return String(jid).split('@')[0].split(':')[0];
};

const DATING_REASONS = [
	'Karena senyumannya bikin meleleh seharian! 😍',
	'Karena kalau ngobrol nyambung banget dari A-Z! 🗣️',
	'Karena tatapan matanya bikin salah tingkah! 😳',
	'Karena sering jajanin kopi estetik tiap weekend! ☕',
	'Karena kalau berantem langsung dikirim makanan enak! 🍕',
	'Karena humornya sefrekuensi bikin ketawa melulu! 🤣'
];

const handler = async (m, { sock, text, usedPrefix }) => {
	let targetJid = null;
	let name = text?.trim();

	if (m.mentionedJid && m.mentionedJid.length > 0) {
		targetJid = m.mentionedJid[0];
	} else if (m.quoted && m.quoted.sender) {
		targetJid = m.quoted.sender;
	} else if (!name) {
		return sock.sendMessage(m.chat, { 
			text: `👩‍❤️️‍👨 *CEK POTENSI PACARAN*\n\nTag gebetan atau ketik namanya!\nContoh: *${usedPrefix}pacarcheck @user*\n\n© ${global.namaBot}` 
		}, { quoted: m });
	}

	let captionTag = name;
	let cardName = name;

	if (targetJid) {
		const cleanTag = getCleanTag(targetJid);
		captionTag = `@${cleanTag}`;
		if (!cardName) {
			cardName = (m.quoted?.sender === targetJid && m.quoted?.pushName) ? m.quoted.pushName : `@${cleanTag}`;
		}
	}

	const rate = Math.floor(Math.random() * 51) + 50;
	const reason = DATING_REASONS[Math.floor(Math.random() * DATING_REASONS.length)];

	let ppUrl = null;
	if (targetJid && sock?.profilePictureUrl) {
		try { 
			ppUrl = await sock.profilePictureUrl(targetJid, 'image').catch(() => null); 
		} catch (_) {}
	}

	const cardBuffer = await generateFunCard({
		title: '👩‍❤️‍👨 CEK POTENSI PACARAN',
		badgeText: `💖 ${rate}% MATCH`,
		titleBg: '#ec4899',
		badgeBg: '#ffea00',
		name: cardName,
		rate,
		categoryLabel: 'Status Gebetan',
		categoryValue: rate > 75 ? 'Calon Pacar Idaman 💕' : 'Bisa Diusahakan 💓',
		descLabel: 'Alasan Cocok Pacaran',
		descValue: reason,
		footerText: 'Gunakan .tembak @user untuk jadian berpacaran!',
		barColor: '#ec4899',
		ppUrl
	}).catch(() => null);

	const replyText = `👩‍❤️‍👨 *HASIL CEK POTENSI PACARAN* 👩‍❤️‍👨\n\n` +
		`👤 *Target:* ${captionTag}\n` +
		`💖 *Potensi Pacaran:* *${rate}%*\n` +
		`💡 *Alasan:* _"${reason}"_\n\n` +
		`👉 _Gunakan .tembak ${captionTag} untuk melamar jadian sekarang!_ 💕\n\n` +
		`© ${global.namaBot}`;

	await sock.sendMessage(m.chat, { react: { text: '💖', key: m.key } }).catch(() => null);

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

handler.help = ['pacarcheck'];
handler.tags = ['fun'];
handler.command = ['pacarcheck', 'cekpacar', 'pacaranrate'];
handler.limit = true

export default handler;