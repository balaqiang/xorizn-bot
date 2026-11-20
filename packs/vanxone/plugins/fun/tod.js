const { pick } = require('../../lib/game')
const { btn } = require('../../lib/interactive')
const { sendGame } = require('../../lib/richgame')
const truth = require('./truth')
const dare = require('./dare')

module.exports = {
  name: 'tod',
  command: ['tod', 'truthordare', 'td'],
  category: 'fun',
  desc: 'Truth or Dare dengan tombol (Truth / Dare / Acak)',
  usage: '[truth|dare]',
  run: async (ctx) => {
    const { args, prefix, sender } = ctx
    let mode = (args[0] || '').toLowerCase()
    if (mode === 'jujur') mode = 'truth'

    const buttons = [
      btn.reply('🗣️ Truth', `${prefix}tod truth`),
      btn.reply('😈 Dare', `${prefix}tod dare`),
      btn.reply('🎲 Acak', `${prefix}tod acak`)
    ]

    if (!['truth', 'dare', 'acak'].includes(mode)) {
      return sendGame(ctx, { body: '🎭 *TRUTH OR DARE*\n\nBerani pilih yang mana?', buttons })
    }
    if (mode === 'acak') mode = pick(['truth', 'dare'])

    const isTruth = mode === 'truth'
    const num = String(sender).split('@')[0].split(':')[0]
    await sendGame(ctx, {
      body: `${isTruth ? '🗣️ *TRUTH*' : '😈 *DARE*'} untuk @${num}\n\n${pick(isTruth ? truth.list : dare.list)}`,
      mentions: [sender],
      buttons
    })
  }
}
