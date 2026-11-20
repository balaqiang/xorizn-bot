// Alat waktu: kalender bulanan, tambah hari/bulan, konversi zona waktu, nomor pekan
const { panel } = require('../../lib/uitext')

const TZ = 'Asia/Jakarta'
const DAY = 86400000
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const gregFmt = new Intl.DateTimeFormat('id-ID', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const fmtDate = (d) => gregFmt.format(d)

function todayWib() {
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date()).split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}
function parseDate(raw) {
  const s = String(raw || '').trim().toLowerCase()
  if (!s || s === 'hariini' || s === 'sekarang') return todayWib()
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

// zona waktu populer
const ZONES = {
  wib: ['WIB', 'Asia/Jakarta'], wita: ['WITA', 'Asia/Makassar'], wit: ['WIT', 'Asia/Jayapura'], utc: ['UTC', 'UTC'], gmt: ['UTC', 'UTC'],
  jst: ['Tokyo', 'Asia/Tokyo'], tokyo: ['Tokyo', 'Asia/Tokyo'], kst: ['Seoul', 'Asia/Seoul'], seoul: ['Seoul', 'Asia/Seoul'],
  sgt: ['Singapura', 'Asia/Singapore'], singapura: ['Singapura', 'Asia/Singapore'], kl: ['Kuala Lumpur', 'Asia/Kuala_Lumpur'],
  india: ['India', 'Asia/Kolkata'], dubai: ['Dubai', 'Asia/Dubai'], mekkah: ['Mekkah', 'Asia/Riyadh'], riyadh: ['Mekkah', 'Asia/Riyadh'],
  london: ['London', 'Europe/London'], paris: ['Paris', 'Europe/Paris'], cet: ['Paris', 'Europe/Paris'], istanbul: ['Istanbul', 'Europe/Istanbul'],
  newyork: ['New York', 'America/New_York'], est: ['New York', 'America/New_York'], la: ['Los Angeles', 'America/Los_Angeles'], pst: ['Los Angeles', 'America/Los_Angeles'],
  sydney: ['Sydney', 'Australia/Sydney'], aest: ['Sydney', 'Australia/Sydney']
}
const DEFAULT_TARGETS = ['wib', 'wita', 'wit', 'utc', 'tokyo', 'london', 'newyork']

function offsetMin(tz, date) {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }).formatToParts(date)
  const v = (t) => Number(p.find((x) => x.type === t).value)
  return (Date.UTC(v('year'), v('month') - 1, v('day'), v('hour'), v('minute'), v('second')) - Math.floor(date.getTime() / 1000) * 1000) / 60000
}
// jam dinding (h:m) di zona tz pada tanggal ymd -> instan UTC
function wallToInstant(tz, y, m, d, h, mi) {
  let t = Date.UTC(y, m - 1, d, h, mi)
  for (let i = 0; i < 3; i++) t = Date.UTC(y, m - 1, d, h, mi) - offsetMin(tz, new Date(t)) * 60000
  return new Date(t)
}

function isoWeek(d) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const day = t.getUTCDay() || 7
  t.setUTCDate(t.getUTCDate() + 4 - day)
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1))
  return { week: Math.ceil(((t - y0) / DAY + 1) / 7), year: t.getUTCFullYear() }
}

function addMonths(d, n) {
  const day = d.getUTCDate()
  const r = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1))
  const last = new Date(Date.UTC(r.getUTCFullYear(), r.getUTCMonth() + 1, 0)).getUTCDate()
  r.setUTCDate(Math.min(day, last))
  return r
}

