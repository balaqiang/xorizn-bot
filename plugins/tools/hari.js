const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon']
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const ANCHOR = Date.UTC(1945, 7, 17) // 17 Agustus 1945 = Jumat Legi

function weton(y, m, d) {
  const t = Date.UTC(y, m - 1, d)
  const days = Math.round((t - ANCHOR) / 86400000)
  return { hari: DAYS[new Date(t).getUTCDay()], pasaran: PASARAN[((days % 5) + 5) % 5] }
}

module.exports = {
  weton,
  name: 'hari',
  command: ['hari', 'weton', 'cekhari'],
  category: 'tools',
  desc: 'Cek hari & pasaran Jawa dari sebuah tanggal',
  usage: '[tgl-bln-tahun]',
  run: async ({ args, prefix, reply }) => {
    let y, m, d
    const input = args.join(' ').trim()
    if (!input) {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
      ;[y, m, d] = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    } else {
      const mt = input.match(/^(\d{1,2})[-/. ](\d{1,2})[-/. ](\d{4})$/)
      if (!mt) return reply(`Format: ${prefix}hari <tgl-bln-tahun>\nContoh: ${prefix}hari 17-08-1945`)
      ;[d, m, y] = [Number(mt[1]), Number(mt[2]), Number(mt[3])]
      const probe = new Date(Date.UTC(y, m - 1, d))
      if (y < 1600 || y > 2500 || probe.getUTCMonth() !== m - 1 || probe.getUTCDate() !== d) return reply('Tanggal tidak valid.')
    }
    const w = weton(y, m, d)
    await reply(`📅 *${d} ${MONTHS[m - 1]} ${y}*\n\n▬ *Hari:* ${w.hari}\n▬ *Pasaran:* ${w.pasaran}\n▬ *Weton:* ${w.hari} ${w.pasaran}`)
  }
}
