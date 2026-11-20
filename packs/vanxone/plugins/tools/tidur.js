const pad = (n) => String(n).padStart(2, '0')
const add = (h, m, mins) => { const t = (h * 60 + m + mins + 1440 * 3) % 1440; return `${pad(Math.floor(t / 60))}:${pad(t % 60)}` }
module.exports = {
  name: 'tidur', command: ['tidur', 'sleepcalc', 'jamtidur'], category: 'tools', emoji: '😴', desc: 'Hitung jam tidur/bangun ideal (siklus 90 menit)', usage: 'bangun <jam> | tidur <jam> | sekarang',
  run: async ({ args, prefix, reply }) => {
    const mode = (args[0] || '').toLowerCase()
    const t = (args[1] || '').match(/^(\d{1,2})[:.](\d{2})$/)
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    if (mode === 'sekarang') {
      const list = [3, 4, 5, 6].map((c) => `${add(now.getHours(), now.getMinutes(), 15 + c * 90)} (${c} siklus • ${c * 1.5} jam)`)
      return reply(`😴 *TIDUR SEKARANG*\n\nJika tidur sekarang (±15 menit untuk terlelap), bangun idealnya:\n${list.map((l) => `➥ ${l}`).join('\n')}`)
    }
    if (!['bangun', 'tidur'].includes(mode) || !t) return reply(`Format:\n${prefix}tidur bangun 06:00 → kapan harus tidur\n${prefix}tidur tidur 22:30 → kapan bangun\n${prefix}tidur sekarang`)
    const h = +t[1], m = +t[2]
    if (h > 23 || m > 59) return reply('Jam tidak valid.')
    if (mode === 'bangun') return reply(`😴 *JAM TIDUR IDEAL*\n\nAgar bangun *${pad(h)}:${pad(m)}*, tidurlah pada:\n${[6, 5, 4, 3].map((c) => `➥ ${add(h, m, -(c * 90) - 15)} (${c} siklus • ${c * 1.5} jam)`).join('\n')}\n_Sudah termasuk ±15 menit untuk terlelap._`)
    await reply(`😴 *JAM BANGUN IDEAL*\n\nJika tidur *${pad(h)}:${pad(m)}*, bangunlah pada:\n${[3, 4, 5, 6].map((c) => `➥ ${add(h, m, 15 + c * 90)} (${c} siklus • ${c * 1.5} jam)`).join('\n')}`)
  }
}
