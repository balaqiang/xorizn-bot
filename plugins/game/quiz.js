// Game tebak-tebakan ala vanXone: jawab dengan mengetik jawabannya langsung (tanpa prefix)
const kit = require('../../lib/kit')
const sharp = require('sharp')
const Q = require('../../lib/engine/lumen_quiz')
const { panel } = require('../../lib/uitext')
const { rp } = require('../../lib/gamesession')

const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })
const head = (title, body, g) => panel(title, [{ head: '❓ *SOAL*', lines: [body] }, { head: '⏱️ *INFO*', lines: [`Waktu : ${(g.ttl || 60000) / 1000} detik`, `Hadiah : ${rp(g.prize)}`, `Jawab dengan mengetik jawabannya • .hint untuk bantuan • .nyerah menyerah`] }])
const busy = (c) => { if (Q.games.has(c.from)) throw bad(`Masih ada game berjalan: *${Q.games.get(c.from).title}*. Jawab atau ketik ${c.prefix}nyerah.`) }
const hintOf = (s) => String(s).replace(/[A-Za-z0-9]/g, (ch, i) => (i % 3 === 0 ? ch : '_'))

// game teks sederhana
const text = (title, data, mapFn, prize = 3000) => async (c) => {
  busy(c)
  const r = mapFn(Q.pick(Q.load(data)))
  const g = { title, answers: Array.isArray(r.a) ? r.a : [r.a], display: r.show || (Array.isArray(r.a) ? r.a[0] : r.a), prize, question: r.q, kind: 'text' }
  await Q.start(c.sock, c.from, c.msg, g, async () => c.sock.sendMessage(c.from, { text: head(title.toUpperCase(), r.q, g) }, { quoted: c.msg }))
  return null
}
const image = (title, data, mapFn, prize = 4000) => async (c) => {
  busy(c)
  const r = mapFn(Q.pick(Q.load(data)))
  const g = { title, answers: [r.a], display: r.a, prize, question: r.q }
  await Q.start(c.sock, c.from, c.msg, g, async () => {
    const caption = head(title.toUpperCase(), r.q, g)
    try { await c.sock.sendMessage(c.from, { image: { url: r.img }, caption }, { quoted: c.msg }) } catch { await c.sock.sendMessage(c.from, { text: caption + '\n_(gambar gagal dimuat)_' }, { quoted: c.msg }) }
  })
  return null
}
const COLORS = [['merah', '#e53935'], ['biru', '#1e88e5'], ['hijau', '#43a047'], ['kuning', '#fdd835'], ['oranye', '#fb8c00'], ['ungu', '#8e24aa'], ['pink', '#ec407a'], ['coklat', '#6d4c41'], ['abu-abu', '#9e9e9e'], ['hitam', '#212121'], ['putih', '#fafafa'], ['tosca', '#00acc1'], ['emas', '#d4af37'], ['biru muda', '#81d4fa'], ['hijau muda', '#aed581'], ['merah muda', '#f8bbd0']]

