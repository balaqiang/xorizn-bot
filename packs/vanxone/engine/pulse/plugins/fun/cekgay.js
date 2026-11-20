import { generateFunCard } from '../../lib/canvas/fun.js';

const getCleanTag = (jid) => {
	if (!jid) return '';
	return String(jid).split('@')[0].split(':')[0];
};

const getTarget = async (m, text, user, getUser) => {
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
			let uData = null;
			if (targetJid === m.sender && user) {
				uData = user;
			} else if (typeof getUser === 'function') {
				try { uData = await getUser(targetJid); } catch (_) {}
			}
			
			const foundName = uData?.name || uData?.nama || (m.quoted?.sender === targetJid ? m.quoted?.pushName : null);
			if (foundName && foundName !== 'User' && !/^\d+$/.test(foundName)) {
				cardName = foundName;
			} else if (targetJid === m.sender && m.pushName) {
				cardName = m.pushName;
			} else {
				cardName = `@${cleanTag}`;
			}
		}
	}

	return { targetJid, targetName: cardName, captionTag: captionTag || cardName };
};

const getPercentage = () => Math.floor(Math.random() * 101);

const getAnalysis = (pct) => {
	let comment = '', categoryVal = '';
	if (pct > 85) { comment = 'Pelangi abadi! Suka cowok berotot wangi!'; categoryVal = 'Gay Akut 🌈'; }
	else if (pct > 60) { comment = 'Kadang tatapannya agak mencurigakan ke cowok lain.'; categoryVal = 'Agak Melambai 💅'; }
	else if (pct > 30) { comment = 'Normal tapi suka nonton anime cowok tampan.'; categoryVal = 'Wajar Saja 👍'; }
	else { comment = 'Lelaki tulen, anti belok!'; categoryVal = 'Straight Sejati 🗿'; }
	return { comment, categoryVal };
};

const handler = async (m, { sock, text, user, getUser }) => {
	const { targetJid, targetName, captionTag } = await getTarget(m, text, user, getUser);
	const percentage = getPercentage();
	const { comment, categoryVal } = getAnalysis(percentage);

	let ppUrl = null;
	if (targetJid && sock?.profilePictureUrl) {
		try { 
			ppUrl = await sock.profilePictureUrl(targetJid, 'image').catch(() => null); 
		} catch (_) {}
	}

	const cardBuffer = await generateFunCard({
		title: '🌈 CEK TINGKAT GAY',
		badgeText: `📊 ${percentage}% GAY`,
		titleBg: '#a855f7',
		badgeBg: '#ffea00',
		name: targetName,
		rate: percentage,
		categoryLabel: 'Level Gay',
		categoryValue: categoryVal,
		descLabel: 'Catatan Analisis',
		descValue: comment,
		footerText: 'Cuma tes fun, jangan dianggap serius ya!',
		barColor: '#c084fc',
		ppUrl
	}).catch(() => null);

	const caption = `🎯 *ʜᴀsɪʟ ᴄʜᴇᴄᴋ* 🎯\n\n` +
		`• 👤 *ᴛᴀʀɢᴇᴛ:* ${captionTag}\n` +
		`• 📊 *ᴘᴇʀsᴇɴᴛᴀsᴇ:* *${percentage}%*\n` +
		`• 🏷️ *sᴛᴀᴛᴜs:* ${categoryVal}\n` +
		`• 💬 *ᴄᴀᴛᴀᴛᴀɴ:* _"${comment}"_\n\n` +
		`© ${global.namaBot}`;

	await sock.sendMessage(m.chat, { react: { text: '🌈', key: m.key } }).catch(() => null);

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

handler.help = ["cekgay"];
handler.tags = ["fun"];
handler.command = ["cekgay", "gaycheck"];
handler.limit = true

export default handler;