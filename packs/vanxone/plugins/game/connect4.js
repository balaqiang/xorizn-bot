// .c4 — Connect Four melawan bot (AI minimax). Kamu 🔴, bot 🟡.
const { sessions, reward, rp } = require('../../lib/gamesession')

const S = sessions()
const R = 6
const C = 7
const ORDER = [3, 2, 4, 1, 5, 0, 6]
const LEVEL = { mudah: { depth: 2, prize: 3000 }, sedang: { depth: 4, prize: 10000 }, sulit: { depth: 6, prize: 30000 } }
const NUM = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣']

const newBoard = () => Array.from({ length: R }, () => Array(C).fill(0))
const canDrop = (b, c) => b[0][c] === 0
function drop(b, c, p) {
  for (let r = R - 1; r >= 0; r--) if (!b[r][c]) { b[r][c] = p; return r }
  return -1
}
function winner(b) {
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const p = b[r][c]
    if (!p) continue
    for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
      let k = 1
      while (k < 4 && r + dr * k >= 0 && r + dr * k < R && c + dc * k >= 0 && c + dc * k < C && b[r + dr * k][c + dc * k] === p) k++
      if (k === 4) return p
    }
  }
  return b[0].every(Boolean) ? 3 : 0
}
function score(b, p) {
  let s = 0
  const opp = p === 1 ? 2 : 1
  const win = (cells) => {
    const mine = cells.filter((x) => x === p).length
    const theirs = cells.filter((x) => x === opp).length
    const free = cells.filter((x) => !x).length
    if (mine && theirs) return 0
    if (mine === 4) return 1000
    if (mine === 3 && free === 1) return 8
    if (mine === 2 && free === 2) return 3
    if (theirs === 3 && free === 1) return -9
    if (theirs === 2 && free === 2) return -2
    return 0
  }
  for (let r = 0; r < R; r++) s += (b[r][3] === p ? 3 : b[r][3] === opp ? -3 : 0)
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
    const er = r + dr * 3
    const ec = c + dc * 3
    if (er < 0 || er >= R || ec < 0 || ec >= C) continue
    s += win([0, 1, 2, 3].map((k) => b[r + dr * k][c + dc * k]))
  }
  return s
}
function minimax(b, depth, alpha, beta, maxing) {
  const w = winner(b)
  if (w === 2) return 1e6 + depth
  if (w === 1) return -1e6 - depth
  if (w === 3 || depth === 0) return score(b, 2)
  if (maxing) {
    let best = -Infinity
    for (const c of ORDER) {
      if (!canDrop(b, c)) continue
      const r = drop(b, c, 2)
      best = Math.max(best, minimax(b, depth - 1, alpha, beta, false))
      b[r][c] = 0
      alpha = Math.max(alpha, best)
      if (alpha >= beta) break
    }
    return best
  }
  let best = Infinity
  for (const c of ORDER) {
    if (!canDrop(b, c)) continue
    const r = drop(b, c, 1)
    best = Math.min(best, minimax(b, depth - 1, alpha, beta, true))
    b[r][c] = 0
    beta = Math.min(beta, best)
    if (alpha >= beta) break
  }
  return best
}
function botMove(b, depth) {
  let best = -Infinity
  let col = ORDER.find((c) => canDrop(b, c))
  for (const c of ORDER) {
    if (!canDrop(b, c)) continue
    const r = drop(b, c, 2)
    const v = minimax(b, depth - 1, -Infinity, Infinity, false) + Math.random() * 0.01
    b[r][c] = 0
    if (v > best) { best = v; col = c }
  }
  return col
}
const render = (b, last) => `${NUM.join('')}\n${b.map((row, r) => row.map((v, c) => (v === 1 ? '🔴' : v === 2 ? '🟡' : '⚪')).join('')).join('\n')}${last ? `\n_Bot menjatuhkan di kolom ${last}_` : ''}`

module.exports = {
  name: 'connect4',
  command: ['c4', 'connect4', 'sambung4'],
  category: 'game',
  emoji: '🔴',
  desc: 'Connect 4 lawan bot: sambungkan 4 bidak berurutan',
  usage: '[mudah|sedang|sulit] | <kolom 1-7> | stop',
  run: async ({ from, sender, args, prefix, reply }) => {
    const a = (args[0] || '').toLowerCase()
    let st = S.get(from, sender)
    if (a === 'stop') { S.del(from, sender); return reply('🏳️ Game Connect 4 dihentikan.') }
    if (LEVEL[a] || !st || a === 'baru') {
      const lv = LEVEL[a] ? a : 'sedang'
      st = S.set(from, sender, { board: newBoard(), level: lv })
      return reply(`🔴 *CONNECT 4* — level ${lv} (hadiah ${rp(LEVEL[lv].prize)})\nKamu 🔴 jalan duluan.\n\n${render(st.board)}\n\nJatuhkan bidak: ${prefix}c4 <1-7>`)
    }
    const col = Number(a) - 1
    if (!Number.isInteger(col) || col < 0 || col >= C) return reply(`${render(st.board)}\n\nPilih kolom 1-7: ${prefix}c4 4`)
    if (!canDrop(st.board, col)) return reply('Kolom itu sudah penuh, pilih kolom lain.')
    drop(st.board, col, 1)
    let w = winner(st.board)
    if (w === 1) {
      S.del(from, sender)
      const bal = reward(sender, LEVEL[st.level].prize)
      return reply(`${render(st.board)}\n\n🎉 *KAMU MENANG!* Hadiah ${rp(LEVEL[st.level].prize)} (saldo ${rp(bal)})`)
    }
    if (w === 3) { S.del(from, sender); return reply(`${render(st.board)}\n\n🤝 *SERI!* Papan penuh.`) }
    const bc = botMove(st.board, LEVEL[st.level].depth)
    drop(st.board, bc, 2)
    w = winner(st.board)
    if (w === 2) { S.del(from, sender); return reply(`${render(st.board, bc + 1)}\n\n🤖 *BOT MENANG!* Coba lagi: ${prefix}c4 ${st.level}`) }
    if (w === 3) { S.del(from, sender); return reply(`${render(st.board, bc + 1)}\n\n🤝 *SERI!* Papan penuh.`) }
    return reply(`${render(st.board, bc + 1)}\n\nGiliranmu: ${prefix}c4 <1-7>`)
  }
}
