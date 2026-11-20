// Logika tic-tac-toe murni
const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

function winner(b) {
  for (const [x, y, z] of LINES) if (b[x] && b[x] === b[y] && b[y] === b[z]) return b[x]
  return b.every(Boolean) ? 'draw' : null
}

function lineFor(b, who) {
  for (const l of LINES) {
    const cells = l.map((i) => b[i])
    if (cells.filter((c) => c === who).length === 2 && cells.includes(null)) return l[cells.indexOf(null)]
  }
  return -1
}

// Bot: menang -> blok -> tengah -> sudut -> sisi
function botMove(b, me = 'O', random = Math.random) {
  const other = me === 'O' ? 'X' : 'O'
  let m = lineFor(b, me)
  if (m < 0) m = lineFor(b, other)
  if (m >= 0) return m
  if (!b[4]) return 4
  const pick = (a) => { const free = a.filter((i) => !b[i]); return free.length ? free[Math.floor(random() * free.length)] : -1 }
  const c = pick([0, 2, 6, 8])
  return c >= 0 ? c : pick([1, 3, 5, 7])
}

const NUM = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣']
const render = (b) =>
  [0, 3, 6].map((r) => b.slice(r, r + 3).map((c, i) => (c === 'X' ? '❌' : c === 'O' ? '⭕' : NUM[r + i])).join('')).join('\n')

module.exports = { winner, botMove, render }
