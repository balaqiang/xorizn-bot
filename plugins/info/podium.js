// .podium — papan peringkat level bergambar (juara 1-3 di podium, 4-8 di daftar)
const ui = require('../../lib/ui')
const richui = require('../../lib/richui')
const flow = require('../../lib/uiflow')
const { sendRich } = require('../../lib/interactive')
const { topUsers } = require('../../lib/db')

module.exports = {
  name: 'podium',
  command: ['podium', 'toplevel', 'juara'],
  category: 'info',
  emoji: '🏆',
  desc: 'Podium peringkat level tertinggi (bergambar)',
  run: async (ctx) => {
    const { sock, msg, from, config, reply } = ctx
    const top = topUsers('level', 8).map((u) => ({ name: u.name || ui.maskNumber(u.id), level: u.level, exp: u.exp }))
    if (!top.length) return reply('Belum ada data peringkat.')

    if (richui.OPTS.enabled && config.richMode !== false) {
      try {
        const card = richui.podium({ top })
        return await richui.sendHtml(sock, from, card.html, card.label)
      } catch (err) {
        console.log('[PODIUM] kartu HTML gagal, pakai gambar:', err.message)
      }
    }

    const media = await flow.safeImage(() => ui.render('podium', { botName: config.botName, top }))
    const medals = ['🥇', '🥈', '🥉']
    const body = [
      '> ―――《 ❝ PODIUM ❞ 》―――',
      '',
      '> [ 🏆 *PERINGKAT LEVEL TERTINGGI* ]',
      ...top.map((u, i) => `> ${medals[i] || `#${i + 1}`} ${ui.cut(u.name, 22)} • Level ${u.level}`),
      '',
      `> ${flow.line}`,
      '> 📂 Klik button di bawah untuk melihat fitur:'
    ].join('\n')

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
      console.log('[PODIUM] gagal kirim kartu interaktif:', err.message)
      if (media) await sock.sendMessage(from, { image: media.image, caption: body }, { quoted: msg })
      else await reply(body)
    }
  }
}
