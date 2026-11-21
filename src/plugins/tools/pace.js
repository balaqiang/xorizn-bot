const t = (s) => `${Math.floor(s / 3600) ? Math.floor(s / 3600) + ':' : ''}${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(Math.round(s % 60)).padStart(2, '0')}`
module.exports = {
  name: 'pace', command: ['pace', 'lari', 'kecepatanlari'], category: 'tools', emoji: '🏃', desc: 'Hitung pace lari: jarak (km) + waktu (mm:ss atau jj:mm:ss)', usage: '<jarak km> <waktu>',
  run: async ({ args, prefix, reply }) => {
    const d = Number(String(args[0] || '').replace(',', '.'))
    const p = String(args[1] || '').split(':').map(Number)
    if (!(d > 0) || p.some((x) => !Number.isFinite(x)) || p.length < 2 || p.length > 3) return reply(`Contoh: ${prefix}pace 5 28:30\nContoh: ${prefix}pace 21.1 1:55:00`)
    const s = p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1]
    const pace = s / d
    await reply(`🏃 *PACE LARI*\n\n▬ *Jarak:* ${d} km\n▬ *Waktu:* ${t(s)}\n▬ *Pace:* ${t(pace)} /km\n▬ *Kecepatan:* ${((d / s) * 3600).toFixed(2)} km/jam\n\n*Prediksi dengan pace sama*\n➥ 5K: ${t(pace * 5)}\n➥ 10K: ${t(pace * 10)}\n➥ Half marathon: ${t(pace * 21.0975)}\n➥ Marathon: ${t(pace * 42.195)}`)
  }
}
