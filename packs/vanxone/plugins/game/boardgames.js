// Permainan papan bergambar: Geser Angka (15-puzzle), Othello vs bot, Kapal Perang (solo), Memori Kartu
const kit = require('../../lib/kit')
const io = require('../../lib/imgops')
const sharp = require('sharp')
const { sessions, reward, rp } = require('../../lib/gamesession')

const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })
const rnd = (n) => Math.floor(Math.random() * n)
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]] } return a }

const cache = new Map()
async function glyph(ch, size, color, bold = true) {
  const k = `${ch}|${size}|${color}|${bold}`
  if (!cache.has(k)) {
    const buf = await io.textPng(String(ch), { size, color, bold })
    const m = await io.meta(buf)
    cache.set(k, { buf, w: m.w, h: m.h })
  }
  return cache.get(k)
}
async function put(comps, ch, cx, cy, size, color, bold) {
  const g = await glyph(ch, size, color, bold)
  comps.push({ input: g.buf, left: Math.round(cx - g.w / 2), top: Math.round(cy - g.h / 2) })
}
const svgWrap = (w, h, inner, defs = '') => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>${defs}</defs>${inner}</svg>`)

// ================= GESER ANGKA =================
const GS = sessions()
const gMoves = (b, n = 4) => { const z = b.indexOf(0); const r = (z / n) | 0; const c = z % n; return [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([y, x]) => y >= 0 && x >= 0 && y < n && x < n).map(([y, x]) => y * n + x) }
function newSlide() {
  const b = [...Array(15).keys()].map((x) => x + 1).concat(0)
  let prev = -1
  for (let i = 0; i < 120; i++) { const opts = gMoves(b).filter((x) => x !== prev); const t = opts[rnd(opts.length)]; const z = b.indexOf(0); [b[z], b[t]] = [b[t], b[z]]; prev = z }
  return { b, moves: 0 }
}
const solved = (b) => b.every((v, i) => v === (i + 1) % 16)
async function slideImage(st) {
  const C = 150
  const M = 24
  const S = C * 4 + M * 2
  let shapes = `<rect width="${S}" height="${S}" rx="30" fill="#1d2b55"/>`
  const comps = []
  for (let i = 0; i < 16; i++) {
    const v = st.b[i]
    if (!v) continue
    const x = M + (i % 4) * C
    const y = M + ((i / 4) | 0) * C
    const ok = v === i + 1
    shapes += `<rect x="${x + 6}" y="${y + 6}" width="${C - 12}" height="${C - 12}" rx="22" fill="${ok ? '#3ddc97' : '#4f8cff'}"/>`
    await put(comps, v, x + C / 2, y + C / 2, 66, '#ffffff', true)
  }
  return sharp(svgWrap(S, S, shapes)).composite(comps).png().toBuffer()
}
async function slideRun(c) {
  let st = GS.get(c.from, c.sender)
  const nums = c.args.map(Number).filter((n) => Number.isInteger(n))
  if (nums.length && st) {
    let moved = 0
    for (const n of nums) {
      const i = st.b.indexOf(n)
      if (n < 1 || n > 15 || i < 0) throw bad(`Angka ${n} tidak ada. Pilih 1-15.`)
      const z = st.b.indexOf(0)
      if (!gMoves(st.b).includes(i)) { if (moved) break; throw bad(`Ubin ${n} tidak menempel pada kotak kosong. Geser ubin yang bersebelahan dengan kotak kosong.`) }
      ;[st.b[i], st.b[z]] = [st.b[z], st.b[i]]
      st.moves++
      moved++
    }
    if (solved(st.b)) {
      GS.del(c.from, c.sender)
      const prize = Math.max(500, 4000 - st.moves * 15)
      reward(c.sender, prize)
      await c.sock.sendMessage(c.from, { image: await slideImage(st), caption: `🎉 *SELESAI!* dalam ${st.moves} langkah.\nHadiah ${rp(prize)} (makin sedikit langkah, makin besar).` }, { quoted: c.msg })
      return null
    }
    return { image: await slideImage(st), caption: `🔢 Langkah ${st.moves} • tersusun benar ${st.b.filter((v, i) => v === i + 1).length}/15\nGeser: ${c.prefix}geser <angka> (boleh beberapa: ${c.prefix}geser 7 8 12)` }
  }
  if (/^(menyerah|stop)$/i.test(c.args[0] || '')) { GS.del(c.from, c.sender); return '🏳️ Permainan geser angka dihentikan.' }
  st = newSlide()
  GS.set(c.from, c.sender, st)
  return { image: await slideImage(st), caption: `🔢 *GESER ANGKA* — urutkan 1 sampai 15, kotak kosong di pojok kanan bawah.\nGeser ubin yang menempel kotak kosong: *${c.prefix}geser <angka>*\nContoh: ${c.prefix}geser 7 8 12 (beberapa sekaligus) • menyerah: ${c.prefix}geser menyerah` }
}

// ================= OTHELLO =================
const OS = sessions()
const DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
const WGT = [[120, -20, 20, 5, 5, 20, -20, 120], [-20, -40, -5, -5, -5, -5, -40, -20], [20, -5, 15, 3, 3, 15, -5, 20], [5, -5, 3, 3, 3, 3, -5, 5], [5, -5, 3, 3, 3, 3, -5, 5], [20, -5, 15, 3, 3, 15, -5, 20], [-20, -40, -5, -5, -5, -5, -40, -20], [120, -20, 20, 5, 5, 20, -20, 120]]
const newOth = () => { const b = Array.from({ length: 8 }, () => new Array(8).fill(0)); b[3][3] = 2; b[4][4] = 2; b[3][4] = 1; b[4][3] = 1; return { b, turn: 1, last: null } }
function flips(b, r, c, p) {
  if (b[r][c]) return []
  const out = []
  for (const [dr, dc] of DIRS) {
    const line = []
    let y = r + dr
    let x = c + dc
    while (y >= 0 && x >= 0 && y < 8 && x < 8 && b[y][x] === 3 - p) { line.push([y, x]); y += dr; x += dc }
    if (line.length && y >= 0 && x >= 0 && y < 8 && x < 8 && b[y][x] === p) out.push(...line)
  }
  return out
}
const legal = (b, p) => { const m = []; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const f = flips(b, r, c, p); if (f.length) m.push({ r, c, f }) } return m }
const place = (b, mv, p) => { const nb = b.map((row) => [...row]); nb[mv.r][mv.c] = p; mv.f.forEach(([y, x]) => { nb[y][x] = p }); return nb }
const evalB = (b, p) => { let s = 0; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { if (b[r][c] === p) s += WGT[r][c]; else if (b[r][c]) s -= WGT[r][c] } return s + (legal(b, p).length - legal(b, 3 - p).length) * 4 }
function botMove(b) {
  const ms = legal(b, 2)
  if (!ms.length) return null
  let best = null
  let bs = -Infinity
  for (const m of ms) {
    const nb = place(b, m, 2)
    const replies = legal(nb, 1)
    let worst = replies.length ? Infinity : evalB(nb, 2) + 50
    for (const rp1 of replies) worst = Math.min(worst, evalB(place(nb, rp1, 1), 2))
    const sc = worst + Math.random() * 3
    if (sc > bs) { bs = sc; best = m }
  }
  return best
}
const count = (b) => { let a = 0; let w = 0; b.forEach((r) => r.forEach((v) => { if (v === 1) a++; else if (v === 2) w++ })); return [a, w] }
async function othImage(st, showHints = true) {
  const C = 90
  const M = 56
  const S = C * 8 + M * 2
  let shapes = `<rect width="${S}" height="${S}" rx="26" fill="#0b3d2e"/><rect x="${M}" y="${M}" width="${C * 8}" height="${C * 8}" fill="#12805c"/>`
  for (let i = 0; i <= 8; i++) shapes += `<line x1="${M + i * C}" y1="${M}" x2="${M + i * C}" y2="${M + 8 * C}" stroke="#0b3d2e" stroke-width="2.5"/><line x1="${M}" y1="${M + i * C}" x2="${M + 8 * C}" y2="${M + i * C}" stroke="#0b3d2e" stroke-width="2.5"/>`
  const hints = showHints ? legal(st.b, 1) : []
  for (const h of hints) shapes += `<circle cx="${M + h.c * C + C / 2}" cy="${M + h.r * C + C / 2}" r="9" fill="#ffffff" fill-opacity="0.55"/>`
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const v = st.b[r][c]
    if (!v) continue
    const cx = M + c * C + C / 2
    const cy = M + r * C + C / 2
    shapes += `<circle cx="${cx + 2}" cy="${cy + 4}" r="34" fill="#000" fill-opacity="0.35"/><circle cx="${cx}" cy="${cy}" r="34" fill="${v === 1 ? '#161616' : '#f4f4f4'}" stroke="${v === 1 ? '#444' : '#bbb'}" stroke-width="2"/>`
  }
  if (st.last) shapes += `<rect x="${M + st.last[1] * C + 4}" y="${M + st.last[0] * C + 4}" width="${C - 8}" height="${C - 8}" fill="none" stroke="#ffd166" stroke-width="5" rx="8"/>`
  const comps = []
  for (let i = 0; i < 8; i++) {
    await put(comps, 'abcdefgh'[i], M + i * C + C / 2, M / 2, 30, '#cfeee1', false)
    await put(comps, i + 1, M / 2, M + i * C + C / 2, 30, '#cfeee1', false)
  }
  return sharp(svgWrap(S, S, shapes)).composite(comps).png().toBuffer()
}
async function othRun(c) {
  let st = OS.get(c.from, c.sender)
  const a = (c.args[0] || '').toLowerCase()
  if (a === 'menyerah') { OS.del(c.from, c.sender); return '🏳️ Kamu menyerah. Bot menang kali ini!' }
  const mv = a.match(/^([a-h])([1-8])$/)
  if (!mv) {
    st = newOth()
    OS.set(c.from, c.sender, st)
    return { image: await othImage(st), caption: `⚫⚪ *OTHELLO* — kamu ⚫ hitam jalan duluan, bot ⚪ putih.\nTitik putih = langkah yang boleh.\nJalan: *${c.prefix}othello d3* (huruf = kolom, angka = baris)\nPass bila tak ada langkah: ${c.prefix}othello pass • menyerah: ${c.prefix}othello menyerah` }
  }
  if (!st) throw bad(`Belum ada permainan. Mulai dengan ${c.prefix}othello`)
  const r = Number(mv[2]) - 1
  const col = 'abcdefgh'.indexOf(mv[1])
  const f = flips(st.b, r, col, 1)
  if (!f.length) throw bad('Langkah itu tidak boleh. Pilih salah satu titik putih di papan.')
  st.b = place(st.b, { r, c: col, f }, 1)
  st.last = [r, col]
  let note = `Kamu: ${mv[1]}${r + 1} (membalik ${f.length})`
  // giliran bot (bisa beruntun kalau pemain tidak punya langkah)
  for (let guard = 0; guard < 64; guard++) {
    const bm = botMove(st.b)
    if (bm) { st.b = place(st.b, bm, 2); st.last = [bm.r, bm.c]; note += `\nBot: ${'abcdefgh'[bm.c]}${bm.r + 1} (membalik ${bm.f.length})` }
    if (legal(st.b, 1).length) break
    if (!bm) break
    note += '\n(Kamu tidak punya langkah, bot jalan lagi)'
  }
  if (!legal(st.b, 1).length && !legal(st.b, 2).length) {
    OS.del(c.from, c.sender)
    const [h, w] = count(st.b)
    const prize = h > w ? 3000 : h === w ? 1000 : 0
    if (prize) reward(c.sender, prize)
    return { image: await othImage(st, false), caption: `🏁 *SELESAI* — ⚫ ${h} : ${w} ⚪\n${h > w ? `🎉 Kamu menang! Hadiah ${rp(prize)}` : h === w ? `🤝 Seri! Hadiah ${rp(prize)}` : '🤖 Bot menang. Coba lagi!'}` }
  }
  const [h, w] = count(st.b)
  return { image: await othImage(st), caption: `${note}\n\n⚫ ${h} : ${w} ⚪` }
}

// ================= KAPAL PERANG =================
const KS = sessions()
const SHIPS = [4, 3, 3, 2, 2]
function newFleet() {
  const g = new Array(64).fill(0)
  const ships = []
  for (const len of SHIPS) {
    for (;;) {
      const h = rnd(2) === 0
      const r = rnd(h ? 8 : 9 - len)
      const c = rnd(h ? 9 - len : 8)
      const cells = Array.from({ length: len }, (_, i) => (h ? r * 8 + c + i : (r + i) * 8 + c))
      if (cells.some((x) => g[x])) continue
      cells.forEach((x) => { g[x] = ships.length + 1 })
      ships.push({ len, cells, hit: new Set() })
      break
    }
  }
  return { g, ships, shot: new Set(), shots: 0, max: 30 }
}
async function kapalImage(st, reveal = false) {
  const C = 84
  const M = 56
  const S = C * 8 + M * 2
  let shapes = `<rect width="${S}" height="${S}" rx="26" fill="#0a2a4a"/><rect x="${M}" y="${M}" width="${C * 8}" height="${C * 8}" fill="#124a7a"/>`
  for (let i = 0; i <= 8; i++) shapes += `<line x1="${M + i * C}" y1="${M}" x2="${M + i * C}" y2="${M + 8 * C}" stroke="#0a2a4a" stroke-width="2"/><line x1="${M}" y1="${M + i * C}" x2="${M + 8 * C}" y2="${M + i * C}" stroke="#0a2a4a" stroke-width="2"/>`
  for (let i = 0; i < 64; i++) {
    const x = M + (i % 8) * C
    const y = M + ((i / 8) | 0) * C
    const hit = st.shot.has(i) && st.g[i]
    if (reveal && st.g[i] && !hit) shapes += `<rect x="${x + 8}" y="${y + 8}" width="${C - 16}" height="${C - 16}" rx="10" fill="#9aa7b8" fill-opacity="0.8"/>`
    if (hit) {
      const ship = st.ships[st.g[i] - 1]
      const sunk = ship.hit.size === ship.len
      shapes += `<rect x="${x + 6}" y="${y + 6}" width="${C - 12}" height="${C - 12}" rx="10" fill="${sunk ? '#7f1d1d' : '#ef4444'}"/><path d="M${x + 24},${y + 24} L${x + C - 24},${y + C - 24} M${x + C - 24},${y + 24} L${x + 24},${y + C - 24}" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`
    } else if (st.shot.has(i)) shapes += `<circle cx="${x + C / 2}" cy="${y + C / 2}" r="11" fill="#e0f2ff" fill-opacity="0.85"/>`
  }
  const comps = []
  for (let i = 0; i < 8; i++) {
    await put(comps, 'ABCDEFGH'[i], M + i * C + C / 2, M / 2, 28, '#9fc8ee', false)
    await put(comps, i + 1, M / 2, M + i * C + C / 2, 28, '#9fc8ee', false)
  }
  return sharp(svgWrap(S, S, shapes)).composite(comps).png().toBuffer()
}
async function kapalRun(c) {
  let st = KS.get(c.from, c.sender)
  const a = (c.args[0] || '').toLowerCase()
  if (a === 'menyerah') {
    if (!st) throw bad('Belum ada permainan.')
    KS.del(c.from, c.sender)
    return { image: await kapalImage(st, true), caption: '🏳️ Ini posisi semua kapal (abu-abu = belum kena).' }
  }
  const m = a.match(/^([a-h])([1-8])$/)
  if (!m) {
    st = newFleet()
    KS.set(c.from, c.sender, st)
    return { image: await kapalImage(st), caption: `🚢 *KAPAL PERANG* — 5 kapal tersembunyi di papan 8×8 (panjang ${SHIPS.join(', ')}).\nTenggelamkan semuanya dalam ${st.max} tembakan.\nTembak: *${c.prefix}kapal b4* (huruf = kolom, angka = baris)\nMenyerah: ${c.prefix}kapal menyerah` }
  }
  if (!st) throw bad(`Belum ada permainan. Mulai dengan ${c.prefix}kapal`)
  const i = (Number(m[2]) - 1) * 8 + 'abcdefgh'.indexOf(m[1])
  if (st.shot.has(i)) throw bad('Petak itu sudah pernah ditembak.')
  st.shot.add(i)
  st.shots++
  let msg = `💦 ${m[1].toUpperCase()}${m[2]}: meleset`
  if (st.g[i]) {
    const ship = st.ships[st.g[i] - 1]
    ship.hit.add(i)
    msg = ship.hit.size === ship.len ? `💥 ${m[1].toUpperCase()}${m[2]}: KENA — kapal ${ship.len} petak TENGGELAM!` : `🔥 ${m[1].toUpperCase()}${m[2]}: KENA!`
  }
  const left = st.ships.filter((s) => s.hit.size < s.len).length
  if (!left) {
    KS.del(c.from, c.sender)
    const prize = 800 + (st.max - st.shots) * 160
    reward(c.sender, prize)
    return { image: await kapalImage(st), caption: `🎉 *SEMUA KAPAL TENGGELAM* dalam ${st.shots} tembakan!\nHadiah ${rp(prize)}` }
  }
  if (st.shots >= st.max) {
    KS.del(c.from, c.sender)
    return { image: await kapalImage(st, true), caption: `${msg}\n\n⛔ Peluru habis! ${left} kapal lolos. Coba lagi dengan ${c.prefix}kapal` }
  }
  return { image: await kapalImage(st), caption: `${msg}\nPeluru: ${st.max - st.shots} • kapal tersisa: ${left}/${SHIPS.length}` }
}

// ================= MEMORI KARTU =================
const MS = sessions()
const COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#06b6d4', '#6366f1', '#d946ef', '#ec4899', '#84cc16']
function symbol(k, cx, cy, r, fill) {
  switch (k % 8) {
    case 0: return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`
    case 1: return `<rect x="${cx - r * 0.85}" y="${cy - r * 0.85}" width="${r * 1.7}" height="${r * 1.7}" rx="8" fill="${fill}"/>`
    case 2: return `<polygon points="${cx},${cy - r} ${cx + r},${cy + r * 0.8} ${cx - r},${cy + r * 0.8}" fill="${fill}"/>`
    case 3: return `<polygon points="${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}" fill="${fill}"/>`
    case 4: return `<polygon points="${Array.from({ length: 10 }, (_, i) => { const a = (Math.PI * i) / 5 - Math.PI / 2; const rr = i % 2 ? r * 0.42 : r; return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}` }).join(' ')}" fill="${fill}"/>`
    case 5: return `<polygon points="${Array.from({ length: 6 }, (_, i) => { const a = (Math.PI * i) / 3; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}` }).join(' ')}" fill="${fill}"/>`
    case 6: return `<path d="M${cx - r * 0.3},${cy - r} h${r * 0.6} v${r * 0.7} h${r * 0.7} v${r * 0.6} h-${r * 0.7} v${r * 0.7} h-${r * 0.6} v-${r * 0.7} h-${r * 0.7} v-${r * 0.6} h${r * 0.7} z" fill="${fill}"/>`
    default: return `<path d="M${cx},${cy + r * 0.9} C${cx - r * 1.4},${cy - r * 0.2} ${cx - r * 0.6},${cy - r * 1.1} ${cx},${cy - r * 0.35} C${cx + r * 0.6},${cy - r * 1.1} ${cx + r * 1.4},${cy - r * 0.2} ${cx},${cy + r * 0.9} z" fill="${fill}"/>`
  }
}
async function memImage(st, show = []) {
  const C = 170
  const M = 24
  const S = C * 4 + M * 2
  let shapes = `<rect width="${S}" height="${S}" rx="30" fill="#1d1b4b"/>`
  const comps = []
  for (let i = 0; i < 16; i++) {
    const x = M + (i % 4) * C
    const y = M + ((i / 4) | 0) * C
    const open = st.done.has(i) || show.includes(i)
    shapes += `<rect x="${x + 8}" y="${y + 8}" width="${C - 16}" height="${C - 16}" rx="24" fill="${open ? '#ffffff' : '#4338ca'}"/>`
    if (open) {
      const id = st.cards[i]
      shapes += symbol(id, x + C / 2, y + C / 2, 46, COLORS[id])
    } else await put(comps, i + 1, x + C / 2, y + C / 2, 58, '#c7d2fe', true)
  }
  return sharp(svgWrap(S, S, shapes)).composite(comps).png().toBuffer()
}
async function memRun(c) {
  let st = MS.get(c.from, c.sender)
  const nums = c.args.map(Number).filter((n) => Number.isInteger(n))
  if (/^(menyerah|stop)$/i.test(c.args[0] || '')) { MS.del(c.from, c.sender); return '🏳️ Permainan memori dihentikan.' }
  if (nums.length === 2) {
    if (!st) throw bad(`Belum ada permainan. Mulai dengan ${c.prefix}memori`)
    const [a, b] = nums.map((n) => n - 1)
    if (a === b || [a, b].some((x) => x < 0 || x > 15)) throw bad('Pilih dua nomor kartu berbeda antara 1–16.')
    if (st.done.has(a) || st.done.has(b)) throw bad('Salah satu kartu sudah terbuka (pasangannya sudah ketemu).')
    st.tries++
    if (st.cards[a] === st.cards[b]) {
      st.done.add(a); st.done.add(b)
      if (st.done.size === 16) {
        MS.del(c.from, c.sender)
        const prize = st.tries <= 12 ? 2500 : st.tries <= 16 ? 1500 : 800
        reward(c.sender, prize)
        return { image: await memImage(st), caption: `🎉 *SEMUA PASANGAN KETEMU* dalam ${st.tries} percobaan!\nHadiah ${rp(prize)}` }
      }
      return { image: await memImage(st), caption: `✅ Cocok! Pasangan ${st.done.size / 2}/8 • percobaan ${st.tries}` }
    }
    return { image: await memImage(st, [a, b]), caption: `❌ Tidak cocok (kartu ${a + 1} & ${b + 1}). Hafalkan posisinya!\nPercobaan ${st.tries} • pasangan ${st.done.size / 2}/8` }
  }
  st = { cards: shuffle([...Array(8).keys(), ...Array(8).keys()]), done: new Set(), tries: 0 }
  MS.set(c.from, c.sender, st)
  return { image: await memImage(st), caption: `🃏 *MEMORI KARTU* — cari 8 pasang bentuk yang sama.\nBuka dua kartu: *${c.prefix}memori 3 9*\nSedikit percobaan = hadiah besar (≤12 percobaan Rp2.500).` }
}

const specs = {
  geser: { desc: 'Geser Angka (15-puzzle): urutkan 1–15 dengan menggeser ubin, hadiah uang', usage: '[angka ...|menyerah]', optional: true, heavy: true, run: slideRun },
  othello: { desc: 'Othello/Reversi melawan bot (papan 8×8 bergambar), hadiah uang', usage: '[kolomBaris mis. d3|menyerah]', optional: true, heavy: true, run: othRun },
  kapal: { desc: 'Kapal Perang solo: tenggelamkan 5 kapal tersembunyi dengan 30 tembakan', usage: '[kolomBaris mis. b4|menyerah]', optional: true, heavy: true, run: kapalRun },
  memori: { desc: 'Memori Kartu: temukan 8 pasang bentuk, makin sedikit percobaan makin besar hadiah', usage: '[nomor1 nomor2|menyerah]', optional: true, heavy: true, run: memRun }
}

module.exports = kit.multi({ name: 'boardgames', category: 'game', emoji: '♟️', desc: 'Geser angka, Othello, Kapal Perang, Memori kartu', specs, alias: { oth: 'othello', reversi: 'othello', battleship: 'kapal', slide: 'geser' } })
