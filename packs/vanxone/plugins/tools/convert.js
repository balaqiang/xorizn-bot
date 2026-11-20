// Konversi satuan (offline)
const UNITS = {
  panjang: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, inch: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 },
  berat: { mg: 0.000001, g: 0.001, kg: 1, ton: 1000, oz: 0.028349523125, lb: 0.45359237 },
  volume: { ml: 0.001, l: 1, liter: 1, gal: 3.785411784, cup: 0.2365882365 },
  data: { b: 1, kb: 1024, mb: 1048576, gb: 1073741824, tb: 1099511627776 },
  kecepatan: { 'm/s': 1, ms: 1, 'km/h': 1 / 3.6, kmh: 1 / 3.6, kph: 1 / 3.6, mph: 0.44704, knot: 0.514444 },
  waktu: { s: 1, detik: 1, menit: 60, jam: 3600, hari: 86400, minggu: 604800 }
}
const TEMP = ['c', 'f', 'k']

function toTemp(v, from, to) {
  const c = from === 'c' ? v : from === 'f' ? (v - 32) * (5 / 9) : v - 273.15
  return to === 'c' ? c : to === 'f' ? c * (9 / 5) + 32 : c + 273.15
}

module.exports = {
  name: 'convert',
  command: ['convert', 'konversi', 'satuan'],
  category: 'tools',
  desc: 'Konversi satuan (panjang, berat, suhu, data, dll)',
  usage: '<angka> <dari> <ke>',
  run: async ({ args, prefix, reply }) => {
    const v = Number(String(args[0] || '').replace(',', '.'))
    const from = (args[1] || '').toLowerCase()
    const to = (args[2] || '').toLowerCase()

    if (!Number.isFinite(v) || !from || !to) {
      return reply(
        [
          `Contoh: ${prefix}convert 10 km mi`,
          `${prefix}convert 100 c f`,
          `${prefix}convert 2 gb mb`,
          '',
          '*Satuan tersedia:*',
          ...Object.entries(UNITS).map(([k, u]) => `▬ ${k}: ${Object.keys(u).join(', ')}`),
          '▬ suhu: c, f, k'
        ].join('\n')
      )
    }

    let out
    if (TEMP.includes(from) && TEMP.includes(to)) {
      out = toTemp(v, from, to)
    } else {
      const cat = Object.values(UNITS).find((u) => from in u && to in u)
      if (!cat) return reply('Satuan tidak dikenal atau beda jenis. Ketik perintahnya tanpa argumen untuk lihat daftar.')
      out = (v * cat[from]) / cat[to]
    }
    const f = (n) => Number(n.toPrecision(10)).toLocaleString('id-ID', { maximumFractionDigits: 8 })
    await reply(`${f(v)} ${from} = *${f(out)} ${to}*`)
  }
}
