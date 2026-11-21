// .ms — Minesweeper (cari semua kotak aman tanpa menyentuh ranjau)
const { sessions, reward, rp } = require('../../lib/gamesession')

const S = sessions()
const LEVEL = {
  mudah: { size: 5, mines: 4, prize: 5000 },
  sedang: { size: 6, mines: 7, prize: 15000 },
  sulit: { size: 8, mines: 14, prize: 40000 }
}
const COLS = 'ABCDEFGH'
const around = (r, c, n) => {
  const out = []
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if ((dr || dc) && r + dr >= 0 && r + dr < n && c + dc >= 0 && c + dc < n) out.push([r + dr, c + dc])
  return out
}
function plant(st, sr, sc) {
  const n = st.size
  const safe = new Set([`${sr},${sc}`, ...around(sr, sc, n).map(([r, c]) => `${r},${c}`)])
  let cells = []
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (!safe.has(`${r},${c}`)) cells.push([r, c])
  if (cells.length < st.mines) cells = cells.concat([]) // papan kecil: area aman cukup sekadar sel pertama
  if (cells.length < st.mines) { cells = []; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (r !== sr || c !== sc) cells.push([r, c]) }
  for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cells[i], cells[j]] = [cells[j], cells[i]] }
  st.mine = Array.from({ length: n }, () => Array(n).fill(false))
  for (const [r, c] of cells.slice(0, st.mines)) st.mine[r][c] = true
  st.num = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => around(r, c, n).filter(([a, b]) => st.mine[a][b]).length))
  st.planted = true
}
function open(st, r, c) {
  const stack = [[r, c]]
  while (stack.length) {
    const [y, x] = stack.pop()
    if (st.open[y][x] || st.flag[y][x]) continue
    st.open[y][x] = true
    if (st.num[y][x] === 0 && !st.mine[y][x]) for (const p of around(y, x, st.size)) stack.push(p)
  }
}
function render(st, reveal = false) {
  const n = st.size
  const head = `   ${COLS.slice(0, n).split('').join(' ')}`
  const rows = []
  for (let r = 0; r < n; r++) {
    let line = `${r + 1}  `
    for (let c = 0; c < n; c++) {
      let ch
      if (reveal && st.mine[r][c]) ch = st.open[r][c] ? '✹' : st.flag[r][c] ? '⚑' : '●'
      else if (st.open[r][c]) ch = st.num[r][c] ? String(st.num[r][c]) : '·'
      else ch = st.flag[r][c] ? '⚑' : '■'
      line += `${ch} `
    }
    rows.push(line.trimEnd())
  }
  return ['```', head, ...rows, '```'].join('\n')
}
const won = (st) => st.planted && st.open.flat().filter(Boolean).length === st.size * st.size - st.mines
function parseCell(s, n) {
  const m = String(s || '').toUpperCase().match(/^([A-H])(\d)$/) || String(s || '').toUpperCase().match(/^(\d)([A-H])$/)
  if (!m) return null
  const col = /[A-H]/.test(m[1]) ? m[1] : m[2]
  const row = Number(/\d/.test(m[1]) ? m[1] : m[2]) - 1
  const c = COLS.indexOf(col)
  return c >= 0 && c < n && row >= 0 && row < n ? [row, c] : null
}

module.exports = {
  name: 'minesweeper',
  command: ['ms', 'minesweeper', 'ranjau'],
  category: 'game',
  emoji: '💣',
  desc: 'Minesweeper: buka kotak aman, hindari ranjau',
  usage: '[mudah|sedang|sulit] | buka <B3> | bendera <B3> | stop',
  run: async ({ from, sender, args, prefix, reply }) => {
    const a = (args[0] || '').toLowerCase()
    let st = S.get(from, sender)

    if (LEVEL[a] || (!st && !a) || a === 'baru') {
      const lv = LEVEL[a] ? a : 'mudah'
      const L = LEVEL[lv]
      st = S.set(from, sender, { level: lv, size: L.size, mines: L.mines, prize: L.prize, planted: false, open: Array.from({ length: L.size }, () => Array(L.size).fill(false)), flag: Array.from({ length: L.size }, () => Array(L.size).fill(false)) })
      return reply(`💣 *MINESWEEPER ${lv.toUpperCase()}* (${L.size}×${L.size}, ${L.mines} ranjau)\n${render(st)}\nBuka kotak: ${prefix}ms buka B3\nPasang bendera: ${prefix}ms bendera B3\nSelesai: ${prefix}ms stop\nHadiah menang: ${rp(L.prize)}\n_Kotak pertama dijamin aman._`)
    }
    if (!st) return reply(`Mulai dulu: ${prefix}ms mudah | sedang | sulit`)
    if (a === 'stop' || a === 'menyerah') { S.del(from, sender); return reply(`🏳️ Menyerah.\n${st.planted ? render(st, true) : ''}`) }

    const act = ['buka', 'open', 'b'].includes(a) ? 'open' : ['bendera', 'flag', 'f'].includes(a) ? 'flag' : parseCell(a, st.size) ? 'open' : null
    const cellArg = act && parseCell(a, st.size) ? a : args[1]
    if (!act) return reply(`${render(st)}\nPerintah: ${prefix}ms buka B3 • ${prefix}ms bendera B3 • ${prefix}ms stop`)
    const cell = parseCell(cellArg, st.size)
    if (!cell) return reply(`Kotak tidak valid. Pakai huruf kolom A-${COLS[st.size - 1]} dan angka baris 1-${st.size}, contoh: ${prefix}ms buka B3`)
    const [r, c] = cell

    if (act === 'flag') {
      if (st.open[r][c]) return reply('Kotak itu sudah terbuka.')
      st.flag[r][c] = !st.flag[r][c]
      return reply(`${render(st)}\n${st.flag[r][c] ? '🚩 Bendera dipasang' : 'Bendera dilepas'} di ${cellArg.toUpperCase()}`)
    }
    if (st.flag[r][c]) return reply('Kotak itu berbendera. Lepas dulu dengan perintah bendera.')
    if (!st.planted) plant(st, r, c)
    if (st.mine[r][c]) {
      st.open[r][c] = true
      S.del(from, sender)
      return reply(`💥 *BOOM!* Kamu menginjak ranjau di ${cellArg.toUpperCase()}.\n${render(st, true)}\nCoba lagi: ${prefix}ms ${st.level}`)
    }
    open(st, r, c)
    if (won(st)) {
      S.del(from, sender)
      const bal = reward(sender, st.prize)
      return reply(`🎉 *MENANG!* Semua kotak aman terbuka.\n${render(st, true)}\nHadiah: ${rp(st.prize)} (saldo ${rp(bal)})`)
    }
    const flags = st.flag.flat().filter(Boolean).length
    return reply(`${render(st)}\nRanjau tersisa (perkiraan): ${st.mines - flags}`)
  }
}
