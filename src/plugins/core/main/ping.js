export default {
  command: ['ping', 'p'],
  category: 'main',
  description: 'Cek kecepatan respon bot',
  async run(m) {
    const t = Date.now()
    const sent = await m.reply('🏓 Pong!')
    return m.reply({ text: `🏓 Pong! *${Date.now() - t} ms*`, edit: sent.key })
  }
}
