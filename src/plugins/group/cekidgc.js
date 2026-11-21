// Port dari 'plugin baru' (cekidgc.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const handler = async (m, { sock, text, args, reply, usedPrefix, command }) => {
	const rawUrl = args[0] || (m.quoted ? (m.quoted.text || '') : text);

	if (!rawUrl) {
		return reply(
			`🔍 *CEK INFO & ID GRUP* 🎀\n\n` +
			`Masukkan link tautan grup WhatsApp!\n\n` +
			`• 📌 *ᴄᴏɴᴛᴏʜ:* ${usedPrefix + command} https://chat.whatsapp.com/xxxxxx`
		);
	}

	const match = rawUrl.match(/(?:https?:\/\/)?chat\.whatsapp\.com\/([0-9A-Za-z]+)/i);
	if (!match) {
		return reply('❌ Format tautan tidak valid! Pastikan tautan berasal dari chat.whatsapp.com');
	}

	const code = match[1];
	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	try {
		const info = await sock.groupGetInviteInfo(code);

		const created = info.creation
			? new Date(info.creation * 1000).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
			: '-';

		let caption = `📋 *DETAIL INFORMASI GRUP*\n\n`;
		caption += `• 🏷️ *Nama:* ${info.subject || '-'}\n`;
		caption += `• 🆔 *ID Grup:* \`${info.id || '-'}\`\n`;
		caption += `• 👥 *Total Member:* ${info.size ?? '-'}\n`;
		caption += `• 👑 *Pembuat:* @${info.owner ? info.owner.split('@')[0] : (info.id ? info.id.split('-')[0] : '-')}\n`;
		caption += `• 📅 *Dibuat:* ${created}\n`;
		caption += `• 🔒 *Tipe:* ${info.isCommunity ? 'Komunitas' : (info.announce ? 'Hanya Admin (Broadcast)' : 'Publik/Terbuka')}\n`;
		if (info.desc) {
			caption += `\n📝 *Deskripsi:*\n${info.desc.slice(0, 300)}${info.desc.length > 300 ? '...' : ''}\n`;
		}
		caption += `\n© ${global.namaBot}`;

		const mentions = [];
		if (info.owner) mentions.push(info.owner);

		await sock.sendMessage(m.chat, {
			text: caption.trim(),
			mentions
		}, { quoted: m });

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[CEKIDGC ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply('❌ Gagal mengambil info grup. Pastikan link undangan masih aktif dan tidak di-reset.');
	}
};

handler.help = ['cekidgc <link gc>', 'idgc <link gc>'];
handler.tags = ['tools'];
handler.command = ['cekidgc', 'idgc', 'infogc'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "group"})
