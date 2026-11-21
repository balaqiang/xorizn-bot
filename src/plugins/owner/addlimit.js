// Port dari 'plugin baru' (addlimit.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const { getUser: _gu, save: _save } = require('../../lib/db')
const getUser = async (jid) => ({ ...(_gu(jid)), limit_val: _gu(jid).limit })
const incrementData = async (_t, jid, _f, n) => { const u = _gu(jid); u.limit = Math.max(0, u.limit + n); _save() }

const handler = async (m, { text, usedPrefix, command, reply }) => {
	let target = m.quoted ? m.quoted.sender : m.mentionedJid?.[0]
	let amount = 0

	const args = text.trim().split(/\s+/)

	if (target) {
		amount = parseInt(args[0]) || parseInt(args[1])
	} else if (args[0] && args[1]) {
		target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
		amount = parseInt(args[1])
	}

	if (!target || isNaN(amount) || amount <= 0) {
		return reply(
			`*Format salah!*\n\n` +
			`Contoh pemakaian:\n` +
			`• Reply pesan: \`${usedPrefix + command} 10\`\n` +
			`• Tag orang: \`${usedPrefix + command} 10 @user\`\n` +
			`• Ketik nomor: \`${usedPrefix + command} 6285181833750 10\``
		)
	}

	await getUser(target)
	await incrementData('users', target, 'limit_val', amount)
	const user = await getUser(target)

	return reply(`✅ Berhasil menambahkan *+${amount}* limit ke @${target.split('@')[0]}.\nTotal limit sekarang: *${user.limit_val}*`, null, {
		mentions: [target]
	})
}

handler.command = ['addlimit']
handler.owner = true

module.exports = S.wrap(handler, {"category": "owner"})
