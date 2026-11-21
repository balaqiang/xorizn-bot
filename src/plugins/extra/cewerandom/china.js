
import sendCecan from '../../../lib/extra/cecan.js'

const handler = async (m, { sock, reply }) => {
	await sendCecan(sock, m, reply, 'China')
}

handler.help = ['china']
handler.tags = ['cewerandom']
handler.command = ['china']
handler.limit = true;

handler.register = true;

export default handler;
