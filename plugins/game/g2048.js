// .2048 — puzzle geser angka. Geser dengan w/a/s/d (atas/kiri/bawah/kanan).
const { sessions, reward, rp } = require('../../lib/gamesession')

const S = sessions()
const DIRS = { w: 'w', a: 'a', s: 's', d: 'd', atas: 'w', kiri: 'a', bawah: 's', kanan: 'd', up: 'w', left: 'a', down: 's', right: 'd', '8': 'w', '4': 'a', '2': 's', '6': 'd' }
const ARROW = { w: '⬆️', a: '⬅️', s: '⬇️', d: '➡️' }

function empty() {
  return Array.from({ length: 4 }, () => Array(4).fill(0))
}
function spawn(b) {
  const free = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (!b[r][c]) free.push([r, c])
  if (!free.length) return
  const [r, c] = free[Math.floor(Math.random() * free.length)]
  b[r][c] = Math.random() < 0.9 ? 2 : 4
}
function slideLeft(row) {
  const t = row.filter(Boolean)
  let gain = 0
  for (let i = 0; i < t.length - 1; i++) {
    if (t[i] === t[i + 1]) {
      t[i] *= 2
      gain += t[i]
      t.splice(i + 1, 1)
    }
  }
  while (t.length < 4) t.push(0)
  return { row: t, gain }
}
const rotate = (b) => b[0].map((_, c) => b.map((r) => r[c]).reverse()) // searah jarum jam
function move(b, dir) {
  // putar supaya arah selalu "kiri"
  const turns = { a: 0, s: 1, d: 2, w: 3 }[dir]
  let g = b.map((r) => [...r])
  for (let i = 0; i < turns; i++) g = rotate(g)
  let gain = 0
  g = g.map((r) => { const s = slideLeft(r); gain += s.gain; return s.row })
  for (let i = 0; i < (4 - turns) % 4; i++) g = rotate(g)
  const moved = g.some((r, i) => r.some((v, j) => v !== b[i][j]))
  return { board: g, gain, moved }
}
const canMove = (b) => ['w', 'a', 's', 'd'].some((d) => move(b, d).moved)
function render(st) {
  const cell = (v) => (v ? String(v).padStart(5 - Math.floor((5 - String(v).length) / 2)).padEnd(5) : '     ')
  const line = (l, m, r) => `${l}${Array(4).fill('═════').join(m)}${r}`
  const rows = st.board.map((r) => `║${r.map(cell).join('║')}║`)
  return ['```', line('╔', '╦', '╗'), rows.join(`\n${line('╠', '╬', '╣')}\n`), line('╚', '╩', '╝'), '```'].join('\n')
}

module.exports = {
  name: 'g2048',
  command: ['2048'],
  category: 'game',
  emoji: '🔢',
  desc: 'Puzzle 2048: geser dan gabungkan angka sampai 2048',
  usage: '[w|a|s|d | stop]',
  run: async ({ from, sender, args, prefix, reply }) => {
    const a = (args[0] || '').toLowerCase()
    let st = S.get(from, sender)
    if (a === 'stop' || a === 'selesai') {
      if (!st) return reply('Tidak ada game 2048 yang berjalan.')
      S.del(from, sender)
      const pay = Math.min(50000, st.score)
      const bal = reward(sender, pay)
      return reply(`🛑 Game dihentikan.\nSkor akhir: *${st.score}* (tile tertinggi ${Math.max(...st.board.flat())})${pay ? `\nHadiah: ${rp(pay)} (saldo ${rp(bal)})` : ''}`)
    }
    if (!st || a === 'baru' || a === 'new' || a === 'start') {
      st = S.set(from, sender, { board: empty(), score: 0, won: false, moves: 0 })
      spawn(st.board)
      spawn(st.board)
      return reply(`🔢 *2048* dimulai!\n${render(st)}\nGeser: ${prefix}2048 w (atas) / a (kiri) / s (bawah) / d (kanan)\nBerhenti & ambil hadiah: ${prefix}2048 stop`)
    }
    const dir = DIRS[a]
    if (!dir) return reply(`Skor: *${st.score}*\n${render(st)}\nGeser dengan ${prefix}2048 w / a / s / d`)
    const r = move(st.board, dir)
    if (!r.moved) return reply(`${render(st)}\nTidak bisa bergeser ke arah itu. Coba arah lain.`)
    st.board = r.board
    st.score += r.gain
    st.moves++
    spawn(st.board)
    const top = Math.max(...st.board.flat())
    let note = ''
    if (top >= 2048 && !st.won) {
      st.won = true
      const bal = reward(sender, 50000)
      note = `\n🎉 *TILE 2048 TERCAPAI!* Bonus ${rp(50000)} (saldo ${rp(bal)}). Lanjut terus atau ${prefix}2048 stop.`
    }
    if (!canMove(st.board)) {
      S.del(from, sender)
      const pay = Math.min(50000, st.score)
      const bal = reward(sender, pay)
      return reply(`${ARROW[dir]}\n${render(st)}\n💀 *GAME OVER*\nSkor: *${st.score}* • Tile tertinggi: ${top} • Langkah: ${st.moves}\nHadiah: ${rp(pay)} (saldo ${rp(bal)})${note}`)
    }
    return reply(`${ARROW[dir]} Skor: *${st.score}*  |  Tile tertinggi: ${top}\n${render(st)}${note}`)
  }
}
