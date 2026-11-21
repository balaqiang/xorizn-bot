// .hijri [tanggal] — konversi Masehi → Hijriyah (offline) + hitung mundur hari besar Islam
const { panel } = require('../../lib/uitext')

const TZ = 'Asia/Jakarta'
const hijriFmt = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' })
const hijriNum = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { timeZone: 'UTC', day: 'numeric', month: 'numeric', year: 'numeric' })
const gregFmt = new Intl.DateTimeFormat('id-ID', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const DAY = 86400000
const part = (parts, t) => parts.find((p) => p.type === t)?.value

function hijri(d) {
  const n = hijriNum.formatToParts(d)
  const l = hijriFmt.formatToParts(d)
  return { d: Number(part(n, 'day')), m: Number(part(n, 'month')), y: Number(part(n, 'year')), name: part(l, 'month') }
}

// tanggal hari ini (WIB) sebagai UTC tengah malam
function todayWib() {
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date()).split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

function parseDate(raw) {
  const s = String(raw || '').trim().toLowerCase()
  if (!s || s === 'sekarang' || s === 'hariini') return todayWib()
  if (s === 'besok') return new Date(todayWib().getTime() + DAY)
  if (s === 'kemarin') return new Date(todayWib().getTime() - DAY)
  let y, m, d
  let x = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/)
  if (x) [d, m, y] = [x[1], x[2], x[3]].map(Number)
  else if ((x = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/))) [y, m, d] = [x[1], x[2], x[3]].map(Number)
  else return null
  const dt = new Date(Date.UTC(y, m - 1, d))
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d ? dt : null
}

const EVENTS = [
  ['1 Muharram (Tahun Baru Islam)', 1, 1],
  ['1 Ramadan (awal puasa)', 9, 1],
  ['1 Syawal (Idulfitri)', 10, 1],
  ['10 Dzulhijjah (Iduladha)', 12, 10]
]

function daysUntil(from, m, d) {
  for (let i = 1; i <= 400; i++) {
    const h = hijri(new Date(from.getTime() + i * DAY))
    if (h.m === m && h.d === d) return { i, y: h.y }
  }
  return null
}

module.exports = {
  name: 'hijri',
  command: ['hijri', 'hijriah', 'hijriyah', 'tglhijriyah'],
  category: 'tools',
  emoji: '🌙',
  desc: 'Konversi tanggal ke Hijriyah + hitung mundur hari besar Islam',
  usage: '[dd-mm-yyyy | besok]',
  run: async ({ args, prefix, reply }) => {
    const date = parseDate(args[0])
    if (!date) return reply(`Format tanggal tidak dikenal.\nContoh: ${prefix}hijri 17-08-2026  atau  ${prefix}hijri besok`)
    const h = hijri(date)
    const today = todayWib()
    const sections = [
      {
        head: '📅 *KONVERSI TANGGAL*',
        lines: [`Masehi : ${gregFmt.format(date)}`, `Hijriyah : ${h.d} ${h.name} ${h.y} H`]
      }
    ]
    const ev = EVENTS.map(([label, m, d]) => ({ label, r: daysUntil(date, m, d) })).filter((e) => e.r).sort((a, b) => a.r.i - b.r.i)
    if (ev.length) {
      sections.push({
        head: `⏳ *HITUNG MUNDUR${date.getTime() === today.getTime() ? '' : ' (dari tanggal ini)'}*`,
        lines: ev.map((e) => `${e.label} ${e.r.y} H → ${e.r.i} hari lagi`)
      })
    }
    await reply(panel('KALENDER HIJRIYAH', sections, { tip: '💡 Perkiraan (kalender Umm al-Qura). Penetapan resmi Kemenag RI bisa berbeda ±1 hari.' }))
  }
}
