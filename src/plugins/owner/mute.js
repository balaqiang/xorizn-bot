// Port dari 'plugin baru' (gc_mute.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const handler = async (m, { sock, reply, command, getGroup, updateData, getMutedGroups }) => {
	if (!m.isGroup && command !== 'listmute') return reply(require('../../config').mess.only.group);

	if (command === 'mute') {
		const chatDb = await getGroup(m.chat);

		if (chatDb.mute === 1) {
			return reply('*Grup* ini sudah di *mute*');
		}

		await updateData('groups', m.chat, 'mute', 1);
		return reply('Grup ini *berhasil di mute*');
	}

	if (command === 'unmute') {
		const chatDb = await getGroup(m.chat);

		if (chatDb.mute === 0) {
			return reply('Grup ini tidak di *mute*');
		}

		await updateData('groups', m.chat, 'mute', 0);
		return reply('Grup ini *berhasil di unmute*');
	}

	if (command === 'listmute') {
		const list = await getMutedGroups();

		if (!list.length) {
			return reply('Tidak ada Grup Chat yang sedang di-mute.');
		}

		let teks = '*List group di mute*\n\n';

		const rows = await Promise.all(
			list.map(async (row, i) => {
				let nama = 'Unknown';

				try {
					const meta = await sock.groupMetadata(row.id);
					nama = meta.subject;
				} catch {}

				return `- Name : ${nama}\n- ID Grup : ${row.id}\n`;
			})
		);

		teks += rows.join('\n');

		return reply(teks);
	}
};

handler.command = ['mute', 'unmute', 'listmute'];
handler.owner = true;

module.exports = S.wrap(handler, {"category": "owner"})
