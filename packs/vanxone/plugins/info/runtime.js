const fmt = require('../../lib/fmt')
const { formatUptime } = require('../../lib/utils')

const wib = (d) => d.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace('.', ':')

module.exports = {
  name: 'runtime',
  command: ['runtime', 'uptime'],
  category: 'info',
  desc: 'Lama bot aktif dan waktu mulai',
  run: async ({ reply, config }) => {
    const up = process.uptime()
    const started = new Date(Date.now() - up * 1000)
    const days = Math.floor(up / 86400)
    await reply(
      fmt.card({
        icon: '⏱️',
        title: 'Runtime bot',
        rows: [
          ['Bot', config.botName, '🤖'],
          ['Aktif selama', formatUptime(up), '⏳'],
          ['Mulai aktif', `${wib(started)} WIB`, '🚀'],
          ['Total hari', `${days} hari`, '📅'],
          ['Waktu sekarang', `${wib(new Date())} WIB`, '🕒']
        ]
      })
    )
  }
}
