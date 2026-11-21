
import sendCecan from '../../../lib/extra/cecan.js'

const handler = async (m, { sock, reply }) => {
	await sendCecan(sock, m, reply, 'Justinaxie')
}

handler.help = ['justinaxie']
handler.tags = ['cewerandom']
handler.command = ['justinaxie']
handler.limit = true;

handler.register = true;

export default handler;