const specs = {
  tebakgambar: { desc: 'Tebak gambar rebus/teka-teki visual', run: image('Tebak Gambar', 'tebakgambar', (j) => ({ img: j.img, a: j.jawaban, q: j.deskripsi || 'Tebak maksud gambar ini!' }), 5000) },
  tebakbenda: { desc: 'Tebak benda dari teka-teki', run: text('Tebak Benda', 'tebakbenda', (j) => ({ q: j.question, a: j.answer, show: j.answer[0] })) },
  tebakbuah: { desc: 'Tebak nama buah dari petunjuk', run: text('Tebak Buah', 'tebakbuah', (j) => ({ q: j.soal, a: j.jawaban })) },
  tebaklirik: { desc: 'Lengkapi lirik lagu yang rumpang', run: text('Tebak Lirik', 'tebaklirik', (j) => ({ q: j.soal, a: j.jawaban }), 4000) },
  susunkata: { desc: 'Susun huruf acak jadi kata yang benar', run: text('Susun Kata', 'susunkata', (j) => ({ q: `${j.soal}\nTipe: ${j.tipe}`, a: j.jawaban })) },
  siapakahaku: { desc: 'Tebak "siapakah aku?" dari ciri-ciri', run: text('Siapakah Aku', 'siapakahaku', (j) => ({ q: j.soal, a: j.jawaban })) },
  tebakanml: { desc: 'Tebak-tebakan lucu seputar Mobile Legends', run: text('Tebakan ML', 'tebakanml', (j) => ({ q: j.soal, a: j.jawaban }), 3500) },
  tebakkimia: { desc: 'Tebak lambang unsur kimia dari namanya', run: text('Tebak Kimia', 'tebakkimia', (j) => ({ q: `Apa lambang unsur kimia dari *${j.unsur}*?`, a: j.lambang }), 3000) },
  tebakgame: { desc: 'Tebak nama game dari gambarnya', run: image('Tebak Game', 'tebakgame', (j) => ({ img: j.img, a: j.jawaban, q: 'Game apakah ini?' })) },
  tebaklogo: { desc: 'Tebak merek dari logonya', run: image('Tebak Logo', 'tebaklogo', (j) => ({ img: j.img, a: j.jawaban, q: j.deskripsi || 'Logo apakah ini?' })) },
  tebaklagu: { desc: 'Tebak judul lagu dari potongan audionya', run: async (c) => {
    busy(c); const j = Q.pick(Q.load('tebaklagu'))
    const g = { title: 'Tebak Lagu', answers: [j.judul], display: `${j.judul} — ${j.artis}`, prize: 5000, ttl: 90000, question: 'Dengarkan potongan lagu' }
    await Q.start(c.sock, c.from, c.msg, g, async () => {
      await c.sock.sendMessage(c.from, { text: head('TEBAK LAGU', `Artis: *${j.artis}*\nTebak judul lagunya dari audio berikut!`, g) }, { quoted: c.msg })
      try { await c.sock.sendMessage(c.from, { audio: { url: j.lagu }, mimetype: 'audio/mpeg', ptt: false }, { quoted: c.msg }) } catch { await c.sock.sendMessage(c.from, { text: '⚠️ Audio gagal dimuat.' }) }
    }); return null
  } },
  tebakwarna: { desc: 'Tebak nama warna dari kotak warna', run: async (c) => {
    busy(c); const [name, hex] = Q.pick(COLORS)
    const img = await sharp({ create: { width: 640, height: 360, channels: 3, background: hex } }).png().toBuffer()
    const g = { title: 'Tebak Warna', answers: [name], display: name, prize: 2500, question: 'Warna apakah ini?' }
    await Q.start(c.sock, c.from, c.msg, g, async () => c.sock.sendMessage(c.from, { image: img, caption: head('TEBAK WARNA', 'Warna apakah ini? (Bahasa Indonesia)', g) }, { quoted: c.msg })); return null
  } },
  family100: { desc: 'Family 100: tebak semua jawaban survei (satu per satu)', run: async (c) => {
    busy(c); const j = Q.pick(Q.load('family100'))
    const g = { title: 'Family 100', question: j.soal, answers: j.jawaban, display: j.jawaban.join(', '), prize: 10000, ttl: 180000, family: { all: j.jawaban, found: new Set() } }
    await Q.start(c.sock, c.from, c.msg, g, async () => c.sock.sendMessage(c.from, { text: head('FAMILY 100', `${j.soal}\n\nAda *${j.jawaban.length}* jawaban. Tebak satu per satu!`, g) }, { quoted: c.msg })); return null
  } },
  nyerah: { desc: 'Menyerah dari game tebak-tebakan yang sedang berjalan', run: async (c) => {
    const g = Q.stop(c.from); if (!g) throw bad('Tidak ada game yang sedang berjalan.')
    return `🏳️ Kamu menyerah!\n\n🎮 ${g.title}\n✅ Jawaban: *${g.display}*`
  } },
  hint: { desc: 'Petunjuk untuk game tebak-tebakan yang sedang berjalan', run: async (c) => {
    const g = Q.games.get(c.from); if (!g) throw bad('Tidak ada game yang sedang berjalan.')
    if (g.family) { const left = g.family.all.filter((_, i) => !g.family.found.has(i)); return `💡 Masih ${left.length} jawaban. Salah satunya diawali *${left[0][0].toUpperCase()}* (${left[0].length} huruf).` }
    return `💡 Petunjuk: ${hintOf(g.display)}`
  } }
}
module.exports = kit.multi({ name: 'anya-quiz', category: 'game', emoji: '🧠', desc: 'Tebak gambar/lirik/lagu/logo/warna, susun kata, Family 100, dll', specs, alias: { skip: 'nyerah', surrender: 'nyerah' } })
