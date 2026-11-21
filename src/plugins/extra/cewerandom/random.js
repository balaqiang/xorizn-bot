
import sendCecan from '../../../lib/extra/cecan.js'

const allCategories = [
	'China', 'Hijaber', 'Indonesia', 'Japan', 'Jeni', 'Jiso',
	'Korea', 'Justinaxie', 'Malaysia', 'Rose', 'Ryujin', 'Thailand', 'Vietnam',
]

const handler = async (m, { sock, reply }) => {
	const category = allCategories[Math.floor(Math.random() * allCategories.length)]
	await sendCecan(sock, m, reply, category)
}

handler.help = ['cewerandom']
handler.tags = ['cewerandom']
handler.command = ['cewerandom', 'ceweku']
handler.limit = true;

handler.register = true;

export default handler;
