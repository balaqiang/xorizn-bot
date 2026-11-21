// Helper tanggal (zona WIB). Format masukan: tgl-bln-tahun
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

function parse(raw) {
  const m = String(raw).trim().match(/^(\d{1,2})[-/. ](\d{1,2})[-/. ](\d{4})$/)
  if (!m) return null
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const t = new Date(Date.UTC(y, mo - 1, d))
  return t.getUTCMonth() === mo - 1 && t.getUTCDate() === d && y >= 1600 && y <= 2500 ? { d, m: mo, y, t: t.getTime() } : null
}

function todayWib() {
  const n = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
  return { d: n.getDate(), m: n.getMonth() + 1, y: n.getFullYear(), t: Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) }
}

const fmt = ({ d, m, y }) => `${d} ${MONTHS[m - 1]} ${y}`
const days = (a, b) => Math.round((b.t - a.t) / 86400000)

// selisih kalender: tahun, bulan, hari (a <= b)
function ymd(a, b) {
  let y = b.y - a.y
  let m = b.m - a.m
  let d = b.d - a.d
  if (d < 0) { m--; d += new Date(Date.UTC(b.y, b.m - 1, 0)).getUTCDate() }
  if (m < 0) { y--; m += 12 }
  return { y, m, d }
}

module.exports = { MONTHS, parse, todayWib, fmt, days, ymd }
