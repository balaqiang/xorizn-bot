// .kartu — kartu profil player bergambar (foto profil, level, saldo, peringkat)
const ui = require('../../lib/ui')
const richui = require('../../lib/richui')
const flow = require('../../lib/uiflow')
const { sendRich } = require('../../lib/interactive')
const { getUser, expNeeded, topUsers } = require('../../lib/db')
const { userOf, getTargets } = require('../../lib/utils')

module.exports = {
  name: 'kartu',
  command: ['kartu', 'idcard', 'kartuplayer'],
  category: 'info',
  emoji: '🪪',
  desc: 'Kartu profil bergambar (level, saldo, peringkat)',
  usage: '[@user]',
  run: async (ctx) => {
    const { sock, msg, from, sender, args, prefix, config, reply } = ctx
    const target = getTargets(msg, args)[0] || sender
    const n = userOf(target)
    const u = getUser(target)
    if (target === sender && msg.pushName) u.name = msg.pushName
    const name = u.name || ui.maskNumber(n)
    const need = expNeeded(u.level)
    const pct = Math.min(100, Math.floor((u.exp / need) * 100))
    const ranking = topUsers('level', 1e9)
    const pos = ranking.findIndex((x) => x.id === n) + 1
    const status = require('../../lib/owners').isOwner(target) ? 'OWNER' : 'MEMBER'

    if (richui.OPTS.enabled && config.richMode !== false) {
      try {
        const card = richui.profile({
          name, number: ui.maskNumber(n), status, avatar: await richui.avatarUri(await ui.avatarOf(sock, target)),
          level: u.level, pct, exp: ui.fmt(u.exp), expNeed: ui.fmt(need), money: ui.rp(u.money), bank: ui.rp(u.bank), limit: u.limit, rank: pos, rankTotal: ranking.length
        })
        return await richui.sendHtml(sock, from, card.html, card.label)
      } catch (err) {
        console.log('[KARTU] kartu HTML gagal, pakai gambar:', err.message)
      }
    }

    const media = await flow.safeImage(async () =>
      ui.render('card', {
        botName: config.botName,
        name,
        number: ui.maskNumber(n),
        status,
        level: u.level,
        pct,
        exp: ui.fmt(u.exp),
        expNeed: ui.fmt(need),
        money: ui.rp(u.money),
        bank: ui.rp(u.bank),
        limit: u.limit,
        rank: pos,
        rankTotal: ranking.length,
        avatarBuffer: await ui.avatarOf(sock, target)
      })
    )

    const body = [
      '> ―――《 ❝ KARTU PLAYER ❞ 》―――',
      '',
      '> [ 👤 *PROFIL PENGGUNA* ]',
      `> ➥ Name : ${name}`,
      `> ➥ Status : ${status === 'OWNER' ? '👑 Owner' : '👤 Member'}`,
      `> ➥ Level : ${u.level} [ ${'■'.repeat(Math.floor(pct / 10))}${'□'.repeat(10 - Math.floor(pct / 10))} ] ${pct}%`,
      `> ➥ EXP : ${ui.fmt(u.exp)} / ${ui.fmt(need)}`,
      `> ➥ Limit : ${u.limit}`,
      `> ➥ Money : ${ui.rp(u.money)} • Bank : ${ui.rp(u.bank)}`,
      pos ? `> ➥ Peringkat : #${pos} dari ${ranking.length}` : false,
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
      console.log('[KARTU] gagal kirim kartu interaktif:', err.message)
      if (media) await sock.sendMessage(from, { image: media.image, caption: body }, { quoted: msg })
      else await reply(body)
    }
  }
}
