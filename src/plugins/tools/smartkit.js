// Teks & kalkulator pintar: statistik teks, ringkasan, rapikan, slug, jam dunia, simulasi investasi
const vm = require('vm')
const kit = require('../../lib/kit')
const { panel, rp, num, parseMoney } = require('../../lib/uitext')
const { getQuotedText } = require('../../lib/utils')

const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })
const body = (c) => kit.rest(c.body).trim() || getQuotedText(c.msg) || ''

// ---------- terbilang ----------
const SATUAN = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas']
function say(n) {
  n = Math.floor(n)
  if (n < 12) return SATUAN[n]
  if (n < 20) return `${say(n - 10)} belas`
  if (n < 100) return `${SATUAN[Math.floor(n / 10)]} puluh${n % 10 ? ` ${SATUAN[n % 10]}` : ''}`
  if (n < 200) return `seratus${n - 100 ? ` ${say(n - 100)}` : ''}`
  if (n < 1000) return `${SATUAN[Math.floor(n / 100)]} ratus${n % 100 ? ` ${say(n % 100)}` : ''}`
  if (n < 2000) return `seribu${n - 1000 ? ` ${say(n - 1000)}` : ''}`
  if (n < 1e6) return `${say(Math.floor(n / 1000))} ribu${n % 1000 ? ` ${say(n % 1000)}` : ''}`
  const U = [[1e12, 'triliun'], [1e9, 'miliar'], [1e6, 'juta']]
  for (const [v, w] of U) if (n >= v) return `${say(Math.floor(n / v))} ${w}${n % v ? ` ${say(n % v)}` : ''}`
  return ''
}
const terbilang = (x) => {
  if (x === 0) return 'nol'
  const neg = x < 0
  const a = Math.abs(x)
  const [i, d] = String(a).split('.')
  let t = say(Number(i)) || 'nol'
  if (d) t += ` koma ${[...d].map((k) => (k === '0' ? 'nol' : SATUAN[k])).join(' ')}`
  return (neg ? 'minus ' : '') + t
}

// ---------- romawi ----------
const RM = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
const toRoman = (n) => RM.reduce((s, [v, r]) => { while (n >= v) { s += r; n -= v } return s }, '')
const fromRoman = (s) => {
  const V = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let t = 0
  for (let i = 0; i < s.length; i++) t += V[s[i]] < (V[s[i + 1]] || 0) ? -V[s[i]] : V[s[i]]
  return t
}

// ---------- tanggal / umur ----------
const BULAN = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember']
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const BLN_ID = BULAN.map((b) => b[0].toUpperCase() + b.slice(1))
function parseDate(s) {
  s = String(s || '').trim().toLowerCase()
  let m = s.match(/^(\d{1,2})[-/. ](\d{1,2})[-/. ](\d{4})$/)
  if (m) return mk(+m[3], +m[2], +m[1])
  m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/)
  if (m) return mk(+m[1], +m[2], +m[3])
  m = s.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/)
  if (m) { const mi = BULAN.findIndex((b) => b.startsWith(m[2].slice(0, 3))); if (mi >= 0) return mk(+m[3], mi + 1, +m[1]) }
  return null
}
function mk(y, mo, d) {
  const dt = new Date(Date.UTC(y, mo - 1, d))
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d ? dt : null
}
const nowWib = () => { const n = new Date(Date.now() + 7 * 3600e3); return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate())) }
function ageBetween(a, b) {
  let y = b.getUTCFullYear() - a.getUTCFullYear()
  let m = b.getUTCMonth() - a.getUTCMonth()
  let d = b.getUTCDate() - a.getUTCDate()
  if (d < 0) { m--; d += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 0)).getUTCDate() }
  if (m < 0) { y--; m += 12 }
  return { y, m, d }
}
const ZODIAK = [
  ['Capricorn', '♑', [12, 22], 'ambisius, disiplin, sabar'], ['Aquarius', '♒', [1, 20], 'kreatif, mandiri, visioner'], ['Pisces', '♓', [2, 19], 'empatik, imajinatif, lembut'], ['Aries', '♈', [3, 21], 'berani, energik, spontan'],
  ['Taurus', '♉', [4, 20], 'setia, tenang, pekerja keras'], ['Gemini', '♊', [5, 21], 'cerdas, luwes, suka ngobrol'], ['Cancer', '♋', [6, 21], 'perhatian, sensitif, penyayang'], ['Leo', '♌', [7, 23], 'percaya diri, hangat, pemimpin'],
  ['Virgo', '♍', [8, 23], 'teliti, praktis, perfeksionis'], ['Libra', '♎', [9, 23], 'adil, ramah, cinta damai'], ['Scorpio', '♏', [10, 23], 'gigih, intuitif, misterius'], ['Sagittarius', '♐', [11, 22], 'optimis, petualang, jujur']
]
function zodiak(mo, d) {
  let r = ZODIAK[0]
  for (const z of ZODIAK) if (mo > z[2][0] || (mo === z[2][0] && d >= z[2][1])) r = z
  if (mo === 12 && d < 22) r = ZODIAK[11]
  return r
}
const SHIO = ['Monyet', 'Ayam', 'Anjing', 'Babi', 'Tikus', 'Kerbau', 'Macan', 'Kelinci', 'Naga', 'Ular', 'Kuda', 'Kambing']
const SHIO_T = { Tikus: 'cerdik, gesit', Kerbau: 'tekun, jujur', Macan: 'berani, karismatik', Kelinci: 'lembut, diplomatis', Naga: 'penuh semangat, percaya diri', Ular: 'bijak, tenang', Kuda: 'bebas, energik', Kambing: 'kreatif, ramah', Monyet: 'cerdas, lincah', Ayam: 'rajin, teliti', Anjing: 'setia, jujur', Babi: 'dermawan, tulus' }
const ELEMEN = ['Logam', 'Logam', 'Air', 'Air', 'Kayu', 'Kayu', 'Api', 'Api', 'Tanah', 'Tanah']
const generasi = (y) => (y >= 2013 ? 'Gen Alpha' : y >= 1997 ? 'Gen Z' : y >= 1981 ? 'Milenial (Gen Y)' : y >= 1965 ? 'Gen X' : y >= 1946 ? 'Baby Boomer' : 'Generasi Terdahulu')
const fmtD = (d) => `${d.getUTCDate()} ${BLN_ID[d.getUTCMonth()]} ${d.getUTCFullYear()}`

