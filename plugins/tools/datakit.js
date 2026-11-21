// Alat data & teks: statistik angka, bandingkan teks, urutkan/acak baris, hapus duplikat baris, cari-ganti massal
const kit = require('../../lib/kit')
const { panel, num } = require('../../lib/uitext')
const { getQuotedText } = require('../../lib/utils')

const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })
const body = (c) => kit.rest(c.body).trim() || getQuotedText(c.msg) || ''
const lines = (c) => {
  const t = (kit.rest(c.body) || '').replace(/^[ \t]+/, '') || getQuotedText(c.msg) || ''
  const l = t.split(/\r?\n/).map((s) => s.replace(/\s+$/, '')).filter((s) => s.trim())
  if (!l.length) throw bad(`Tulis beberapa baris teks (satu item per baris), atau balas pesan berisi daftar.\nContoh:\n${c.prefix}${c.command} apel\njeruk\nanggur`)
  return l
}
const nums = (t) => (t.match(/-?\d+(?:[.,]\d+)?/g) || []).map((x) => Number(x.replace(',', '.'))).filter(Number.isFinite)

const specs = {
  statangka: { desc: 'Statistik lengkap dari deretan angka (rata-rata, median, modus, simpangan baku, kuartil)', usage: '<angka dipisah spasi/koma/baris>', example: '80 75 90 60 85', args: true, run: async (c) => {
    const a = nums(body(c))
    if (a.length < 2) throw bad('Masukkan minimal 2 angka.')
    const s = [...a].sort((x, y) => x - y)
    const n = s.length
    const sum = s.reduce((p, q) => p + q, 0)
    const mean = sum / n
    const q = (p) => { const i = (n - 1) * p; const lo = Math.floor(i); return s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo) }
    const cnt = new Map(); s.forEach((v) => cnt.set(v, (cnt.get(v) || 0) + 1))
    const mx = Math.max(...cnt.values())
    const mode = mx > 1 ? [...cnt].filter(([, v]) => v === mx).map(([k]) => num(k, 2)).join(', ') : 'tidak ada'
    const varp = s.reduce((p, v) => p + (v - mean) ** 2, 0)
    return panel('STATISTIK ANGKA', [
      { head: '📊 *RINGKASAN*', lines: [`Jumlah data : ${n}`, `Total : ${num(sum, 2)}`, `Rata-rata : *${num(mean, 2)}*`, `Median : *${num(q(0.5), 2)}*`, `Modus : ${mode}`] },
      { head: '📐 *SEBARAN*', lines: [`Minimum : ${num(s[0], 2)}`, `Q1 : ${num(q(0.25), 2)}`, `Q3 : ${num(q(0.75), 2)}`, `Maksimum : ${num(s[n - 1], 2)}`, `Rentang : ${num(s[n - 1] - s[0], 2)}`, `Simpangan baku (populasi) : ${num(Math.sqrt(varp / n), 3)}`, `Simpangan baku (sampel) : ${num(Math.sqrt(varp / (n - 1)), 3)}`] }
    ], { tip: 'Pakai .grafik untuk memvisualisasikan data.' })
  } },
  banding: { desc: 'Bandingkan dua teks per baris (mana yang ditambah/dihapus). Pisahkan dua teks dengan baris berisi ---', usage: '<teks lama>\\n---\\n<teks baru>', example: 'a\\nb\\n---\\na\\nc', args: true, run: async (c) => {
    const t = body(c)
    const [x, y] = t.split(/\r?\n\s*-{3,}\s*\r?\n/)
    if (y === undefined) throw bad('Pisahkan dua teks dengan satu baris berisi ---')
    const A = x.split(/\r?\n/); const B = y.split(/\r?\n/)
    const m = A.length; const n = B.length
    if (m * n > 4e6) throw bad('Teks terlalu panjang untuk dibandingkan.')
    const L = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1))
    for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1])
    const out = []; let i = 0; let j = 0; let add = 0; let del = 0; let same = 0
    while (i < m && j < n) {
      if (A[i] === B[j]) { out.push(`   ${A[i]}`); same++; i++; j++ } else if (L[i + 1][j] >= L[i][j + 1]) { out.push(`➖ ${A[i]}`); del++; i++ } else { out.push(`➕ ${B[j]}`); add++; j++ }
    }
    while (i < m) { out.push(`➖ ${A[i++]}`); del++ }
    while (j < n) { out.push(`➕ ${B[j++]}`); add++ }
    if (!add && !del) return '✅ Kedua teks identik.'
    return panel('PERBANDINGAN TEKS', [{ head: '📈 *RINGKASAN*', lines: [`Ditambah : ${add} baris`, `Dihapus : ${del} baris`, `Sama : ${same} baris`] }, { head: '📝 *PERUBAHAN*', lines: out.slice(0, 80), plain: true }])
  } },
  sortir: { desc: 'Urutkan baris teks A-Z (tambah "desc" untuk terbalik, "angka" untuk urut numerik)', usage: '[desc] [angka]\\n<baris-baris>', example: 'angka\\n10\\n2\\n33', args: true, run: async (c) => {
    const first = (kit.rest(c.body).split(/\r?\n/)[0] || '').toLowerCase()
    const opt = first.split(/\s+/).filter((w) => ['desc', 'angka'].includes(w))
    const onlyOpt = first.trim() && first.split(/\s+/).every((w) => ['desc', 'angka'].includes(w))
    let l = onlyOpt ? kit.rest(c.body).split(/\r?\n/).slice(1).filter((s) => s.trim()) : null
    if (!l || !l.length) l = lines(c)
    const num1 = (s) => parseFloat((s.match(/-?\d+(?:[.,]\d+)?/) || ['0'])[0].replace(',', '.'))
    l.sort(opt.includes('angka') ? (a, b) => num1(a) - num1(b) : (a, b) => a.localeCompare(b, 'id', { sensitivity: 'base', numeric: true }))
    if (opt.includes('desc')) l.reverse()
    return `🔢 *${l.length} baris diurutkan*\n\n${l.join('\n')}`
  } },
  hapusdupe: { desc: 'Hapus baris ganda dari daftar (urutan asli dipertahankan)', usage: '<baris-baris>', example: 'a\\nb\\na', args: true, run: async (c) => {
    const l = lines(c); const seen = new Set(); const r = []
    for (const s of l) { const k = s.trim().toLowerCase(); if (!seen.has(k)) { seen.add(k); r.push(s) } }
    return `🧹 *${l.length - r.length} duplikat dihapus* (${l.length} → ${r.length})\n\n${r.join('\n')}`
  } },
  nomorbaris: { desc: 'Beri nomor pada setiap baris', usage: '<baris-baris>', example: 'a\\nb', args: true, run: async (c) => lines(c).map((s, i) => `${i + 1}. ${s}`).join('\n') },
  gantiteks: { desc: 'Cari & ganti massal pada teks (tidak peka huruf besar/kecil)', usage: '<cari> => <ganti>\\n<teks>', example: 'kucing => anjing\\nSaya suka kucing', args: true, run: async (c) => {
    const t = kit.rest(c.body)
    const m = t.match(/^\s*(.+?)\s*=>\s*(.*)\r?\n([\s\S]+)$/)
    if (!m) throw bad('Format: <cari> => <ganti> lalu teks di baris berikutnya.')
    const esc = m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    let k = 0
    const out = m[3].replace(new RegExp(esc, 'gi'), () => { k++; return m[2] })
    return `🔁 *${k} penggantian*\n\n${out}`
  } }
}

module.exports = kit.multi({ name: 'datakit', category: 'tools', emoji: '🗂️', desc: 'Statistik angka, bandingkan teks, urut/acak/bersihkan daftar, cari-ganti massal', specs })
