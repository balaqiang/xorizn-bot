const { getUser, expNeeded } = require('../../lib/db')
const { fmt, rp } = require('../../lib/game')
const { userOf, getTargets } = require('../../lib/utils')

module.exports = {
  name: 'profile',
  command: ['profile', 'me', 'profil'],
  category: 'game',
  desc: 'Lihat profil & statistik',
  usage: '[@user]',
  run: async ({ msg, sender, args, reply }) => {
    const target = getTargets(msg, args)[0] || sender
    const u = getUser(target)
    await reply(
      [
        '*PROFIL*',
        '',
        `▬ *Nama:* ${u.name || '-'}`,
        `▬ *Nomor:* ${userOf(target)}`,
        `▬ *Level:* ${u.level}`,
        `▬ *EXP:* ${fmt(u.exp)} / ${fmt(expNeeded(u.level))}`,
        `▬ *Money:* ${rp(u.money)}`,
        `▬ *Bank:* ${rp(u.bank)}`,
        `▬ *Limit:* ${u.limit}`
      ].join('\n')
    )
  }
}
