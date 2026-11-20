import { generateFunCard } from '../../lib/canvas/fun.js';

const getCleanTag = (jid) => {
	if (!jid) return '';
	return String(jid).split('@')[0].split(':')[0];
};

const getTarget = async (m, text) => {
	let targetJid = null;
	let targetName = '';

	if (m.mentionedJid && m.mentionedJid.length > 0) {
		targetJid = m.mentionedJid[0];
	} else if (m.quoted && m.quoted.sender) {
		targetJid = m.quoted.sender;
	} else if (text && text.trim().length > 0) {
		const cleanNum = text.replace(/[^0-9]/g, '');
		if (cleanNum.length >= 7 && cleanNum.length <= 15) {
			targetJid = cleanNum + '@s.whatsapp.net';
		} else {
			targetName = text.trim();
		}
	} else {
		targetJid = m.sender;
	}

	let cardName = targetName;
	let captionTag = targetName;

	if (targetJid) {
		const cleanTag = getCleanTag(targetJid);
		captionTag = `@${cleanTag}`;

		if (!cardName) {
			cardName = (targetJid === m.sender && m.pushName) ? m.pushName : (m.quoted?.sender === targetJid && m.quoted?.pushName ? m.quoted.pushName : `@${cleanTag}`);
		}
	}

	return { targetJid, targetName: cardName, captionTag: captionTag || cardName };
};

const handler = async (m, { sock, text }) => {
	const { targetJid, targetName, captionTag } = await getTarget(m, text);

	const bentuk = ['paha mulus lezat', 'padat berotot', 'putih glowing', 'ramping jenjang', 'tebal semok', 'halus tanpa noda'][Math.floor(Math.random() * 6)];
	const kemulusan = Math.floor(Math.random() * 31) + 70;
	const tipe = ['paha ayam mcd', 'paha bidadari', 'paha aesthetic', 'paha idaman wibu', 'paha pemikat'][Math.floor(Math.random() * 5)];

	let catatan = '';
	if (kemulusan > 85) catatan = 'Mulus berkilau tanpa celah, lalat nemplok langsung melorot! 🍗✨';
	else if (kemulusan > 75) catatan = 'Paha idaman warganet, lezat dan menggoda mata! 🌟';
	else catatan = 'Natural bersih dan sedap dipandang! 🌸';

	let ppUrl = null;
	if (targetJid && sock?.profilePictureUrl) {
		try { 
			ppUrl = await sock.profilePictureUrl(targetJid, 'image').catch(() => null); 
		} catch (_) {}
	}

	const cardBuffer = await generateFunCard({
		title: '🍗 CEK PAHA CHECK',
		badgeText: `💫 ${kemulusan}% MULUS`,
		titleBg: '#06b6d4',
		badgeBg: '#ffea00',
		name: targetName,
		rate: kemulusan,
		categoryLabel: 'Kondisi & Kategori',
		categoryValue: `${bentuk} • ${tipe}`,
		descLabel: 'Catatan Kemulusan',
		descValue: catatan,
		footerText: 'Analisis kemulusan paha idaman 🍗',
		barColor: '#22d3ee',
		ppUrl
	}).catch(() => null);

	const caption = `🍗 *ʜᴀsɪʟ ᴄᴇᴋ ᴘᴀʜᴀ* 🍗\n\n` +
		`• 👤 *ᴛᴀʀɢᴇᴛ:* ${captionTag}\n` +
		`• ✨ *ᴋᴏɴᴅɪsɪ:* ${bentuk}\n` +
		`• 💫 *ᴛɪɴɢᴋᴀᴛ ᴋᴇᴍᴜʟᴜsᴀɴ:* ${kemulusan}%\n` +
		`• 🌟 *ᴋᴀᴛᴇɢᴏʀɪ:* ${tipe}\n` +
		`• 💬 *ᴄᴀᴛᴀᴛᴀɴ:* _"${catatan}"_\n\n` +
		`© ${global.namaBot}`;

	await sock.sendMessage(m.chat, { react: { text: '🍗', key: m.key } }).catch(() => null);

	const mentions = targetJid ? [targetJid] : [];
	if (cardBuffer) {
		return sock.sendMessage(m.chat, {
			image: cardBuffer,
			caption,
			mentions
		}, { quoted: m });
	} else {
		return sock.sendMessage(m.chat, {
			text: caption,
			mentions
		}, { quoted: m });
	}
};

handler.help = ['cekpaha'];
handler.tags = ['fun'];
handler.command = ['cekpaha'];
handler.limit = true

export default handler;