const { add, listOf } = require('../../lib/scheduler')

module.exports = {
  name: 'pomodoro',
  command: ['pomodoro', 'fokus'],
  category: 'tools',
  desc: 'Timer fokus: bot mengingatkan saat fokus & istirahat selesai',
  usage: '[fokus menit] [istirahat menit]',
  run: async ({ from, sender, args, prefix, reply }) => {
    const focus = args[0] ? parseInt(args[0], 10) : 25
    const rest = args[1] ? parseInt(args[1], 10) : 5
    if (!(focus >= 1 && focus <= 180) || !(rest >= 1 && rest <= 60)) return reply(`Format: ${prefix}pomodoro [fokus 1-180] [istirahat 1-60]\nContoh: ${prefix}pomodoro 25 5`)
    const a = add({ jid: from, user: sender, text: `🍅 Waktu fokus ${focus} menit selesai! Istirahat ${rest} menit dulu.`, ms: focus * 60000 })
    if (a.error) return reply(a.error)
    const b = add({ jid: from, user: sender, text: `⏰ Istirahat ${rest} menit selesai. Siap fokus lagi? Ketik ${prefix}pomodoro ${focus} ${rest}`, ms: (focus + rest) * 60000 })
    if (b.error) return reply(`Fokus dimulai, tetapi pengingat istirahat gagal dibuat: ${b.error}`)
    await reply(`🍅 *POMODORO DIMULAI*\n\n▬ Fokus: ${focus} menit\n▬ Istirahat: ${rest} menit\n\nAku kabari saat waktunya habis. Selamat bekerja!`)
  }
}
