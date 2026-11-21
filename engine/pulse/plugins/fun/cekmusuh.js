import { generateFunCard } from '../../lib/canvas/fun.js';

const getCleanTag = (jid) => {
	if (!jid) return '';
	return String(jid).split('@')[0].split(':')[0];
};

const MUSUH_TYPES = [
	'Lawan Bebuyutan Sejak TK ⚔️',
	'Musuh Bebuyutan Rebutan Makanan 🍕',
	'Rival Abadi Di Game Online 🎮',
	'Sahabat Tapi Sering Berantem Cekcok 🤼‍♂️',
	'Musuh Karena Mantan 💔'
];

const handler = async (m, { sock, usedPrefix, text }) => {
	let target1 = m.sender;
	let target2 = null;

	const mentionedJid = m.mentionedJid || [];

	if (mentionedJid.length >= 2) {
		target1 = mentionedJid[0];
		target2 = mentionedJid[1];
	} else if (mentionedJid.length === 1) {
		target2 = mentionedJid[0];
	} else if (m.quoted && m.quoted.sender) {
		target2 = m.quoted.sender;
	} else if (text && text.includes('|')) {
		const parts = text.split('|');
		const name1 = parts[0].trim();
		const name2 = parts[1].trim();

		const rate = Math.floor(Math.random() * 80) + 20;
		const type = MUSUH_TYPES[Math.floor(Math.random() * MUSUH_TYPES.length)];

		const cardBuffer = await generateFunCard({
			title: '⚔️ CEK PERMUSUHAN & RIVAL',
			badgeText: `🔥 ${rate}% RIVAL`,
			titleBg: '#ea580c',
			badgeBg: '#ffea00',
			name: `${name1} vs ${name2}`,
			rate,
			categoryLabel: 'Kategori Rivalitas',
			categoryValue: type,
			descLabel: 'Solusi Pertikaian',
			descValue: 'Gunakan .duel @user untuk menyelesaikan permusuhan di Arena PvP Canvas!',
			footerText: 'Selesaikan percekcokan di Arena Duel Canvas!',
			barColor: '#f97316',
			showMeter: true
		}).catch(() => null);

		const replyMsg = `⚔️ *CEK PERMUSUHAN & RIVALITAS* ⚔️\n\n` +
			`🤼‍♂️ *Rival:* *${name1}* vs *${name2}*\n` +
			`🔥 *Tingkat Permusuhan:* *${rate}%*\n` +
			`🎭 *Kategori Rivalitas:* ${type}\n\n` +
			`👉 _Gunakan .duel @user untuk menyelesaikan permusuhan di Arena PvP Canvas!_ ⚔️\n\n` +
			`© ${global.namaBot}`;

		await sock.sendMessage(m.chat, { react: { text: '⚔️', key: m.key } }).catch(() => null);

		if (cardBuffer) {
			return sock.sendMessage(m.chat, { image: cardBuffer, caption: replyMsg }, { quoted: m });
		} else {
			return sock.sendMessage(m.chat, { text: replyMsg }, { quoted: m });
		}
	} else {
		return sock.sendMessage(m.chat, { 
			text: `⚔️ *CEK PERMUSUHAN & RIVALITAS*\n\nTag 1/2 orang atau tulis 2 nama!\nContoh:\n• *${usedPrefix}cekmusuh @user*\n• *${usedPrefix}cekmusuh @user1 @user2*\n• *${usedPrefix}cekmusuh Tom | Jerry*` 
		}, { quoted: m });
	}

	const rate = Math.floor(Math.random() * 80) + 20;
	const type = MUSUH_TYPES[Math.floor(Math.random() * MUSUH_TYPES.length)];

	const name1 = `@${getCleanTag(target1)}`;
	const name2 = `@${getCleanTag(target2)}`;

	let ppUrl = null;
	if (target1 && sock?.profilePictureUrl) {
		try { 
			ppUrl = await sock.profilePictureUrl(target1, 'image').catch(() => null); 
		} catch (_) {}
	}

	const cardBuffer = await generateFunCard({
		title: '⚔️ CEK PERMUSUHAN & RIVAL',
		badgeText: `🔥 ${rate}% RIVAL`,
		titleBg: '#ea580c',
		badgeBg: '#ffea00',
		name: `${name1} vs ${name2}`,
		rate,
		categoryLabel: 'Kategori Rivalitas',
		categoryValue: type,
		descLabel: 'Solusi Pertikaian',
		descValue: 'Gunakan .duel @user untuk menyelesaikan permusuhan di Arena PvP Canvas!',
		footerText: 'Selesaikan percekcokan di Arena Duel Canvas!',
		barColor: '#f97316',
		showMeter: true,
		ppUrl
	}).catch(() => null);

	const replyMsg = `⚔️ *CEK PERMUSUHAN & RIVALITAS* ⚔️️\n\n` +
		`🤼‍♂️ *Rival:* ${name1} vs ${name2}\n` +
		`🔥 *Tingkat Permusuhan:* *${rate}%*\n` +
		`🎭 *Kategori Rivalitas:* ${type}\n\n` +
		`👉 _Gunakan .duel ${name2} untuk menyelesaikan permusuhan di Arena PvP Canvas!_ ⚔️\n\n` +
		`© ${global.namaBot}`;

	await sock.sendMessage(m.chat, { react: { text: '⚔️', key: m.key } }).catch(() => null);

	const mentions = [target1, target2].filter(Boolean);
	if (cardBuffer) {
		return sock.sendMessage(m.chat, {
			image: cardBuffer,
			caption: replyMsg,
			mentions
		}, { quoted: m });
	} else {
		return sock.sendMessage(m.chat, { text: replyMsg, mentions }, { quoted: m });
	}
};

handler.help = ['cekmusuh'];
handler.tags = ['fun'];
handler.command = ['cekmusuh', 'rivalcheck', 'musuh'];
handler.limit = true

export default handler;