// ---------- zona waktu ----------
const ZONES = [['WIB (Jakarta)', 'Asia/Jakarta'], ['WITA (Makassar)', 'Asia/Makassar'], ['WIT (Jayapura)', 'Asia/Jayapura'], ['Singapura', 'Asia/Singapore'], ['Tokyo', 'Asia/Tokyo'], ['Seoul', 'Asia/Seoul'], ['Beijing', 'Asia/Shanghai'], ['Dubai', 'Asia/Dubai'], ['Mekkah', 'Asia/Riyadh'], ['Istanbul', 'Europe/Istanbul'], ['London', 'Europe/London'], ['Paris', 'Europe/Paris'], ['New York', 'America/New_York'], ['Los Angeles', 'America/Los_Angeles'], ['Sydney', 'Australia/Sydney']]
const ALIAS = { jakarta: 'Asia/Jakarta', wib: 'Asia/Jakarta', wita: 'Asia/Makassar', wit: 'Asia/Jayapura', bali: 'Asia/Makassar', singapura: 'Asia/Singapore', singapore: 'Asia/Singapore', tokyo: 'Asia/Tokyo', jepang: 'Asia/Tokyo', seoul: 'Asia/Seoul', korea: 'Asia/Seoul', beijing: 'Asia/Shanghai', china: 'Asia/Shanghai', dubai: 'Asia/Dubai', mekkah: 'Asia/Riyadh', makkah: 'Asia/Riyadh', madinah: 'Asia/Riyadh', istanbul: 'Europe/Istanbul', london: 'Europe/London', inggris: 'Europe/London', paris: 'Europe/Paris', berlin: 'Europe/Berlin', amsterdam: 'Europe/Amsterdam', moskow: 'Europe/Moscow', newyork: 'America/New_York', ny: 'America/New_York', losangeles: 'America/Los_Angeles', la: 'America/Los_Angeles', chicago: 'America/Chicago', sydney: 'Australia/Sydney', melbourne: 'Australia/Melbourne', kairo: 'Africa/Cairo', delhi: 'Asia/Kolkata', india: 'Asia/Kolkata', bangkok: 'Asia/Bangkok', kualalumpur: 'Asia/Kuala_Lumpur', manila: 'Asia/Manila', hongkong: 'Asia/Hong_Kong' }
function clock(tz, at = new Date()) {
  const f = new Intl.DateTimeFormat('id-ID', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
  const p = Object.fromEntries(f.formatToParts(at).map((x) => [x.type, x.value]))
  const off = (new Date(at.toLocaleString('en-US', { timeZone: tz })) - new Date(at.toLocaleString('en-US', { timeZone: 'UTC' }))) / 3600e3
  return { text: `${p.hour}.${p.minute}`, date: `${p.weekday}, ${p.day} ${p.month}`, off: `UTC${off >= 0 ? '+' : ''}${Number.isInteger(off) ? off : off.toFixed(1)}`, hour: +p.hour }
}

// ---------- ringkas / statistik teks ----------
const STOP = new Set('yang dan di ke dari ini itu untuk dengan pada adalah akan juga atau tidak ada dalam oleh sebagai karena saya kamu dia mereka kita kami bisa sudah lebih para telah saat jika agar serta bahwa tersebut dapat kepada antara the and of to in is a'.split(' '))
const sentences = (t) => t.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) || []
const words = (t) => (t.toLowerCase().match(/[\p{L}\p{N}']+/gu) || [])

const nf = (n) => n.toLocaleString('id-ID')
const specs = {
  statteks: { desc: 'Statistik teks: jumlah kata, kalimat, waktu baca, kata terbanyak (bisa reply teks)', usage: '<teks>', optional: true, args: true, run: async (c) => {
    const t = body(c)
    if (!t) throw bad('Tulis atau reply teks yang mau dihitung.')
    const w = words(t)
    const freq = {}
    for (const x of w) if (x.length > 2 && !STOP.has(x)) freq[x] = (freq[x] || 0) + 1
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5)
    const longest = w.reduce((a, b) => (b.length > a.length ? b : a), '')
    const mins = w.length / 200
    return panel('STATISTIK TEKS', [
      { head: '📊 *JUMLAH*', lines: [`Karakter : ${nf(t.length)} (tanpa spasi ${nf(t.replace(/\s/g, '').length)})`, `Kata : ${nf(w.length)}`, `Kalimat : ${nf(sentences(t).length)}`, `Paragraf : ${nf(t.split(/\n\s*\n/).filter((p) => p.trim()).length)}`] },
      { head: '⏱️ *WAKTU*', lines: [`Membaca : ${mins < 1 ? `${Math.max(1, Math.round(mins * 60))} detik` : `${num(mins, 1)} menit`}`, `Berbicara : ${num(w.length / 130, 1)} menit`] },
      { head: '🏆 *KATA TERBANYAK*', lines: top.length ? top.map(([k, v], i) => `${i + 1}. ${k} (${v}x)`) : ['-'] },
      { head: '🔤 *LAIN-LAIN*', lines: [`Kata terpanjang : ${longest}`, `Rata-rata panjang kata : ${num(w.join('').length / (w.length || 1), 1)} huruf`] }
    ])
  } },
  ringkas: { desc: 'Ringkas teks panjang jadi beberapa kalimat inti (bisa reply teks)', usage: '[jumlah kalimat 1-8] <teks>', optional: true, args: true, heavy: true, run: async (c) => {
    let n = 3
    let t = body(c)
    const m = t.match(/^(\d)\s+([\s\S]+)/)
    if (m) { n = Math.min(8, Math.max(1, +m[1])); t = m[2] }
    const ss = sentences(t)
    if (ss.length < 4) throw bad('Teks terlalu pendek untuk diringkas (minimal 4 kalimat).')
    const freq = {}
    for (const x of words(t)) if (x.length > 2 && !STOP.has(x)) freq[x] = (freq[x] || 0) + 1
    const scored = ss.map((s, i) => {
      const w = words(s).filter((x) => x.length > 2 && !STOP.has(x))
      const sc = w.reduce((a, x) => a + (freq[x] || 0), 0) / Math.sqrt(w.length || 1)
      return { s, i, sc: sc * (i === 0 ? 1.25 : 1) }
    })
    const pick = scored.sort((a, b) => b.sc - a.sc).slice(0, Math.min(n, ss.length - 1)).sort((a, b) => a.i - b.i)
    return panel('RINGKASAN', [{ head: `📝 *${pick.length} KALIMAT INTI*`, lines: pick.map((p) => p.s), bullet: '•' }, { head: '📉 *HASIL*', lines: [`Asli : ${words(t).length} kata`, `Ringkas : ${words(pick.map((p) => p.s).join(' ')).length} kata (${Math.round((words(pick.map((p) => p.s).join(' ')).length / words(t).length) * 100)}%)`] }])
  } },
  slug: { desc: 'Ubah teks jadi slug URL (huruf kecil-tanpa-simbol)', usage: '<teks>', example: 'Judul Artikel Saya!', optional: true, args: true, run: async (c) => {
    const t = body(c)
    if (!t) throw bad('Tulis teksnya.')
    const s = t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    return `🔗 ${s}`
  } },
  rapikan: { desc: 'Rapikan teks: spasi ganda, huruf awal kalimat, spasi sebelum tanda baca', usage: '<teks>', optional: true, args: true, run: async (c) => {
    const t = body(c)
    if (!t) throw bad('Tulis atau reply teksnya.')
    const out = t.replace(/[ \t]+/g, ' ').replace(/ +([,.!?;:])/g, '$1').replace(/([,.!?;:])(?=[^\s\d"')\]])/g, '$1 ').replace(/\n{3,}/g, '\n\n').replace(/(^|[.!?]\s+|\n)(\p{Ll})/gu, (_, a, b) => a + b.toUpperCase()).replace(/\bi\b/g, 'I').trim()
    return `✨ *Teks dirapikan:*\n\n${out}`
  } },
  jamdunia: { desc: 'Jam di berbagai kota dunia (tanpa argumen = daftar populer)', usage: '[kota ...]', example: 'tokyo london newyork', optional: true, run: async (c) => {
    const picks = c.args.length ? c.args.map((a) => a.toLowerCase().replace(/[^a-z]/g, '')) : null
    let zones = ZONES
    if (picks) {
      zones = picks.map((p) => [p.charAt(0).toUpperCase() + p.slice(1), ALIAS[p]]).filter((z) => z[1])
      if (!zones.length) throw bad(`Kota tidak dikenal. Coba: ${Object.keys(ALIAS).slice(0, 18).join(', ')}`)
    }
    const base = clock('Asia/Jakarta')
    return panel('JAM DUNIA', [{ head: '🌍 *SEKARANG*', lines: zones.map(([n, tz]) => { const k = clock(tz); return `${k.hour >= 6 && k.hour < 18 ? '☀️' : '🌙'} ${n} : *${k.text}* • ${k.date} • ${k.off}` }) }], { tip: `Acuan: WIB ${base.text}` })
  } },
  investasi: { desc: 'Simulasi investasi/tabungan berbunga majemuk + grafik pertumbuhan', usage: '<modal awal> <setoran bulanan> <return %/tahun> <tahun>', example: '10jt 1jt 8 10', args: true, heavy: true, run: async (c) => {
    const [a, b, r, y] = [parseMoney(c.args[0] ?? ''), parseMoney(c.args[1] ?? '0'), Number(String(c.args[2] ?? '').replace(',', '.')), Number(c.args[3])]
    if (a == null || b == null || !Number.isFinite(r) || !Number.isInteger(y) || y < 1 || y > 50 || r < 0 || r > 100) throw bad('Format: .investasi <modal> <setoran/bulan> <return %/tahun> <tahun>\nContoh: .investasi 10jt 1jt 8 10')
    const mr = Math.pow(1 + r / 100, 1 / 12) - 1
    let v = a
    const pts = []
    for (let m = 1; m <= y * 12; m++) { v = v * (1 + mr) + b; if (m % 12 === 0) pts.push({ label: `Th ${m / 12}`, value: Math.round(v) }) }
    const modal = a + b * y * 12
    const picked = pts.length > 12 ? pts.filter((_, i) => i % Math.ceil(pts.length / 12) === Math.ceil(pts.length / 12) - 1 || i === pts.length - 1).slice(-12) : pts
    const image = await require('./chartkit').charts.lineChart({ title: 'Pertumbuhan Investasi', items: picked.length >= 2 ? picked : [{ label: 'Awal', value: a }, ...picked] })
    const caption = panel('SIMULASI INVESTASI', [{ head: '⚙️ *ASUMSI*', lines: [`Modal awal : ${rp(a)}`, `Setoran : ${rp(b)}/bulan`, `Return : ${num(r)}%/tahun (majemuk bulanan)`, `Jangka : ${y} tahun`] }, { head: '📈 *HASIL*', lines: [`Total modal : ${rp(modal)}`, `Keuntungan : ${rp(v - modal)}`, `Nilai akhir : *${rp(v)}*`, `Pertumbuhan : ${num(((v - modal) / (modal || 1)) * 100, 1)}%`] }], { tip: 'Simulasi, bukan jaminan hasil. Return investasi nyata berfluktuasi.' })
    return { image, caption }
  } },
}

module.exports = kit.multi({ name: 'smartkit', category: 'tools', emoji: '🧮', desc: 'Statistik & ringkasan teks, rapikan teks, slug, jam dunia, simulasi investasi', specs })
