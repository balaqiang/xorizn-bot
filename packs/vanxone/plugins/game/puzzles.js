// Puzzle bergambar: Sudoku, Labirin (maze), dan Cari Kata — hadiah uang bot
const kit = require('../../lib/kit')
const io = require('../../lib/imgops')
const sharp = require('sharp')
const { sessions, reward, rp } = require('../../lib/gamesession')

const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })
const rnd = (n) => Math.floor(Math.random() * n)
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]] } return a }

// cache potongan teks kecil
const cache = new Map()
async function glyph(ch, size, color, bold = true) {
  const k = `${ch}|${size}|${color}|${bold}`
  if (!cache.has(k)) {
    const buf = await io.textPng(ch, { size, color, bold })
    const m = await io.meta(buf)
    cache.set(k, { buf, w: m.w, h: m.h })
  }
  return cache.get(k)
}
async function putCentered(comps, ch, cx, cy, size, color, bold) {
  const g = await glyph(ch, size, color, bold)
  comps.push({ input: g.buf, left: Math.round(cx - g.w / 2), top: Math.round(cy - g.h / 2) })
}

// ================= SUDOKU =================
const SD = sessions()
function solveCount(g, limit = 2) {
  let count = 0
  const rec = () => {
    let best = -1
    let bestC = null
    for (let i = 0; i < 81; i++) {
      if (g[i]) continue
      const r = (i / 9) | 0
      const c = i % 9
      const used = new Set()
      for (let k = 0; k < 9; k++) { used.add(g[r * 9 + k]); used.add(g[k * 9 + c]) }
      const br = r - (r % 3)
      const bc = c - (c % 3)
      for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) used.add(g[(br + a) * 9 + bc + b])
      const cand = []
      for (let n = 1; n <= 9; n++) if (!used.has(n)) cand.push(n)
      if (!bestC || cand.length < bestC.length) { best = i; bestC = cand; if (cand.length <= 1) break }
    }
    if (best < 0) { count++; return count >= limit }
    for (const n of bestC) { g[best] = n; if (rec()) { g[best] = 0; return true } }
    g[best] = 0
    return false
  }
  rec()
  return count
}
function fullGrid() {
  const g = new Array(81).fill(0)
  const rec = (i) => {
    if (i === 81) return true
    const r = (i / 9) | 0
    const c = i % 9
    for (const n of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
      let ok = true
      for (let k = 0; k < 9 && ok; k++) if (g[r * 9 + k] === n || g[k * 9 + c] === n) ok = false
      const br = r - (r % 3)
      const bc = c - (c % 3)
      for (let a = 0; a < 3 && ok; a++) for (let b = 0; b < 3; b++) if (g[(br + a) * 9 + bc + b] === n) { ok = false; break }
      if (!ok) continue
      g[i] = n
      if (rec(i + 1)) return true
    }
    g[i] = 0
    return false
  }
  rec(0)
  return g
}
const LEVELS = { mudah: { clues: 40, prize: 1500 }, sedang: { clues: 32, prize: 2500 }, sulit: { clues: 26, prize: 4000 } }
function makeSudoku(level) {
  const sol = fullGrid()
  const puz = [...sol]
  const target = 81 - LEVELS[level].clues
  let removed = 0
  for (const i of shuffle([...Array(81).keys()])) {
    if (removed >= target) break
    const keep = puz[i]
    puz[i] = 0
    if (solveCount([...puz]) !== 1) puz[i] = keep
    else removed++
  }
  return { sol, puz, cur: [...puz], level }
}
async function sudokuImage(st, { wrong = [], reveal = false } = {}) {
  const C = 100
  const M = 60
  const S = C * 9 + M * 2
  let lines = ''
  for (let i = 0; i <= 9; i++) {
    const w = i % 3 === 0 ? 5 : 1.5
    lines += `<line x1="${M + i * C}" y1="${M}" x2="${M + i * C}" y2="${M + 9 * C}" stroke="#1d2b55" stroke-width="${w}"/><line x1="${M}" y1="${M + i * C}" x2="${M + 9 * C}" y2="${M + i * C}" stroke="#1d2b55" stroke-width="${w}"/>`
  }
  let fills = ''
  for (let b = 0; b < 9; b++) if ((((b / 3) | 0) + (b % 3)) % 2 === 0) fills += `<rect x="${M + (b % 3) * 3 * C}" y="${M + ((b / 3) | 0) * 3 * C}" width="${C * 3}" height="${C * 3}" fill="#eef2ff"/>`
  for (const i of wrong) fills += `<rect x="${M + (i % 9) * C}" y="${M + ((i / 9) | 0) * C}" width="${C}" height="${C}" fill="#ffd6d6"/>`
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><rect width="${S}" height="${S}" fill="#ffffff"/>${fills}${lines}<rect x="${M}" y="${M}" width="${C * 9}" height="${C * 9}" fill="none" stroke="#1d2b55" stroke-width="7" rx="4"/></svg>`)
  const comps = []
  for (let k = 0; k < 9; k++) {
    await putCentered(comps, String(k + 1), M + k * C + C / 2, M / 2, 30, '#6b7aa8', false)
    await putCentered(comps, String(k + 1), M / 2, M + k * C + C / 2, 30, '#6b7aa8', false)
  }
  for (let i = 0; i < 81; i++) {
    const v = reveal ? st.sol[i] : st.cur[i]
    if (!v) continue
    const given = st.puz[i] !== 0
    const color = wrong.includes(i) ? '#d11a2a' : given ? '#111827' : reveal ? '#2e7d32' : '#2563eb'
    await putCentered(comps, String(v), M + (i % 9) * C + C / 2, M + ((i / 9) | 0) * C + C / 2, 62, color, given)
  }
  return sharp(svg).composite(comps).png().toBuffer()
}
const filled = (st) => st.cur.filter(Boolean).length
async function sudokuRun(c) {
  const a = c.args.map((x) => x.toLowerCase())
  let st = SD.get(c.from, c.sender)
  const nums = a.filter((x) => /^\d$/.test(x))
  if (nums.length === 3 && a.length === 3) {
    if (!st) throw bad(`Belum ada permainan. Mulai dengan ${c.prefix}sudoku [mudah|sedang|sulit]`)
    const [r, col, n] = nums.map(Number)
    if (!r || !col) throw bad('Baris dan kolom 1-9. Contoh: .sdk 3 4 7 (angka 0 untuk menghapus)')
    const i = (r - 1) * 9 + (col - 1)
    if (st.puz[i]) throw bad('Kotak itu angka bawaan, tidak bisa diubah.')
    st.cur[i] = n
    if (st.cur.every((v, k) => v === st.sol[k])) {
      SD.del(c.from, c.sender)
      const prize = LEVELS[st.level].prize
      reward(c.sender, prize)
      await c.sock.sendMessage(c.from, { image: await sudokuImage(st), caption: `🎉 *SUDOKU SELESAI!* (${st.level})\nHadiah ${rp(prize)} masuk ke dompetmu.` }, { quoted: c.msg })
      return null
    }
    return { image: await sudokuImage(st), caption: `✏️ Baris ${r}, kolom ${col} = ${n || 'kosong'}\nTerisi ${filled(st)}/81 • .sudoku cek • .sudoku petunjuk` }
  }
  const sub = a[0]
  if (sub === 'cek') {
    if (!st) throw bad('Belum ada permainan.')
    const wrong = st.cur.map((v, i) => (v && v !== st.sol[i] ? i : -1)).filter((i) => i >= 0)
    return { image: await sudokuImage(st, { wrong }), caption: wrong.length ? `❌ ${wrong.length} kotak salah (merah).` : `✅ Semua isianmu benar sejauh ini! Terisi ${filled(st)}/81` }
  }
  if (sub === 'petunjuk' || sub === 'hint') {
    if (!st) throw bad('Belum ada permainan.')
    const empt = st.cur.map((v, i) => (v !== st.sol[i] ? i : -1)).filter((i) => i >= 0)
    if (!empt.length) throw bad('Sudah penuh.')
    const i = empt[rnd(empt.length)]
    st.cur[i] = st.sol[i]
    st.puz[i] = st.sol[i]
    return { image: await sudokuImage(st), caption: `💡 Petunjuk: baris ${((i / 9) | 0) + 1}, kolom ${(i % 9) + 1} = ${st.sol[i]}` }
  }
  if (sub === 'menyerah' || sub === 'kunci') {
    if (!st) throw bad('Belum ada permainan.')
    SD.del(c.from, c.sender)
    return { image: await sudokuImage(st, { reveal: true }), caption: '🏳️ Ini kunci jawabannya (hijau = jawaban).' }
  }
  const level = LEVELS[sub] ? sub : 'sedang'
  if (sub && !LEVELS[sub]) throw bad(`Tingkat: mudah, sedang, sulit.\nIsi kotak: ${c.prefix}sdk <baris> <kolom> <angka>`)
  st = makeSudoku(level)
  SD.set(c.from, c.sender, st)
  return { image: await sudokuImage(st), caption: `🧩 *SUDOKU ${level.toUpperCase()}* • hadiah ${rp(LEVELS[level].prize)}\n\nIsi kotak: *${c.prefix}sdk <baris> <kolom> <angka>*\nContoh: ${c.prefix}sdk 3 4 7  (angka 0 = hapus)\n${c.prefix}sudoku cek • petunjuk • menyerah` }
}

// ================= LABIRIN =================
const MZ = sessions()
const MAZE = { kecil: 12, sedang: 20, besar: 30 }
function genMaze(n) {
  const cells = Array.from({ length: n * n }, () => ({ r: true, d: true, l: true, u: true, seen: false }))
  const at = (x, y) => cells[y * n + x]
  const stack = [[0, 0]]
  at(0, 0).seen = true
  while (stack.length) {
    const [x, y] = stack[stack.length - 1]
    const nb = [[1, 0, 'r', 'l'], [-1, 0, 'l', 'r'], [0, 1, 'd', 'u'], [0, -1, 'u', 'd']].filter(([dx, dy]) => x + dx >= 0 && y + dy >= 0 && x + dx < n && y + dy < n && !at(x + dx, y + dy).seen)
    if (!nb.length) { stack.pop(); continue }
    const [dx, dy, a, b] = nb[rnd(nb.length)]
    at(x, y)[a] = false
    at(x + dx, y + dy)[b] = false
    at(x + dx, y + dy).seen = true
    stack.push([x + dx, y + dy])
  }
  return cells
}
function solveMaze(cells, n) {
  const prev = new Array(n * n).fill(-1)
  const q = [0]
  prev[0] = 0
  while (q.length) {
    const i = q.shift()
    if (i === n * n - 1) break
    const x = i % n
    const y = (i / n) | 0
    const c = cells[i]
    const nbs = [[!c.r, x + 1, y], [!c.l, x - 1, y], [!c.d, x, y + 1], [!c.u, x, y - 1]]
    for (const [open, nx, ny] of nbs) if (open) { const j = ny * n + nx; if (prev[j] < 0) { prev[j] = i; q.push(j) } }
  }
  const path = []
  for (let i = n * n - 1; ; i = prev[i]) { path.push(i); if (i === 0) break }
  return path.reverse()
}
async function mazeImage(cells, n, path) {
  const M = 40
  const cs = Math.floor(1000 / n)
  const S = cs * n + M * 2
  let walls = ''
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const c = cells[y * n + x]
    const px = M + x * cs
    const py = M + y * cs
    if (c.r) walls += `M${px + cs},${py}V${py + cs}`
    if (c.d) walls += `M${px},${py + cs}H${px + cs}`
    if (c.l && x === 0 && y !== 0) walls += `M${px},${py}V${py + cs}`
    if (c.u && y === 0 && x !== 0) walls += `M${px},${py}H${px + cs}`
  }
  const ctr = (i) => `${M + (i % n) * cs + cs / 2},${M + ((i / n) | 0) * cs + cs / 2}`
  const route = path ? `<polyline points="${path.map(ctr).join(' ')}" fill="none" stroke="#ef4444" stroke-width="${Math.max(4, cs * 0.28)}" stroke-linejoin="round" stroke-linecap="round" stroke-opacity="0.85"/>` : ''
  const e = (i) => ctr(i).split(',')
  const [sx, sy] = e(0)
  const [ex, ey] = e(n * n - 1)
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffdf5"/><stop offset="1" stop-color="#f1f5ff"/></linearGradient></defs><rect width="${S}" height="${S}" fill="url(#g)"/>${route}<path d="${walls}" stroke="#1d2b55" stroke-width="${Math.max(3, cs * 0.12)}" stroke-linecap="round" fill="none"/><circle cx="${sx}" cy="${sy}" r="${cs * 0.3}" fill="#22c55e"/><circle cx="${ex}" cy="${ey}" r="${cs * 0.3}" fill="#f59e0b"/></svg>`)
  return sharp(svg).png().toBuffer()
}
async function mazeRun(c) {
  const a = (c.args[0] || '').toLowerCase()
  const st = MZ.get(c.from, c.sender)
  if (a === 'solusi' || a === 'jawab' || a === 'kunci') {
    if (!st) throw bad('Belum ada labirin. Buat dulu dengan .maze')
    return { image: await mazeImage(st.cells, st.n, st.path), caption: '🔴 Jalur solusi dari 🟢 ke 🟠' }
  }
  const size = MAZE[a] ? a : 'sedang'
  if (a && !MAZE[a]) throw bad('Ukuran: kecil, sedang, besar.\nLihat solusi: .maze solusi')
  const n = MAZE[size]
  const cells = genMaze(n)
  const path = solveMaze(cells, n)
  MZ.set(c.from, c.sender, { cells, n, path })
  return { image: await mazeImage(cells, n), caption: `🧭 *LABIRIN ${size.toUpperCase()}* (${n}×${n})\nCari jalan dari 🟢 (kiri-atas) ke 🟠 (kanan-bawah).\nSolusi: *${c.prefix}maze solusi* • ukuran lain: kecil/sedang/besar` }
}

