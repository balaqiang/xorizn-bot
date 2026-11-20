const crypto = require('crypto')

module.exports = {
  name: 'acak',
  command: ['acak', 'random', 'uuid'],
  category: 'tools',
  desc: 'Angka acak (.acak 1 100) atau UUID (.uuid)',
  usage: '[min] [max]',
  run: async ({ command, args, prefix, reply }) => {
    if (command === 'uuid') return reply(`🆔 ${crypto.randomUUID()}`)
    const a = args.length >= 2 ? Number(args[0]) : 1
    const b = args.length >= 2 ? Number(args[1]) : Number(args[0] ?? 100)
    if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || a > b) return reply(`Format: ${prefix}acak <min> <max>\nContoh: ${prefix}acak 1 100`)
    await reply(`🎲 Angka acak (${a}–${b}): *${crypto.randomInt(a, b + 1)}*`)
  }
}
