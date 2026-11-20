module.exports = {
  name: 'cekpass', command: ['cekpass', 'passstrength', 'kekuatansandi'], category: 'tools', emoji: '🛡️', desc: 'Nilai kekuatan kata sandi (diproses lokal, tidak disimpan)', usage: '<sandi>',
  run: async ({ sock, msg, from, text, prefix, reply }) => {
    if (!text) return reply(`Contoh: ${prefix}cekpass Kuc1ng!Oren_88\n_Sebaiknya jangan mengetik sandi asli yang masih dipakai._`)
    const p = text; let pool = 0
    if (/[a-z]/.test(p)) pool += 26; if (/[A-Z]/.test(p)) pool += 26; if (/\d/.test(p)) pool += 10; if (/[^\w\s]/.test(p)) pool += 32; if (/\s/.test(p)) pool += 1
    const bits = Math.round(p.length * Math.log2(Math.max(pool, 2)))
    const common = /^(password|123456|qwerty|admin|iloveyou|12345678|abc123|111111|sandi|rahasia)/i.test(p)
    const score = common ? 5 : Math.min(100, Math.round((bits / 80) * 100))
    const lvl = score < 30 ? '🔴 Lemah' : score < 55 ? '🟠 Sedang' : score < 80 ? '🟡 Kuat' : '🟢 Sangat kuat'
    const tips = []
    if (p.length < 12) tips.push('Gunakan minimal 12 karakter'); if (!/[A-Z]/.test(p) || !/[a-z]/.test(p)) tips.push('Campur huruf besar & kecil'); if (!/\d/.test(p)) tips.push('Tambahkan angka'); if (!/[^\w\s]/.test(p)) tips.push('Tambahkan simbol'); if (common) tips.push('Terlalu umum / mudah ditebak')
    await reply(`🛡️ *KEKUATAN SANDI*\n\n▬ *Panjang:* ${p.length} karakter\n▬ *Entropi:* ±${bits} bit\n▬ *Penilaian:* ${lvl}\n${'▰'.repeat(Math.round(score / 8.33))}${'▱'.repeat(12 - Math.round(score / 8.33))} ${score}%\n${tips.length ? `\n💡 Saran:\n${tips.map((t) => `➥ ${t}`).join('\n')}` : '\n✅ Bagus!'}`)
  }
}
