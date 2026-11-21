
import sendCecan from '../../../lib/extra/cecan.js'

const handler = async (m, { sock, reply }) => {
	await sendCecan(sock, m, reply, 'Jiso')
}

handler.help = ['jiso']
handler.tags = ['cewerandom']
handler.command = ['jiso']
handler.limit = true;

handler.register = true;

export default handler;
