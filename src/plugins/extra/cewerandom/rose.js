
import sendCecan from '../../../lib/extra/cecan.js'

const handler = async (m, { sock, reply }) => {
	await sendCecan(sock, m, reply, 'Rose')
}

handler.help = ['rose']
handler.tags = ['cewerandom']
handler.command = ['rose']
handler.limit = true;

handler.register = true;

export default handler;
