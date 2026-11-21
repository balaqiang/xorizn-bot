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

	const ukuran = ['32A (Mungil Imut)', '34B (Pas & Pasrah)', '36C (Montok Berisi)', '38D (Padat Mantap)', '32B (Minimalis Estetik)', '34C (Bikin Nyaman)'][Math.floor(Math.random() * 6)];
	const bentuk = ['bulat kenyal', 'kencang padat', 'glowing mulus', 'menggoda iman', 'lembut kenyal'][Math.floor(Math.random() * 5)];
	const puting = ['pink muda estetik', 'merona natural', 'mungil pink', 'cerah menggoda'][Math.floor(Math.random() * 4)];
	const kekenyalan = Math.floor(Math.random() * 41) + 60;

	let catatan = '';
	if (kekenyalan > 85) catatan = 'Kenyal maksimal seperti boba segar, bikin betah dipeluk! 🍈✨';
	else if (kekenyalan > 70) catatan = 'Pas kenyalnya dan padat berisi, idaman semua orang! 💖';
	else catatan = 'Lembut alami dan gemoy menggemaskan! 🍓';

	let ppUrl = null;
	if (targetJid && sock?.profilePictureUrl) {
		try { 
			ppUrl = await sock.profilePictureUrl(targetJid, 'image').catch(() => null); 
		} catch (_) {}
	}

	const cardBuffer = await generateFunCard({
		title: '🍈 CEK TOKET / TT CHECK',
		badgeText: `💫 ${kekenyalan}% KENYAL`,
		titleBg: '#ec4899',
		badgeBg: '#ffea00',
		name: targetName,
		rate: kekenyalan,
		categoryLabel: 'Ukuran & Bentuk',
		categoryValue: `${ukuran} • ${bentuk}`,
		descLabel: 'Catatan Tekstur',
		descValue: catatan,
		footerText: 'Analisis kecantikan & estetika alami 🍈',
		barColor: '#f472b6',
		ppUrl
	}).catch(() => null);

	const caption = `🍈 *ʜᴀsɪʟ ᴄᴇᴋ ᴛᴛ* 🍈\n\n` +
		`• 👤 *ᴛᴀʀɢᴇᴛ:* ${captionTag}\n` +
		`• 📏 *ᴜᴋᴜʀᴀɴ:* ${ukuran}\n` +
		`• ✨ *ʙᴇɴᴛᴜᴋ:* ${bentuk}\n` +
		`• 🍓 *ᴡᴀʀɴᴀ ᴘᴜᴛɪɴɢ:* ${puting}\n` +
		`• 💫 *ᴛɪɴɢᴋᴀᴛ ᴋᴇᴋᴇɴʏᴀʟᴀɴ:* ${kekenyalan}%\n` +
		`• 💬 *ᴄᴀᴛᴀᴛᴀɴ:* _"${catatan}"_\n\n` +
		`© ${global.namaBot}`;

	await sock.sendMessage(m.chat, { react: { text: '🍈', key: m.key } }).catch(() => null);

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

handler.help = ['cektt'];
handler.tags = ['fun'];
handler.command = ['cektt', 'cektoket'];
handler.limit = true

export default handler;