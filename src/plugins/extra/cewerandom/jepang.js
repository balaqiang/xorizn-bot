
import sendCecan from '../../../lib/extra/cecan.js'

const handler = async (m, { sock, reply }) => {
	await sendCecan(sock, m, reply, 'Japan')
}

handler.help = ['jepang']
handler.tags = ['cewerandom']
handler.command = ['jepang']
handler.limit = true;

handler.register = true;

export default handler;
