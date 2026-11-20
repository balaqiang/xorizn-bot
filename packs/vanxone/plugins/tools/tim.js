const { shuffle } = require('../../lib/fx')
module.exports = {
  name: 'tim', command: ['tim', 'bagitim', 'urutan', 'acakurutan'], category: 'tools', emoji: '👥', desc: 'Bagi nama jadi tim acak, atau acak urutan giliran', usage: 'tim <jumlah tim> nama1, nama2, ... | urutan nama1, nama2, ...',
  run: async ({ command, args, text, prefix, reply }) => {
    const urut = ['urutan', 'acakurutan'].includes(command)
    const k = urut ? 0 : parseInt(args[0], 10)
    const names = (urut ? text : args.slice(1).join(' ')).split(/[,\n]/).map((x) => x.trim()).filter(Boolean)
    if (names.length < 2 || (!urut && !(k >= 2 && k <= names.length))) return reply(urut ? `Contoh: ${prefix}urutan Andi, Budi, Citra, Dedi` : `Contoh: ${prefix}tim 2 Andi, Budi, Citra, Dedi, Eka`)
    if (names.length > 60) return reply('Maksimal 60 nama.')
    const s = shuffle(names)
    if (urut) return reply(`🔀 *URUTAN GILIRAN*\n\n${s.map((n, i) => `${i + 1}. ${n}`).join('\n')}`)
    const teams = Array.from({ length: k }, () => [])
    s.forEach((n, i) => teams[i % k].push(n))
    await reply(`👥 *PEMBAGIAN TIM*\n\n${teams.map((t, i) => `*Tim ${i + 1}* (${t.length})\n${t.map((n) => `➥ ${n}`).join('\n')}`).join('\n\n')}`)
  }
}
