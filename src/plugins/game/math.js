const quiz = require('../../lib/quizgame')
const { mathQuestion, LEVELS } = require('../../lib/quizdata')
const { btn } = require('../../lib/interactive')
const { sendGame } = require('../../lib/richgame')
const { rp } = require('../../lib/game')

module.exports = {
  name: 'math',
  command: ['math', 'matematika'],
  category: 'game',
  desc: 'Kuis hitungan cepat (mudah / sedang / sulit)',
  usage: '[mudah|sedang|sulit]',
  run: async (ctx) => {
    const { args, prefix } = ctx
    const first = (args[0] || '').toLowerCase()

    if (first === 'jawab') return quiz.answer(ctx, { game: 'math', cmd: 'math', index: Number(args[1]) })

    if (!LEVELS[first]) {
      return sendGame(ctx, {
        body: `🧮 *KUIS HITUNGAN*\n\nPilih tingkat kesulitan:\n${Object.entries(LEVELS)
          .map(([k, v]) => `• ${k} — hadiah ${rp(v.reward)}`)
          .join('\n')}`,
        buttons: Object.keys(LEVELS).map((k) => btn.reply(k[0].toUpperCase() + k.slice(1), `${prefix}math ${k}`))
      })
    }

    const m = mathQuestion(first)
    const q = { text: m.text, options: m.options, correct: m.correct, reward: LEVELS[first].reward, ttl: LEVELS[first].ttl, again: `math ${first}` }
    await quiz.start(ctx, { game: 'math', cmd: 'math', title: `🧮 *HITUNGAN (${first.toUpperCase()})*`, q })
  }
}
