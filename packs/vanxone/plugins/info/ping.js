const os = require('os')
const fmt = require('../../lib/fmt')
const { formatUptime } = require('../../lib/utils')

const mb = (n) => `${(n / 1024 / 1024).toFixed(0)} MB`
const grade = (ms) => (ms < 300 ? '🟢 Sangat cepat' : ms < 800 ? '🟡 Normal' : ms < 2000 ? '🟠 Agak lambat' : '🔴 Lambat')

module.exports = {
  name: 'ping',
  command: ['ping'],
  category: 'info',
  desc: 'Cek bot aktif, kecepatan respons, dan beban server',
  run: async ({ reply, config, msg, settings, plugins }) => {
    const sent = Number(msg?.messageTimestamp?.low ?? msg?.messageTimestamp ?? 0) * 1000
    const t0 = process.hrtime.bigint()
    const latency = sent && Date.now() - sent > -5000 ? Math.max(0, Date.now() - sent) : null
    const mem = process.memoryUsage()
    const load = os.loadavg()[0]
    const cores = os.cpus().length || 1
    const took = Number(process.hrtime.bigint() - t0) / 1e6
    await reply(
      fmt.card({
        icon: '🏓',
        title: 'Pong!',
        rows: [
          ['Status', `${config.botName} aktif`, '🟢'],
          ['Respons', latency === null ? `${took.toFixed(1)} ms (internal)` : `${latency} ms`, '⚡'],
          ['Kualitas', latency === null ? '🟢 Normal' : grade(latency), '📶'],
          ['Uptime', formatUptime(process.uptime()), '⏳'],
          ['Mode', settings?.mode || 'public', '⚙️'],
          ['Fitur', `${plugins?.length || 0} plugin`, '🧩']
        ],
        sections: [
          {
            head: 'Server',
            rows: [
              ['Beban CPU', `${load.toFixed(2)} (${cores} core)`, '🧠'],
              ['RAM bot', mb(mem.rss), '💾'],
              ['RAM server', `${mb(os.totalmem() - os.freemem())} / ${mb(os.totalmem())}`, '🖥️']
            ]
          }
        ]
      })
    )
  }
}
