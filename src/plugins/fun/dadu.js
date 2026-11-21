const { rand } = require('../../lib/game')

module.exports = {
  name: 'dadu',
  command: ['dadu', 'roll'],
  category: 'fun',
  desc: 'Lempar dadu (default 6 sisi)',
  usage: '[sisi]',
  run: async ({ args, reply }) => {
    const sides = Math.min(Math.max(parseInt(args[0], 10) || 6, 2), 1000)
    await reply(`Dadu ${sides} sisi: *${rand(1, sides)}*`)
  }
}
