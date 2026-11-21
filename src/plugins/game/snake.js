// .snake — game ular bergiliran. Ketik beberapa arah sekaligus, mis. ".snake ddss".
const { sessions, reward, rp } = require('../../lib/gamesession')

const S = sessions()
const N = 8
const VEC = { w: [-1, 0], s: [1, 0], a: [0, -1], d: [0, 1] }
const NAME = { atas: 'w', bawah: 's', kiri: 'a', kanan: 'd' }

function placeApple(st) {
  const taken = new Set(st.body.map(([r, c]) => `${r},${c}`))
  const free = []
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!taken.has(`${r},${c}`)) free.push([r, c])
  st.apple = free.length ? free[Math.floor(Math.random() * free.length)] : null
}
function render(st) {
  const g = Array.from({ length: N }, () => Array(N).fill('⬛'))
  if (st.apple) g[st.apple[0]][st.apple[1]] = '🍎'
  st.body.forEach(([r, c], i) => { g[r][c] = i === 0 ? '🟢' : '🟩' })
  return g.map((r) => r.join('')).join('\n')
}
function parseMoves(args) {
  const raw = args.join('').toLowerCase()
  if (NAME[raw]) return [NAME[raw]]
  if (!/^[wasd]+$/.test(raw)) return null
  return raw.split('').slice(0, 6)
}
function finish(from, sender, st, why) {
  S.del(from, sender)
  const prize = Math.min(60000, st.score * 4000)
  const bal = prize ? reward(sender, prize) : null
  return `${render(st)}\n\n💀 *${why}*\nSkor: *${st.score}* apel • Panjang ular ${st.body.length}${prize ? `\nHadiah: ${rp(prize)} (saldo ${rp(bal)})` : ''}`
}

module.exports = {
  name: 'snake',
  command: ['snake', 'ular'],
  category: 'game',
  emoji: '🐍',
  desc: 'Game ular: makan apel tanpa menabrak dinding atau badan sendiri',
  usage: '[baru] | <w|a|s|d ...> | stop',
  run: async ({ from, sender, args, prefix, reply }) => {
    const first = (args[0] || '').toLowerCase()
    let st = S.get(from, sender)
    if (first === 'stop') {
      if (!st) return reply('Tidak ada game ular yang berjalan.')
      return reply(finish(from, sender, st, 'GAME BERHENTI'))
    }
    if (!st || first === 'baru') {
      st = S.set(from, sender, { body: [[3, 4], [3, 3], [3, 2]], dir: 'd', score: 0, apple: null })
      placeApple(st)
      return reply(`🐍 *SNAKE*\n${render(st)}\n\nArah: w (atas) a (kiri) s (bawah) d (kanan). Bisa banyak langkah sekaligus (maks 6): ${prefix}snake ddss\nHadiah: ${rp(4000)} per apel.`)
    }
    const moves = parseMoves(args)
    if (!moves) return reply(`${render(st)}\n\nGerak: ${prefix}snake w/a/s/d (boleh digabung, mis. ${prefix}snake dds)`)
    let ate = 0
    for (const m of moves) {
      const opp = { w: 's', s: 'w', a: 'd', d: 'a' }[st.dir]
      const dir = m === opp && st.body.length > 1 ? st.dir : m // tidak boleh putar balik
      st.dir = dir
      const [dr, dc] = VEC[dir]
      const head = [st.body[0][0] + dr, st.body[0][1] + dc]
      if (head[0] < 0 || head[0] >= N || head[1] < 0 || head[1] >= N) return reply(finish(from, sender, st, 'MENABRAK DINDING'))
      const grow = st.apple && head[0] === st.apple[0] && head[1] === st.apple[1]
      const tail = grow ? st.body : st.body.slice(0, -1)
      if (tail.some(([r, c]) => r === head[0] && c === head[1])) return reply(finish(from, sender, st, 'MENABRAK BADAN SENDIRI'))
      st.body = [head, ...tail]
      if (grow) { st.score++; ate++; placeApple(st); if (!st.apple) return reply(finish(from, sender, st, 'PAPAN PENUH — KAMU HEBAT!')) }
    }
    return reply(`${render(st)}\n\nSkor: *${st.score}*${ate ? ` (+${ate} 🍎)` : ''} • Panjang ${st.body.length}`)
  }
}
