const crypto = require('crypto')

module.exports = {
  name: 'password',
  command: ['password', 'pass', 'genpass'],
  category: 'tools',
  desc: 'Buat password acak yang kuat',
  usage: '[panjang 8-64]',
  run: async ({ args, isGroup, reply }) => {
    const len = Math.min(Math.max(parseInt(args[0], 10) || 16, 8), 64)
    const sets = ['abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '0123456789', '!@#$%^&*()-_=+?']
    const all = sets.join('')
    const chars = sets.map((s) => s[crypto.randomInt(s.length)]) // minimal satu dari tiap jenis
    while (chars.length < len) chars.push(all[crypto.randomInt(all.length)])
    for (let i = chars.length - 1; i > 0; i--) {
      const j = crypto.randomInt(i + 1)
      ;[chars[i], chars[j]] = [chars[j], chars[i]]
    }
    await reply(`*PASSWORD (${len} karakter)*\n\n\`\`\`${chars.join('')}\`\`\`${isGroup ? '\n\n_Sebaiknya pakai fitur ini di chat pribadi._' : ''}`)
  }
}
