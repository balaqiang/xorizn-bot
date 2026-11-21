
const handler = async (m, { sock, conn, text, reply, usedPrefix, command }) => {
	const client = conn || sock
	if (!text) {
		return reply(
			`📌 *Gunakan format:*\n\n` +
			`• *${usedPrefix + command} <link_grup>*\n` +
			`  _Contoh: ${usedPrefix + command} https://chat.whatsapp.com/ExAmPlEcOdE123_\n\n` +
			`• *${usedPrefix + command} <code_invite>*\n` +
			`  _Contoh: ${usedPrefix + command} ExAmPlEcOdE123_`
		)
	}

	const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z_-]{18,26})/i
	let match = text.match(linkRegex)

	let inviteCode = ''
	if (match) {
		inviteCode = match[1]
	} else {
		inviteCode = text.trim().split('/').pop().split('?')[0].replace(/[^0-9A-Za-z_-]/g, '')
	}

	if (!inviteCode || inviteCode.length < 15) {
		return reply('❌ Link atau Kode Invite Grup tidak valid!')
	}

	try {
		await reply('🔄 Sedang mencoba bergabung ke grup...')
		const res = await client.groupAcceptInvite(inviteCode)

		if (res) {
			reply(`✅ Berhasil bergabung ke grup!\n🆔 JID: \`${res.endsWith('@g.us') ? res : res + '@g.us'}\``)
		} else {
			reply('✅ Berhasil mengirim permintaan bergabung ke grup.')
		}
	} catch (err) {
		console.error('[JOIN ERROR]', err)
		const errMsg = err?.output?.payload?.message || err?.message || String(err)
		if (errMsg.includes('bad-request')) {
			reply('❌ *Gagal bergabung:* Link invite tidak valid, telah kedaluwarsa, atau bot telah dikeluarkan dari grup.')
		} else if (errMsg.includes('not-authorized')) {
			reply('❌ *Gagal bergabung:* Bot di-ban dari grup ini atau grup memerlukan persetujuan admin.')
		} else {
			reply(`❌ Gagal bergabung ke grup:\n${errMsg}`)
		}
	}
}

handler.help = ['join <link/code>']
handler.tags = ['owner']
handler.command = ['join', 'joingc', 'joingroup']
handler.owner = true
handler.register = true
handler.noJadiBot = true

export default handler
