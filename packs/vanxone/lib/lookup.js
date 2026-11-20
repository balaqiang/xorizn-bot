// lib/lookup.js — pencarian sederhana untuk dataset (abaikan huruf besar/kecil, spasi, tanda baca)
const norm = (s) => String(s ?? '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '')

// Cari item: cocok persis dulu, lalu diawali, lalu mengandung. fields = fungsi yang mengembalikan daftar teks per item.
function find(list, query, fields) {
  const q = norm(query)
  if (!q) return { exact: null, partial: [] }
  const keys = (it) => fields(it).map(norm)
  const exact = list.find((it) => keys(it).includes(q)) || null
  if (exact) return { exact, partial: [] }
  const starts = list.filter((it) => keys(it).some((k) => k.startsWith(q)))
  if (starts.length) return { exact: starts.length === 1 ? starts[0] : null, partial: starts }
  const has = list.filter((it) => keys(it).some((k) => k.includes(q)))
  return { exact: has.length === 1 ? has[0] : null, partial: has }
}
module.exports = { norm, find }
