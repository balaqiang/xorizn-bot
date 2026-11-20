// Kumpulan "cek" hiburan: hasil konsisten per orang per hari (seed), tampil dengan bar
const { dayRand, bar, pick, targetOf, userOf } = require('../../lib/fx')

const ITEMS = {
  cekiq: { ic: '🧠', t: 'IQ', unit: '', min: 60, max: 180, line: (v) => (v > 140 ? 'Jenius sejati! 🤯' : v > 110 ? 'Di atas rata-rata 😎' : v > 90 ? 'Normal, stabil 👍' : 'Masih bisa belajar lagi 😅'), scale: [60, 180] },
  cekrezeki: { ic: '💸', t: 'REZEKI HARI INI', unit: '%', min: 10, max: 100, line: (v) => (v > 80 ? 'Rezeki deras, siapin dompet! 🤑' : v > 50 ? 'Cukup lancar 👌' : 'Pelan-pelan, tetap semangat 🌱') },
  cekmood: { ic: '🌈', t: 'MOOD HARI INI', unit: '%', min: 5, max: 100, line: (v) => (v > 80 ? 'Ceria banget! 😄' : v > 50 ? 'Biasa aja 🙂' : 'Butuh es krim 🍦') },
  cekcuan: { ic: '🤑', t: 'AURA SULTAN', unit: '%', min: 0, max: 100, line: (v) => (v > 80 ? 'Sultan Andara! 👑' : v > 40 ? 'Menengah ke atas 💼' : 'Sultan tanggal tua 🍜') },
  cekaura: { ic: '🔮', t: 'AURA HARI INI', unit: '%', min: 5, max: 100, line: (v) => (v > 80 ? 'Aura bersinar terang ✨' : v > 45 ? 'Aura stabil 🌤️' : 'Aura redup, butuh istirahat 🌙') },
  cekenergi: { ic: '⚡', t: 'ENERGI HARI INI', unit: '%', min: 5, max: 100, line: (v) => (v > 80 ? 'Siap tempur seharian 💪' : v > 45 ? 'Cukup bertenaga ☕' : 'Low battery, isi daya dulu 🔋') },
  cekkarisma: { ic: '👑', t: 'KARISMA', unit: '%', min: 10, max: 100, line: (v) => (v > 80 ? 'Magnet perhatian 🧲' : v > 45 ? 'Cukup berkarisma 🙂' : 'Kalem tapi dalam 🌊') }
}

module.exports = {
  name: 'cekmeter',
  command: Object.keys(ITEMS),
  category: 'fun',
  emoji: '📊',
  desc: 'Cek IQ, kecantikan, jomblo, rezeki, mood, hoki, dll (hiburan, hasil harian)',
  usage: '[@user]',
  run: async ({ sock, msg, from, sender, command, args }) => {
    const it = ITEMS[command]
    if (!it) return
    const t = targetOf(msg, args, sender)
    const v = dayRand(`${command}|${userOf(t)}`, it.min, it.max)
    const pct = it.scale ? Math.round(((v - it.scale[0]) / (it.scale[1] - it.scale[0])) * 100) : v
    const text = [
      `${it.ic} *CEK ${it.t}*`,
      '',
      `▬ *Nama:* @${userOf(t)}`,
      `▬ *Hasil:* ${v}${it.unit}`,
      `${bar(pct, 12)} ${pct}%`,
      '',
      `_${it.line(v)}_`,
      '_Hanya hiburan — hasil berubah setiap hari._'
    ].join('\n')
    await sock.sendMessage(from, { text, mentions: [t] }, { quoted: msg })
  }
}
