
import axios from 'axios'

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
	const client = conn || sock
	if (!text) {
		return reply(`*NPM Package Stalker (Kyzz API)*\n\nContoh:\n${usedPrefix}${command} express\n${usedPrefix}${command} xorizn-baileys`)
	}

	reply(`⏳ Mengambil data package NPM *"${text}"*...`)

	try {
		const apiUrl = global.API('kyzz', '/api/search/npm', { query: text }, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 15000 })

		if (!data || !data.status || !Array.isArray(data.result) || data.result.length === 0) {
			return reply(`❌ Package NPM *"${text}"* tidak ditemukan.`)
		}

		const pkg = data.result[0]
		const caption = `📦 *NPM PACKAGE STALKER*\n\n` +
			`📌 *Nama:* ${pkg.name}\n` +
			`🏷️ *Versi Terbaru:* v${pkg.version || '-'}\n` +
			`📝 *Deskripsi:* ${pkg.description || '-'}\n` +
			`📜 *Lisensi:* ${pkg.license || '-'}\n` +
			`📅 *Terakhir Update:* ${pkg.date ? new Date(pkg.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}\n` +
			`🔗 *NPM Link:* https://www.npmjs.com/package/${pkg.name}`

		return reply(caption)
	} catch (e) {
		console.error('[NPM STALK ERROR]', e.response?.data || e.message)
		return reply('❌ Gagal mengambil info package NPM.')
	}
}

handler.help = ['npmstalk <package_name>', 'npm <package_name>']
handler.tags = ['search', 'tools']
handler.command = ['npmstalk', 'npmsearch', 'npm']
handler.limit = true;
handler.register = true

export default handler
