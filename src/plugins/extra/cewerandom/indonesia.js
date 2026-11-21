
import sendCecan from '../../../lib/extra/cecan.js'

const handler = async (m, { sock, reply }) => {
	await sendCecan(sock, m, reply, 'Indonesia')
}

handler.help = ['indonesia']
handler.tags = ['cewerandom']
handler.command = ['indonesia']
handler.limit = true;

handler.register = true;

export default handler;
