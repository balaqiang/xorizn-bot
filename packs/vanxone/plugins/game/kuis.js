const quiz = require('../../lib/quizgame')
const { randomQuestion } = require('../../lib/quizdata')

module.exports = {
  name: 'kuis',
  command: ['kuis', 'quiz'],
  category: 'game',
  desc: 'Kuis pengetahuan umum pilihan ganda (jawab pakai tombol)',
  run: async (ctx) => {
    if ((ctx.args[0] || '').toLowerCase() === 'jawab') {
      return quiz.answer(ctx, { game: 'kuis', cmd: 'kuis', index: Number(ctx.args[1]) })
    }
    const q = { ...randomQuestion(), reward: 10000, ttl: 30 }
    await quiz.start(ctx, { game: 'kuis', cmd: 'kuis', title: '🧠 *KUIS PENGETAHUAN UMUM*', q })
  }
}
