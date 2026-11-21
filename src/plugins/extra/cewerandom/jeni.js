
import sendCecan from '../../../lib/extra/cecan.js'

const handler = async (m, { sock, reply }) => {
	await sendCecan(sock, m, reply, 'Jeni')
}

handler.help = ['jeni']
handler.tags = ['cewerandom']
handler.command = ['jeni']
handler.limit = true;

handler.register = true;

export default handler;
