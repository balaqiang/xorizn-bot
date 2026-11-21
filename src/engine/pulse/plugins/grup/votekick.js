const VOTE_TTL = 10 * 60 * 1000

const handler = async (m, { sock, text, args, reply, usedPrefix, command, getVoteKicks, saveDatabase }) => {
	let target
	let thresholdArg

	if (m.mentionedJid?.[0]) {
		target = m.mentionedJid[0]
		thresholdArg = args.find(a => /^\d+$/.test(a))
	} else if (m.quoted?.sender) {
		target = m.quoted.sender
		thresholdArg = args.find(a => /^\d+$/.test(a))
	} else if (args[0] && /^\d{5,}$/.test(args[0].replace(/[^0-9]/g, ''))) {
		target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
		thresholdArg = args[1]
	}

	if (!target) return reply(`Reply atau tag target dengan command ${usedPrefix}${command} 2`)

	const threshold = Math.max(2, parseInt(thresholdArg, 10) || 3)

	const targetNum = target.split('@')[0].split(':')[0]

	const sent = await sock.sendPoll(m.chat, {
		title: `Target vote *${threshold}* vote *Kick* untuk mengeluarkan user terkait!`,
		options: ['Kick', 'No'],
		selectableCount: 1
	}, { quoted: m, mentions: [target] })

	const pollId = sent?.key?.id
	if (!pollId) return reply('Gagal mengirim poll votekick, coba lagi.')

	if (sock.saveMessageToStore) sock.saveMessageToStore(sent)

	const db = getVoteKicks()
	db[pollId] = {
		chat: m.chat,
		target,
		threshold,
		kicked: false,
		createdAt: Date.now(),
		expireAt: Date.now() + VOTE_TTL
	}
	saveDatabase()
}

handler.command = ['votekick', 'vkick', 'kik2', 'vkik']
handler.admin = true
handler.group = true
handler.botadmin = true
handler.noJadiBot = true

export default handler