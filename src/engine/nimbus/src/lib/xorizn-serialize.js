// Dipakai plugin qwa hanya kalau sock.store ada (xorizn-bot tidak memakainya), jadi cukup passthrough.
export async function serialize(sock, msg) { return msg }
export default serialize
