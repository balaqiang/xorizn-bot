
import sendCecan from '../../../lib/extra/cecan.js'

const handler = async (m, { sock, reply }) => {
	await sendCecan(sock, m, reply, 'Thailand')
}

handler.help = ['thailand']
handler.tags = ['cewerandom']
handler.command = ['thailand']
handler.limit = true;

handler.register = true;

export default handler;
