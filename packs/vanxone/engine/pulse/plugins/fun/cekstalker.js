import { generateFunCard } from '../../lib/canvas/fun.js';

const getCleanTag = (jid) => {
	if (!jid) return '';
	return String(jid).split('@')[0].split(':')[0];
};

const GAYA_STALKER = [
	{ tipe: 'Stalker Profesional 😎', desc: 'Sering kepoin story sampai ke postingan 3 tahun lalu!' },
	{ tipe: 'Pengagum Rahasia 🤫', desc: 'Cuma berani ngeliatin foto profil tanpa berani nge-chat.' },
	{ tipe: 'Detektif Media Sosial 🕵️‍♂️', desc: 'Tahu semua seluk beluk teman & aktivitas harianmu.' },
	{ tipe: 'Stalker Gagal 😅', desc: 'Niatnya kepoin story tapi kepencet love postingan lama!' }
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

	const rate = Math.floor(Math.random() * 60) + 40;
	const stalker = GAYA_STALKER[Math.floor(Math.random() * GAYA_STALKER.length)];

	let ppUrl = null;
	if (targetJid && sock?.profilePictureUrl) {
		try { 
			ppUrl = await sock.profilePictureUrl(targetJid, 'image').catch(() => null); 
		} catch (_) {}
	}

	const cardBuffer = await generateFunCard({
		title: '🕵️‍♂️ CEK TINGKAT STALKER',
		badgeText: `🔍 ${rate}% STALKER`,
		titleBg: '#0f766e',
		badgeBg: '#ffea00',
		name: cardName,
		rate,
		categoryLabel: 'Tipe Stalker',
		categoryValue: stalker.tipe,
		descLabel: 'Perilaku Terdeteksi',
		descValue: stalker.desc,
		footerText: 'Hati-hati dalam menjelajahi linimasa sosial media!',
		barColor: '#14b8a6',
		ppUrl
	}).catch(() => null);

	const replyText = `🕵️‍♂️ *CEK TINGKAT STALKER* 🕵️‍♂️\n\n` +
		`👤 *Subjek:* ${captionTag}\n` +
		`🔍 *Level Stalker:* *${rate}%*\n` +
		`🎭 *Tipe Stalker:* ${stalker.tipe}\n\n` +
		`📝 *Keterangan:* _"${stalker.desc}"_\n\n` +
		`© ${global.namaBot}`;

	await sock.sendMessage(m.chat, { react: { text: '🕵️‍♂️', key: m.key } }).catch(() => null);

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

handler.help = ['cekstalker'];
handler.tags = ['fun'];
handler.command = ['cekstalker', 'stalkerrate'];
handler.limit = true

export default handler;