const U = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3, tb: 1024 ** 4 }
const fmtB = (n) => { let i = 0, v = n; const u = ['B', 'KB', 'MB', 'GB', 'TB']; while (v >= 1024 && i < 4) { v /= 1024; i++ } return `${v.toLocaleString('id-ID', { maximumFractionDigits: 2 })} ${u[i]}` }
module.exports = {
  name: 'ukuranfile', command: ['ukuranfile', 'bytes', 'waktuunduh'], category: 'tools', emoji: '💾', desc: 'Konversi satuan data & hitung lama unduh (ukuran + kecepatan Mbps)', usage: '<angka> <b|kb|mb|gb|tb> [kecepatan Mbps]',
  run: async ({ args, prefix, reply }) => {
    const n = Number(String(args[0] || '').replace(',', '.')); const u = (args[1] || '').toLowerCase()
    if (!(n >= 0) || !U[u]) return reply(`Contoh: ${prefix}ukuranfile 1.5 gb\nHitung unduh: ${prefix}ukuranfile 700 mb 20 (20 Mbps)`)
    const b = n * U[u]
    const rows = ['b', 'kb', 'mb', 'gb', 'tb'].map((k) => `▬ *${k.toUpperCase()}:* ${(b / U[k]).toLocaleString('id-ID', { maximumFractionDigits: 4 })}`)
    let extra = ''
    const mbps = Number(String(args[2] || '').replace(',', '.'))
    if (mbps > 0) { const s = (b * 8) / (mbps * 1e6); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); extra = `\n⏳ *Estimasi unduh @${mbps} Mbps:* ${h ? h + ' jam ' : ''}${m ? m + ' menit ' : ''}${Math.ceil(s % 60)} detik` }
    await reply(`💾 *UKURAN DATA*\n\n▬ *Input:* ${fmtB(b)}\n${rows.join('\n')}${extra}`)
  }
}
