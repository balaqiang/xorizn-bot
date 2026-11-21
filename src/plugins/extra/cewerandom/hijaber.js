
import sendCecan from '../../../lib/extra/cecan.js'

const handler = async (m, { sock, reply }) => {
	await sendCecan(sock, m, reply, 'Hijaber')
}

handler.help = ['hijaber']
handler.tags = ['cewerandom']
handler.command = ['hijaber']
handler.limit = true;

handler.register = true;

export default handler;
