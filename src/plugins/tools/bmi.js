function categoryOf(bmi) {
  if (bmi < 18.5) return 'Berat badan kurang'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Berat badan berlebih'
  return 'Obesitas'
}

module.exports = {
  categoryOf,
  name: 'bmi',
  command: ['bmi', 'imt'],
  category: 'tools',
  desc: 'Hitung indeks massa tubuh (berat kg, tinggi cm)',
  usage: '<berat kg> <tinggi cm>',
  run: async ({ args, prefix, reply }) => {
    const kg = Number(String(args[0] || '').replace(',', '.'))
    const cm = Number(String(args[1] || '').replace(',', '.'))
    if (!(kg >= 10 && kg <= 400) || !(cm >= 80 && cm <= 250)) {
      return reply(`Masukkan berat (kg) dan tinggi (cm).\nContoh: ${prefix}bmi 65 170`)
    }
    const m = cm / 100
    const bmi = kg / (m * m)
    const low = 18.5 * m * m
    const high = 24.9 * m * m
    await reply(
      [
        '*BMI / IMT*',
        '',
        `▬ *Berat:* ${kg} kg`,
        `▬ *Tinggi:* ${cm} cm`,
        `▬ *BMI:* ${bmi.toFixed(1)}`,
        `▬ *Kategori:* ${categoryOf(bmi)}`,
        `▬ *Berat ideal (BMI normal):* ${low.toFixed(1)} - ${high.toFixed(1)} kg`,
        '',
        '_Hanya perkiraan umum (kategori WHO), bukan diagnosis. Konsultasikan ke tenaga kesehatan untuk penilaian yang tepat._'
      ].join('\n')
    )
  }
}
