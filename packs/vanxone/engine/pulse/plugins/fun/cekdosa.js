import { generateFunCard } from '../../lib/canvas/fun.js';

const getCleanTag = (jid) => {
	if (!jid) return '';
	return String(jid).split('@')[0].split(':')[0];
};

const DOSA_LIST = [
	'Makan gorengan 5 ngakunya cuma 2 ke abang kang gorengan 🥟',
	'Pura-pura budek pas emak manggil nyuruh beli royco 🙉',
	'Nge-read chat gebetan 3 hari kemudian baru bales "wkwk iya" 💀',
	'Minjem korek api temen tapi langsung masuk kantong celana 🚬',
	'Pura-pura tidur pas temen lagi bagi-bagi tagihan nongkrong 😴',
	'Nyolong wifi tetangga sambil download game 50GB 📶',
	'Stalking akun mantan pake fake account sampai kepencet like postingan 3 tahun lalu 📱',
	'Ngomong "otw" padahal baru bangun tidur masih iler-an 🛵',
	'Ngetik "wkwkwk" di chat padahal mukanya datar kayak triplek 🗿',
	'Balikin piring hajatan tetangga tapi isinya malah remahan biskuit 🍽️'
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

	const dosa = DOSA_LIST[Math.floor(Math.random() * DOSA_LIST.length)];
	const dosaLevel = Math.floor(Math.random() * 50) + 50;

	let ppUrl = null;
	if (targetJid && sock?.profilePictureUrl) {
		try { 
			ppUrl = await sock.profilePictureUrl(targetJid, 'image').catch(() => null); 
		} catch (_) {}
	}

	const cardBuffer = await generateFunCard({
		title: '😈 DETEKTOR DOSA KECIL',
		badgeText: `🔥 ${dosaLevel}% DOSA`,
		titleBg: '#dc2626',
		badgeBg: '#ffea00',
		name: cardName,
		rate: dosaLevel,
		categoryLabel: 'Kategori Pelanggaran',
		categoryValue: 'Dosa Kecil Lucu 🙈',
		descLabel: 'Dosa Terdeteksi',
		descValue: dosa,
		footerText: 'Segera minta maaf & perbaiki kelakuan ya!',
		barColor: '#ef4444',
		ppUrl
	}).catch(() => null);

	const replyText = `😈 *DETEKTOR DOSA KECIL TERKECIL* 😈\n\n` +
		`👤 *Pelaku:* ${captionTag}\n` +
		`🔥 *Tingkat Kenaikan Dosa:* *${dosaLevel}%*\n` +
		`📜 *Dosa Terdeteksi:* _"${dosa}"_\n\n` +
		`_Saran: Segera minta maaf dan tobat ya guys!_ 🙏\n\n` +
		`© ${global.namaBot}`;

	await sock.sendMessage(m.chat, { react: { text: '😈', key: m.key } }).catch(() => null);

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

handler.help = ['cekdosa'];
handler.tags = ['fun'];
handler.command = ['cekdosa', 'dosacheck'];
handler.limit = true

export default handler;