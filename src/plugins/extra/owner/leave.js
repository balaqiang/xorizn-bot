
const handler = async (m, { sock, conn, text, reply, usedPrefix, command }) => {
	const client = conn || sock
	let targetJid = ''

	if (text) {
		const clean = text.trim()
		if (clean.endsWith('@g.us')) {
			targetJid = clean
		} else if (/^\d+$/.test(clean)) {
			targetJid = `${clean}@g.us`
		} else if (clean.includes('chat.whatsapp.com')) {
			const match = clean.match(/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i)
			if (match) {
				try {
					const inviteInfo = await client.groupGetInviteInfo(match[1])
					if (inviteInfo?.id) {
						targetJid = `${inviteInfo.id}@g.us`
					}
				} catch (err) {
					return reply(`❌ Gagal mendapatkan ID grup dari link: ${err?.message || err}`)
				}
			}
		}
	}

	if (!targetJid && m.isGroup) {
		targetJid = m.chat
	}

	if (!targetJid) {
		return reply(
			`📌 *Gunakan format:*\n\n` +
			`• *${usedPrefix + command}* (di dalam grup)\n` +
			`• *${usedPrefix + command} <ID_Grup>*\n` +
			`  _Contoh: ${usedPrefix + command} 120363012345678901@g.us_\n` +
			`• *${usedPrefix + command} <Link_Grup>*\n` +
			`  _Contoh: ${usedPrefix + command} https://chat.whatsapp.com/ExAmPlEcOdE123_`
		)
	}

	try {
		await client.sendMessage(targetJid, { text: '👋 Bot keluar dari grup. Sampai jumpa!' }).catch(() => null)
		await client.groupLeave(targetJid)
		reply(`✅ Berhasil keluar dari grup:\n\`${targetJid}\``)
	} catch (err) {
		console.error('[LEAVE ERROR]', err)
		reply(`❌ Gagal keluar dari grup:\n${err?.message || err}`)
	}
}

handler.help = ['leave [id/link]']
handler.tags = ['owner']
handler.command = ['leave', 'out', 'gcleft']
handler.owner = true
handler.register = true
handler.noJadiBot = true

export default handler
