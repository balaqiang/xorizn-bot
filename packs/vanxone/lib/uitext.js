// lib/uitext.js — helper teks bergaya panel (sama dengan tampilan .menu) + parser angka/uang
const line = '──────────────────────'

// panel('JUDUL', [{ head: '📊 *INFO*', lines: ['A : 1'], bullet: '➥', plain: false }], { intro, tip })
function panel(title, sections = [], { intro, tip } = {}) {
  const out = [`> ―――《 ❝ ${title} ❞ 》―――`]
  if (intro) out.push(...[].concat(intro).map((l) => `> ${l}`))
  for (const s of sections.filter((x) => x && x.lines && x.lines.length)) {
    out.push('')
    if (s.head) out.push(`> [ ${s.head} ]`)
    for (const l of s.lines) out.push(s.plain ? `> ${l}` : `> ${s.bullet || '➥'} ${l}`)
  }
  if (tip) out.push('', `> ${line}`, `> ${tip}`)
  return out.join('\n')
}

const rp = (n) => `Rp${Math.round(n).toLocaleString('id-ID')}`
const num = (n, d = 2) => Number(n).toLocaleString('id-ID', { maximumFractionDigits: d })

// "500rb", "1,5jt", "2.5jt", "1.500.000", "Rp2m" -> angka (null kalau tidak valid)
const UNIT = { k: 1e3, rb: 1e3, ribu: 1e3, jt: 1e6, juta: 1e6, m: 1e9, miliar: 1e9, t: 1e12, triliun: 1e12 }
function parseMoney(raw) {
  let s = String(raw ?? '').toLowerCase().replace(/rp\.?/g, '').replace(/\s+/g, '')
  const m = s.match(/^([\d.,]+)(k|rb|ribu|jt|juta|m|miliar|t|triliun)?$/)
  if (!m) return null
  let n = m[1]
  if (/^\d{1,3}(\.\d{3})+$/.test(n)) n = n.replace(/\./g, '') // 1.500.000 (pemisah ribuan)
  else if (/^\d{1,3}(,\d{3})+$/.test(n)) n = n.replace(/,/g, '')
  else n = n.replace(',', '.')
  const v = Number(n) * (UNIT[m[2]] || 1)
  return Number.isFinite(v) && v >= 0 ? v : null
}

// angka biasa dengan koma/titik desimal
const parseNum = (raw) => {
  const v = Number(String(raw ?? '').replace(',', '.'))
  return Number.isFinite(v) ? v : null
}

module.exports = { line, panel, rp, num, parseMoney, parseNum }
