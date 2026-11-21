
import sendCecan from '../../../lib/extra/cecan.js'

const handler = async (m, { sock, reply }) => {
	await sendCecan(sock, m, reply, 'Vietnam')
}

handler.help = ['vietnam']
handler.tags = ['cewerandom']
handler.command = ['vietnam']
handler.limit = true;

handler.register = true;

export default handler;
