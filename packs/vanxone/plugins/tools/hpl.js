module.exports = {
  name: 'hpl', command: ['hpl', 'taksiranlahir', 'kehamilan'], category: 'tools', emoji: '🤰', desc: 'Hitung perkiraan hari lahir (Naegele) dari HPHT', usage: '<dd-mm-yyyy>',
  run: async ({ args, prefix, reply }) => {
    const m = String(args[0] || '').match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/)
    if (!m) return reply(`Contoh: ${prefix}hpl 15-01-2026 (tanggal Hari Pertama Haid Terakhir)`)
    const d = new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]))
    if (isNaN(d) || d.getUTCDate() !== +m[1]) return reply('Tanggal tidak valid.')
    const hpl = new Date(d.getTime() + 280 * 864e5)
    const now = new Date(); const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    const days = Math.floor((today - d.getTime()) / 864e5)
    const f = (x) => new Date(x).toLocaleDateString('id-ID', { dateStyle: 'full', timeZone: 'UTC' })
    const info = days < 0 ? '⚠️ HPHT berada di masa depan' : days > 300 ? '⚠️ Lebih dari 42 minggu, konsultasikan ke dokter' : `Usia kehamilan ±${Math.floor(days / 7)} minggu ${days % 7} hari`
    await reply(`🤰 *HPL (NAEGELE)*\n\n▬ *HPHT:* ${f(d)}\n▬ *HPL:* ${f(hpl)}\n▬ *Trimester 2 mulai:* ${f(d.getTime() + 13 * 7 * 864e5)}\n▬ *Trimester 3 mulai:* ${f(d.getTime() + 28 * 7 * 864e5)}\n▬ *Sisa hari:* ${Math.max(0, Math.ceil((hpl.getTime() - today) / 864e5))}\n▬ *Saat ini:* ${info}\n\n_Perkiraan umum, bukan diagnosis. Selalu konsultasikan ke bidan/dokter._`)
  }
}
