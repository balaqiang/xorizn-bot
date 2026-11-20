const TZ = 'Asia/Jakarta'
const f = (d) => d.toLocaleString('id-ID', { timeZone: TZ, dateStyle: 'full', timeStyle: 'medium' })
module.exports = {
  name: 'epoch', command: ['epoch', 'timestamp', 'unixtime'], category: 'tools', emoji: '🕰️', desc: 'Konversi Unix timestamp <-> tanggal', usage: '[timestamp | yyyy-mm-dd [hh:mm]]',
  run: async ({ args, prefix, reply }) => {
    const a = args.join(' ').trim()
    if (!a) { const n = new Date(); return reply(`🕰️ *EPOCH*\n\n▬ *Sekarang:* ${f(n)}\n▬ *Detik:* ${Math.floor(n / 1000)}\n▬ *Milidetik:* ${n.getTime()}\n▬ *ISO:* ${n.toISOString()}`) }
    let d
    if (/^\d{9,13}$/.test(a)) d = new Date(a.length <= 10 ? Number(a) * 1000 : Number(a))
    else { const m = a.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2}))?$/); if (m) d = new Date(`${m[1]}-${m[2]}-${m[3]}T${String(m[4] || '0').padStart(2, '0')}:${m[5] || '00'}:00+07:00`) }
    if (!d || isNaN(d)) return reply(`Format salah.\nContoh: ${prefix}epoch 1700000000\nContoh: ${prefix}epoch 2025-12-31 23:59`)
    await reply(`🕰️ *EPOCH*\n\n▬ *WIB:* ${f(d)}\n▬ *Detik:* ${Math.floor(d / 1000)}\n▬ *Milidetik:* ${d.getTime()}\n▬ *ISO (UTC):* ${d.toISOString()}`)
  }
}
