const FACT = [
  [1.2, 'Jarang olahraga (kerja duduk)'],
  [1.375, 'Olahraga ringan 1-3x/minggu'],
  [1.55, 'Olahraga sedang 3-5x/minggu'],
  [1.725, 'Olahraga berat 6-7x/minggu'],
  [1.9, 'Sangat aktif / kerja fisik berat']
]

module.exports = {
  name: 'kalori',
  command: ['kalori', 'bmr', 'tdee'],
  category: 'tools',
  desc: 'Estimasi kebutuhan kalori harian (BMR & TDEE)',
  usage: '<pria|wanita> <umur> <kg> <cm> <aktivitas 1-5>',
  run: async ({ args, prefix, reply }) => {
    const sex = { pria: 'm', cowok: 'm', laki: 'm', m: 'm', wanita: 'f', cewek: 'f', perempuan: 'f', f: 'f' }[(args[0] || '').toLowerCase()]
    const [age, kg, cm] = [args[1], args[2], args[3]].map((v) => Number(String(v || '').replace(',', '.')))
    const lvl = parseInt(args[4] || '2', 10)
    if (!sex || !(age >= 10 && age <= 100) || !(kg >= 20 && kg <= 300) || !(cm >= 100 && cm <= 250) || !(lvl >= 1 && lvl <= 5)) {
      return reply(
        `Format: ${prefix}kalori <pria|wanita> <umur> <kg> <cm> [aktivitas 1-5]\nContoh: ${prefix}kalori pria 25 65 170 3\n\nAktivitas:\n${FACT.map((f, i) => `${i + 1} = ${f[1]}`).join('\n')}`
      )
    }
    // Mifflin-St Jeor
    const bmr = 10 * kg + 6.25 * cm - 5 * age + (sex === 'm' ? 5 : -161)
    const tdee = bmr * FACT[lvl - 1][0]
    const r = (n) => Math.round(n).toLocaleString('id-ID')
    await reply(
      [
        '🔥 *KEBUTUHAN KALORI*',
        '',
        `▬ *BMR (istirahat):* ${r(bmr)} kkal`,
        `▬ *Aktivitas:* ${FACT[lvl - 1][1]}`,
        `▬ *TDEE (menjaga berat):* ${r(tdee)} kkal/hari`,
        '',
        `📉 Menurunkan berat pelan: ±${r(Math.max(tdee - 400, bmr))} kkal`,
        `📈 Menambah berat pelan : ±${r(tdee + 300)} kkal`,
        '',
        '_Estimasi rumus Mifflin-St Jeor, bukan resep diet. Konsultasikan ke ahli gizi/dokter untuk program khusus._'
      ].join('\n')
    )
  }
}
