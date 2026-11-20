const os = require('os')
const { formatUptime } = require('../../lib/utils')
const { countUsers } = require('../../lib/db')

const mb = (n) => `${(n / 1024 / 1024).toFixed(0)} MB`

module.exports = {
  name: 'botinfo',
  command: ['botinfo', 'stats', 'status'],
  category: 'info',
  desc: 'Status & statistik bot/server',
  run: async ({ plugins, settings, config, prefix, reply }) => {
    const mem = process.memoryUsage()
    const cpu = os.cpus()
    await reply(
      [
        `*${config.botName.toUpperCase()} STATUS*`,
        '',
        `▬ *Uptime:* ${formatUptime(process.uptime())}`,
        `▬ *Mode:* ${settings.mode}`,
        `▬ *Prefix:* ${prefix}`,
        `▬ *Fitur:* ${plugins.length} plugin`,
        `▬ *User terdaftar:* ${countUsers()}`,
        '',
        '*SERVER*',
        `▬ *Node:* ${process.version}`,
        `▬ *OS:* ${os.type()} ${os.release()} (${os.arch()})`,
        `▬ *CPU:* ${cpu[0]?.model?.trim() || '-'} (${cpu.length} core)`,
        `▬ *Load:* ${os.loadavg().map((n) => n.toFixed(2)).join(' / ')}`,
        `▬ *RAM server:* ${mb(os.totalmem() - os.freemem())} / ${mb(os.totalmem())}`,
        `▬ *RAM bot:* ${mb(mem.rss)}`
      ].join('\n')
    )
  }
}