// ================= CARI KATA =================
const WS = sessions()
const THEMES = {
  hewan: 'KUCING ANJING HARIMAU GAJAH JERAPAH KELINCI BURUNG MONYET BUAYA KUDA SAPI KAMBING ZEBRA SINGA PENYU LUMBA TUPAI ULAR ELANG BADAK'.split(' '),
  buah: 'APEL JERUK MANGGA PISANG ANGGUR SEMANGKA NANAS DURIAN RAMBUTAN SALAK PEPAYA JAMBU MELON LEMON STROBERI MANGGIS KELAPA'.split(' '),
  negara: 'INDONESIA JEPANG KOREA MESIR BRAZIL INDIA CHINA PERANCIS ITALIA SPANYOL MALAYSIA THAILAND KANADA TURKI INGGRIS JERMAN'.split(' '),
  kota: 'JAKARTA BANDUNG SURABAYA MEDAN SEMARANG MAKASSAR MALANG BOGOR YOGYAKARTA DENPASAR PALEMBANG PONTIANAK MANADO PADANG'.split(' '),
  profesi: 'DOKTER GURU POLISI PETANI NELAYAN PILOT KOKI ARSITEK DOSEN PERAWAT PENULIS SENIMAN SUPIR PENGACARA TENTARA'.split(' '),
  warna: 'MERAH BIRU HIJAU KUNING UNGU JINGGA COKLAT HITAM PUTIH ABU PINK EMAS PERAK TOSCA'.split(' ')
}
const DIRS8 = [[1, 0], [0, 1], [1, 1], [-1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1]]
function makeSearch(theme) {
  const N = 15
  const words = shuffle([...THEMES[theme]]).slice(0, 10)
  words.sort((a, b) => b.length - a.length)
  const g = new Array(N * N).fill('')
  const placed = []
  for (const w of words) {
    for (let t = 0; t < 300; t++) {
      const [dx, dy] = DIRS8[rnd(8)]
      const x = rnd(N)
      const y = rnd(N)
      const ex = x + dx * (w.length - 1)
      const ey = y + dy * (w.length - 1)
      if (ex < 0 || ey < 0 || ex >= N || ey >= N) continue
      let ok = true
      for (let k = 0; k < w.length; k++) { const cell = g[(y + dy * k) * N + x + dx * k]; if (cell && cell !== w[k]) { ok = false; break } }
      if (!ok) continue
      for (let k = 0; k < w.length; k++) g[(y + dy * k) * N + x + dx * k] = w[k]
      placed.push({ w, x, y, ex, ey })
      break
    }
  }
  const letters = 'AAAEEIINNOURSTKLMDGBHPCJWY'
  for (let i = 0; i < g.length; i++) if (!g[i]) g[i] = letters[rnd(letters.length)]
  return { N, g, placed, found: new Set(), theme }
}
const HL = ['#4f8cff', '#ff6b8a', '#ffb347', '#3ddc97', '#b388ff', '#2ec4d6', '#ff8c5a', '#c6e04b', '#f06ede', '#7d8cff']
async function searchImage(st, showAll = false) {
  const C = 64
  const M = 30
  const S = C * st.N + M * 2
  let hl = ''
  st.placed.forEach((p, i) => {
    if (!showAll && !st.found.has(p.w)) return
    const x1 = M + p.x * C + C / 2
    const y1 = M + p.y * C + C / 2
    const x2 = M + p.ex * C + C / 2
    const y2 = M + p.ey * C + C / 2
    hl += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${HL[i % HL.length]}" stroke-width="${C * 0.78}" stroke-linecap="round" stroke-opacity="0.5"/>`
  })
  let grid = ''
  for (let i = 0; i <= st.N; i++) grid += `<line x1="${M + i * C}" y1="${M}" x2="${M + i * C}" y2="${M + st.N * C}" stroke="#e3e8f7"/><line x1="${M}" y1="${M + i * C}" x2="${M + st.N * C}" y2="${M + i * C}" stroke="#e3e8f7"/>`
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><rect width="${S}" height="${S}" fill="#ffffff"/>${grid}${hl}<rect x="${M}" y="${M}" width="${C * st.N}" height="${C * st.N}" fill="none" stroke="#1d2b55" stroke-width="4" rx="6"/></svg>`)
  const comps = []
  for (let i = 0; i < st.g.length; i++) await putCentered(comps, st.g[i], M + (i % st.N) * C + C / 2, M + ((i / st.N) | 0) * C + C / 2, 38, '#1d2b55', true)
  return sharp(svg).composite(comps).png().toBuffer()
}
const wordList = (st) => st.placed.map((p) => (st.found.has(p.w) ? `✅ ~${p.w}~` : `⬜ ${p.w}`)).join('\n')
async function searchRun(c) {
  const a = (c.args[0] || '').toLowerCase()
  const st = WS.get(c.from, c.sender)
  if (a === 'menyerah' || a === 'jawab' || a === 'kunci') {
    if (!st) throw bad('Belum ada permainan. Mulai dengan .carikata')
    WS.del(c.from, c.sender)
    return { image: await searchImage(st, true), caption: `🏳️ Jawaban lengkap:\n${st.placed.map((p) => p.w).join(', ')}` }
  }
  if (a && !THEMES[a]) throw bad(`Tema: ${Object.keys(THEMES).join(', ')}\nContoh: ${c.prefix}carikata hewan`)
  const theme = a || Object.keys(THEMES)[rnd(Object.keys(THEMES).length)]
  const ns = makeSearch(theme)
  WS.set(c.from, c.sender, ns)
  return { image: await searchImage(ns), caption: `🔎 *CARI KATA — ${theme.toUpperCase()}*\nKata bisa mendatar, menurun, atau diagonal (juga terbalik).\n\n${wordList(ns)}\n\nTemukan: *${c.prefix}temu <kata>* • menyerah: ${c.prefix}carikata menyerah` }
}
async function temuRun(c) {
  const st = WS.get(c.from, c.sender)
  if (!st) throw bad('Belum ada permainan. Mulai dengan .carikata')
  const w = (c.args[0] || '').toUpperCase()
  if (!w) throw bad('Tulis kata yang kamu temukan. Contoh: .temu KUCING')
  const p = st.placed.find((x) => x.w === w)
  if (!p) return `❌ "${w}" bukan salah satu kata yang dicari.`
  if (st.found.has(w)) return `Kata ${w} sudah ditemukan.`
  st.found.add(w)
  reward(c.sender, 300)
  if (st.found.size === st.placed.length) {
    WS.del(c.from, c.sender)
    reward(c.sender, 2000)
    return { image: await searchImage(st), caption: `🎉 *SEMUA KATA DITEMUKAN!*\nTotal hadiah ${rp(300 * st.placed.length + 2000)}.` }
  }
  return { image: await searchImage(st), caption: `✅ ${w} ketemu! +${rp(300)}\nSisa ${st.placed.length - st.found.size} kata.\n\n${wordList(st)}` }
}

const specs = {
  sudoku: { desc: 'Sudoku bergambar 3 tingkat (hadiah uang). Isi kotak: .sdk <baris> <kolom> <angka>', usage: '[mudah|sedang|sulit|cek|petunjuk|menyerah]', optional: true, heavy: true, run: sudokuRun },
  maze: { desc: 'Labirin acak bergambar (kecil/sedang/besar) + solusi', usage: '[kecil|sedang|besar|solusi]', heavy: true, run: mazeRun },
  carikata: { desc: 'Cari kata tersembunyi di kotak huruf, tema hewan/buah/negara/kota/profesi/warna (hadiah uang)', usage: '[tema|menyerah]', heavy: true, run: searchRun },
  temu: { desc: 'Tandai kata yang kamu temukan di permainan Cari Kata', usage: '<kata>', example: 'KUCING', args: true, heavy: true, run: temuRun }
}

module.exports = kit.multi({ name: 'puzzles', category: 'game', emoji: '🧩', desc: 'Sudoku, labirin, dan cari kata bergambar', specs, alias: { sdk: 'sudoku', labirin: 'maze' } })
