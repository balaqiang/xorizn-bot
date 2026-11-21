
import sendCecan from '../../../lib/extra/cecan.js'

const handler = async (m, { sock, reply }) => {
	await sendCecan(sock, m, reply, 'Malaysia')
}

handler.help = ['malaysia']
handler.tags = ['cewerandom']
handler.command = ['malaysia']
handler.limit = true;

handler.register = true;

export default handler;
