// .dashboard — dashboard status server bergambar (CPU, RAM, heap, uptime, ping)
const ui = require('../../lib/ui')
const richui = require('../../lib/richui')
const flow = require('../../lib/uiflow')
const { sendRich } = require('../../lib/interactive')
const { countUsers } = require('../../lib/db')

module.exports = {
  name: 'dashboard',
  command: ['dashboard', 'sysinfo', 'serverinfo'],
  category: 'info',
  emoji: '📊',
  desc: 'Dashboard status server bergambar',
  run: async (ctx) => {
    const { sock, msg, from, plugins, config, reply } = ctx
    const s = ui.systemStats()
    const ts = Number(msg.messageTimestamp || 0) * 1000
    const ms = ts ? Math.min(9999, Math.max(1, Date.now() - ts)) : 0
    const total = new Set(plugins).size

    if (richui.OPTS.enabled && config.richMode !== false) {
      try {
        const card = richui.dashboard({
          gauges: [
            { label: 'CPU', pct: s.cpu, sub: s.cpuText },
            { label: 'RAM', pct: s.ram, sub: s.ramText },
            { label: 'Heap', pct: s.heap, sub: s.heapText }
          ],
          rows: [
            { k: 'Uptime', v: `<span data-up="${Math.floor(process.uptime())}"></span>`, raw: true },
            ms ? { k: 'Ping', v: `${ms} ms` } : null,
            { k: 'Fitur', v: `${total} plugin` },
            { k: 'User', v: String(countUsers()) },
            { k: 'Sistem', v: `${s.platform} • Node ${s.node}` }
          ].filter(Boolean)
        })
        return await richui.sendHtml(sock, from, card.html, card.label)
      } catch (err) {
        console.log('[DASHBOARD] kartu HTML gagal, pakai gambar:', err.message)
      }
    }

    const media = await flow.safeImage(() =>
      ui.render('status', {
        botName: config.botName,
        cpu: s.cpu,
        cpuText: s.cpuText,
        ram: s.ram,
        ramText: s.ramText,
        heap: s.heap,
        heapText: s.heapText,
        uptime: ui.uptimeShort(),
        ping: ms ? `${ms} ms` : '-',
        plugins: total,
        users: countUsers(),
        node: s.node
      })
    )

    const body = [
      '> ―――《 ❝ DASHBOARD ❞ 》―――',
      '',
      '> [ 📊 *STATUS SERVER* ]',
      `> ➥ CPU : ${ui.bar(s.cpu)} ${Math.round(s.cpu)}%`,
      `> ➥ RAM : ${ui.bar(s.ram)} ${Math.round(s.ram)}% (${s.ramText})`,
      `> ➥ Heap : ${ui.bar(s.heap)} ${Math.round(s.heap)}%`,
      `> ➥ Uptime : ${ui.uptimeShort()}`,
      ms ? `> ➥ Ping : ${ms} ms` : false,
      `> ➥ Sistem : ${s.platform} • Node ${s.node}`,
      '',
      `> ${flow.line}`,
      '> 📂 Klik button di bawah untuk melihat fitur:'
    ]
      .filter((l) => l !== false && l !== undefined)
      .join('\n')

    try {
      await sendRich(sock, from, {
        media,
        body,
        footer: config.footer,
        buttons: flow.navButtons(ctx, { withHome: true }),
        quoted: msg,
        hints: false
      })
    } catch (err) {
      console.log('[DASHBOARD] gagal kirim kartu interaktif:', err.message)
      if (media) await sock.sendMessage(from, { image: media.image, caption: body }, { quoted: msg })
      else await reply(body)
    }
  }
}
