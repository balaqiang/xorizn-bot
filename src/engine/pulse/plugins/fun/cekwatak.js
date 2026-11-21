import { generateFunCard } from '../../lib/canvas/fun.js';

const getCleanTag = (jid) => {
	if (!jid) return '';
	return String(jid).split('@')[0].split(':')[0];
};

const WATAK_LIST = [
	{ tipe: 'Sanguinis (Periang & Ceria) ✨', desc: 'Suka bersosialisasi, ceria, & selalu jadi pusat perhatian.' },
	{ tipe: 'Koleris (Pemimpin & Tegas) 👑', desc: 'Berjiwa pemimpin, mandiri, ambisius, & berani mengambil risiko.' },
	{ tipe: 'Melankolis (Perasa & Detail) 🎨', desc: 'Pemikir mendalam, perfeksionis, sangat setia, & perasa halus.' },
	{ tipe: 'Plegmatis (Damai & Santai) 🌿', desc: 'Penyabar, tidak suka konflik, pendengar yang baik, & tenang.' }
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

	const watak = WATAK_LIST[Math.floor(Math.random() * WATAK_LIST.length)];
	const empati = Math.floor(Math.random() * 50) + 50;

	let ppUrl = null;
	if (targetJid && sock?.profilePictureUrl) {
		try { 
			ppUrl = await sock.profilePictureUrl(targetJid, 'image').catch(() => null); 
		} catch (_) {}
	}

	const cardBuffer = await generateFunCard({
		title: '🧠 ANALISIS WATAK ASLI',
		badgeText: `💖 ${empati}% EMPATI`,
		titleBg: '#0284c7',
		badgeBg: '#ffea00',
		name: cardName,
		rate: empati,
		categoryLabel: 'Tipe Kepribadian',
		categoryValue: watak.tipe,
		descLabel: 'Karakteristik Utama',
		descValue: watak.desc,
		footerText: 'Kenali dirimu & hargai karakter kepribadian sesamamu!',
		barColor: '#38bdf8',
		ppUrl
	}).catch(() => null);

	const replyText = `🧠 *ANALISIS SIFAT & WATAK ASLI* 🧠\n\n` +
		`👤 *Subjek:* ${captionTag}\n` +
		`🎭 *Tipe Kepribadian:* ${watak.tipe}\n` +
		`💖 *Tingkat Empati:* ${empati}%\n\n` +
		`📝 *Karakteristik:* _"${watak.desc}"_\n\n` +
		`© ${global.namaBot}`;

	await sock.sendMessage(m.chat, { react: { text: '🧠', key: m.key } }).catch(() => null);

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

handler.help = ['cekwatak'];
handler.tags = ['fun'];
handler.command = ['cekwatak', 'ceksifat', 'watak'];
handler.limit = true

export default handler;