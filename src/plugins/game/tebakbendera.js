const quiz = require('../../lib/quizgame')
const { randomFlag } = require('../../lib/quizdata')

module.exports = {
  name: 'tebakbendera',
  command: ['tebakbendera', 'bendera'],
  category: 'game',
  desc: 'Tebak negara dari emoji bendera (pilihan ganda)',
  run: async (ctx) => {
    if ((ctx.args[0] || '').toLowerCase() === 'jawab') {
      return quiz.answer(ctx, { game: 'bendera', cmd: 'tebakbendera', index: Number(ctx.args[1]) })
    }
    const q = { ...randomFlag(), reward: 10000, ttl: 25 }
    await quiz.start(ctx, { game: 'bendera', cmd: 'tebakbendera', title: '🏳️ *TEBAK BENDERA*', q })
  }
}