module.exports = {
  name: 'waktukit',
  command: ['tambahhari', 'konversiwaktu', 'zonawaktu', 'pekan'],
  category: 'tools',
  emoji: '🕒',
  desc: 'Kalender bulanan, tambah hari/bulan, konversi zona waktu, nomor pekan',
  usage: '<lihat contoh di .kalender / .tambahhari / .konversiwaktu>',
  run: async ({ command, args, prefix, reply }) => {
    if (command === 'kalender') {
      const t = todayWib()
      let m = t.getUTCMonth() + 1
      let y = t.getUTCFullYear()
      for (const a of args.map((x) => x.toLowerCase())) {
        const bi = BULAN.findIndex((b) => b.toLowerCase().startsWith(a) && a.length >= 3)
        if (/^\d{4}$/.test(a)) y = Number(a)
        else if (/^\d{1,2}$/.test(a) && Number(a) >= 1 && Number(a) <= 12) m = Number(a)
        else if (bi >= 0) m = bi + 1
        else return reply(`Format: ${prefix}kalender [bulan] [tahun]\nContoh: ${prefix}kalender  •  ${prefix}kalender 12 2026  •  ${prefix}kalender agustus 2027`)
      }
      if (y < 1900 || y > 2200) return reply('Tahun harus antara 1900 dan 2200.')
      const first = new Date(Date.UTC(y, m - 1, 1))
      const days = new Date(Date.UTC(y, m, 0)).getUTCDate()
      const offset = (first.getUTCDay() + 6) % 7 // Senin = 0
      const isNow = t.getUTCFullYear() === y && t.getUTCMonth() + 1 === m
      const cell = (d) => (isNow && d === t.getUTCDate() ? `[${d}]`.padEnd(4) : String(d).padStart(2).padEnd(4))
      const rows = ['Sn  Sl  Rb  Km  Jm  Sb  Mg  ']
      let line = ''.padEnd(offset * 4)
      for (let d = 1; d <= days; d++) {
        line += cell(d)
        if ((offset + d) % 7 === 0 || d === days) { rows.push(line.trimEnd()); line = '' }
      }
      const title = `${BULAN[m - 1]} ${y}`
      return reply(`📅 *${title}*\n\`\`\`\n${rows.join('\n')}\n\`\`\`${isNow ? '\n[ ] = hari ini' : ''}`)
    }

    if (command === 'tambahhari') {
      const d0 = parseDate(args[0])
      const m = String(args[1] || '').match(/^([+-]?)(\d{1,5})$/)
      const unit = (args[2] || 'hari').toLowerCase()
      const U = { hari: 1, minggu: 7, pekan: 7, bulan: 'm', tahun: 'y' }
      if (!d0 || !m || !(unit in U)) return reply(`Format: ${prefix}tambahhari <tanggal|hariini> <+/-jumlah> [hari|minggu|bulan|tahun]\nContoh: ${prefix}tambahhari hariini +100\nContoh: ${prefix}tambahhari 31-01-2026 +1 bulan\nContoh: ${prefix}tambahhari 17-08-2026 -2 tahun`)
      const n = Number(m[2]) * (m[1] === '-' ? -1 : 1)
      const r = U[unit] === 'm' ? addMonths(d0, n) : U[unit] === 'y' ? addMonths(d0, n * 12) : new Date(d0.getTime() + n * U[unit] * DAY)
      if (Math.abs(r.getUTCFullYear() - 2026) > 9000) return reply('Hasilnya terlalu jauh.')
      const diff = Math.round((r - d0) / DAY)
      return reply(panel('TAMBAH TANGGAL', [{ head: '🗓️ *HASIL*', lines: [`Awal : ${fmtDate(d0)}`, `Ditambah : ${n >= 0 ? '+' : ''}${n} ${unit}`, `*Hasil : ${fmtDate(r)}*`, `Selisih : ${diff >= 0 ? '+' : ''}${diff.toLocaleString('id-ID')} hari`] }]))
    }

    if (command === 'pekan') {
      const d = parseDate(args[0])
      if (!d) return reply(`Format: ${prefix}pekan [dd-mm-yyyy]`)
      const y0 = Date.UTC(d.getUTCFullYear(), 0, 1)
      const doy = Math.round((d - y0) / DAY) + 1
      const len = (Date.UTC(d.getUTCFullYear() + 1, 0, 1) - y0) / DAY
      const w = isoWeek(d)
      return reply(panel('NOMOR PEKAN', [{ head: '🗓️ *HASIL*', lines: [`Tanggal : ${fmtDate(d)}`, `Pekan ke : *${w.week}* (ISO, tahun ${w.year})`, `Hari ke : ${doy} dari ${len}`, `Sisa hari tahun ini : ${len - doy}`, `Kuartal : Q${Math.floor(d.getUTCMonth() / 3) + 1}`] }]))
    }

    // konversiwaktu <HH:MM> <asal> [tujuan...]
    const tm = String(args[0] || '').match(/^(\d{1,2})[:.](\d{2})$/)
    const from = ZONES[(args[1] || '').toLowerCase()]
    if (!tm || Number(tm[1]) > 23 || Number(tm[2]) > 59 || !from) {
      return reply(panel('KONVERSI ZONA WAKTU', [
        { head: '📖 *CARA PAKAI*', lines: [`${prefix}konversiwaktu 14:00 wib  → ke zona populer`, `${prefix}konversiwaktu 20:30 london wib wita  → ke zona pilihan`] },
        { head: '🌏 *ZONA TERSEDIA*', lines: ['wib, wita, wit, utc, tokyo, seoul, singapura, kl, india, dubai, mekkah, london, paris, istanbul, newyork, la, sydney'], plain: true }
      ], { tip: '💡 Memakai tanggal hari ini, jadi aturan jam musim panas (DST) ikut dihitung.' }))
    }
    const targets = args.slice(2).map((x) => x.toLowerCase())
    if (targets.some((x) => !ZONES[x])) return reply(`Zona tidak dikenal: ${targets.filter((x) => !ZONES[x]).join(', ')}\nKetik ${prefix}konversiwaktu untuk daftar zona.`)
    const list = targets.length ? targets : DEFAULT_TARGETS.filter((x) => ZONES[x][1] !== from[1])
    const t = todayWib()
    const instant = wallToInstant(from[1], t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), Number(tm[1]), Number(tm[2]))
    const hhmm = (tz) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(instant)
    const dayNo = (tz) => Number(new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(instant).slice(8, 10))
    const base = dayNo(from[1])
    const lines = list.map((k) => {
      const [label, tz] = ZONES[k]
      const dd = dayNo(tz) - base
      const note = dd === 0 ? '' : (dd === 1 || dd < -20) ? ' (+1 hari)' : ' (−1 hari)'
      return `${label} : *${hhmm(tz)}*${note}`
    })
    await reply(panel('KONVERSI ZONA WAKTU', [{ head: `🕒 *${tm[1].padStart(2, '0')}:${tm[2]} ${from[0]} =*`, lines }], { tip: '💡 Memakai tanggal hari ini (DST ikut dihitung).' }))
  }
}
module.exports.addMonths = addMonths
module.exports.isoWeek = isoWeek
module.exports.wallToInstant = wallToInstant
