
import sendCecan from '../../../lib/extra/cecan.js'

const handler = async (m, { sock, reply }) => {
	await sendCecan(sock, m, reply, 'Korea')
}

handler.help = ['korea']
handler.tags = ['cewerandom']
handler.command = ['korea']
handler.limit = true;

handler.register = true;

export default handler;
