// .mm — Mastermind: tebak kode 4 angka (1-6) dalam 10 percobaan
const { sessions, reward, rp } = require('../../lib/gamesession')

const S = sessions()
const MAX = 10
const rnd = () => Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 6)).join('')
function feedback(code, guess) {
  let exact = 0
  const cc = Array(7).fill(0)
  const gc = Array(7).fill(0)
  for (let i = 0; i < 4; i++) {
    if (code[i] === guess[i]) exact++
    else { cc[+code[i]]++; gc[+guess[i]]++ }
  }
  let part = 0
  for (let d = 1; d <= 6; d++) part += Math.min(cc[d], gc[d])
  return { exact, part }
}
const pegs = (f) => `${'⚫'.repeat(f.exact)}${'⚪'.repeat(f.part)}${'▫️'.repeat(4 - f.exact - f.part)}`
const board = (st) => st.history.map((h, i) => `${String(i + 1).padStart(2, ' ')}. ${h.guess.split('').join(' ')}  ${pegs(h.fb)}`).join('\n')

module.exports = {
  name: 'mastermind',
  command: ['mm', 'mastermind', 'tebakkode'],
  category: 'game',
  emoji: '🧠',
  desc: 'Mastermind: tebak kode rahasia 4 angka (1-6)',
  usage: '[baru] | <tebakan 4 angka> | menyerah',
  run: async ({ from, sender, args, prefix, reply }) => {
    const a = (args[0] || '').toLowerCase()
    let st = S.get(from, sender)
    if (a === 'menyerah' || a === 'stop') {
      if (!st) return reply('Tidak ada game Mastermind yang berjalan.')
      S.del(from, sender)
      return reply(`🏳️ Menyerah. Kodenya adalah *${st.code}*.`)
    }
    if (!st || a === 'baru') {
      st = S.set(from, sender, { code: rnd(), history: [] })
      return reply(`🧠 *MASTERMIND*\nBot menyimpan kode rahasia 4 angka (tiap angka 1-6, boleh berulang). Kamu punya ${MAX} percobaan.\n\n⚫ = angka benar & posisi benar\n⚪ = angka benar tapi posisi salah\n\nTebak: ${prefix}mm 1234`)
    }
    if (!/^[1-6]{4}$/.test(a)) return reply(`${st.history.length ? `${board(st)}\n\n` : ''}Tebakan harus 4 angka dari 1 sampai 6, contoh: ${prefix}mm 1234\nSisa percobaan: ${MAX - st.history.length}`)
    const fb = feedback(st.code, a)
    st.history.push({ guess: a, fb })
    if (fb.exact === 4) {
      S.del(from, sender)
      const prize = Math.max(2000, 20000 - (st.history.length - 1) * 1800)
      const bal = reward(sender, prize)
      return reply(`${board(st)}\n\n🎉 *BENAR!* Kode *${st.code}* terpecahkan dalam ${st.history.length} percobaan.\nHadiah: ${rp(prize)} (saldo ${rp(bal)})`)
    }
    if (st.history.length >= MAX) {
      S.del(from, sender)
      return reply(`${board(st)}\n\n💀 Percobaan habis. Kodenya *${st.code}*. Main lagi: ${prefix}mm baru`)
    }
    return reply(`${board(st)}\n\nSisa percobaan: ${MAX - st.history.length}`)
  }
}
