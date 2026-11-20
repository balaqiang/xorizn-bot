const SIGNS = [
  // [bulan, tanggal awal, nama, emoji, elemen, sifat]
  [1, 20, 'Aquarius', '♒', 'Udara', 'mandiri, kreatif, dan suka ide baru'],
  [2, 19, 'Pisces', '♓', 'Air', 'perasa, imajinatif, dan penuh empati'],
  [3, 21, 'Aries', '♈', 'Api', 'berani, energik, dan suka tantangan'],
  [4, 20, 'Taurus', '♉', 'Tanah', 'setia, sabar, dan menyukai kenyamanan'],
  [5, 21, 'Gemini', '♊', 'Udara', 'ramah, cepat belajar, dan pandai bicara'],
  [6, 21, 'Cancer', '♋', 'Air', 'penyayang, protektif, dan menghargai keluarga'],
  [7, 23, 'Leo', '♌', 'Api', 'percaya diri, murah hati, dan suka memimpin'],
  [8, 23, 'Virgo', '♍', 'Tanah', 'teliti, praktis, dan rapi'],
  [9, 23, 'Libra', '♎', 'Udara', 'adil, diplomatis, dan cinta harmoni'],
  [10, 23, 'Scorpio', '♏', 'Air', 'gigih, intuitif, dan penuh determinasi'],
  [11, 22, 'Sagitarius', '♐', 'Api', 'optimis, petualang, dan jujur'],
  [12, 22, 'Capricorn', '♑', 'Tanah', 'disiplin, bertanggung jawab, dan ambisius']
]
const SHIO = ['Tikus', 'Kerbau', 'Macan', 'Kelinci', 'Naga', 'Ular', 'Kuda', 'Kambing', 'Monyet', 'Ayam', 'Anjing', 'Babi']

function zodiac(month, day) {
  // tanda yang dimulai pada atau sebelum tanggal ini; sebelum 20 Januari = Capricorn
  let found = SIGNS[SIGNS.length - 1]
  for (const s of SIGNS) if (month > s[0] || (month === s[0] && day >= s[1])) found = s
  return found
}
const shioOf = (year) => SHIO[(((year - 4) % 12) + 12) % 12]

function parseDate(input) {
  const m = String(input).match(/^(\d{1,2})[-/. ](\d{1,2})(?:[-/. ](\d{4}))?$/)
  if (!m) return null
  const day = Number(m[1])
  const month = Number(m[2])
  const year = m[3] ? Number(m[3]) : null
  const probe = new Date(Date.UTC(year || 2000, month - 1, day))
  if (probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) return null
  return { day, month, year }
}

function age(y, m, d) {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
  let years = now.getFullYear() - y
  let months = now.getMonth() + 1 - m
  let days = now.getDate() - d
  if (days < 0) {
    months--
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }
  return { years, months, days }
}

module.exports = {
  zodiac,
  shioOf,
  name: 'zodiak',
  command: ['zodiak', 'zodiac', 'shio'],
  category: 'tools',
  desc: 'Cek zodiak & shio dari tanggal lahir',
  usage: '<tgl-bln[-tahun]>',
  run: async ({ args, prefix, reply }) => {
    const d = parseDate(args.join(' ').trim())
    if (!d) return reply(`Masukkan tanggal lahir.\nContoh: ${prefix}zodiak 17-08-2000\nTanpa tahun: ${prefix}zodiak 17-08`)

    const [, , name, icon, element, trait] = zodiac(d.month, d.day)
    const lines = ['*ZODIAK & SHIO*', '', `▬ *Zodiak:* ${icon} ${name} (elemen ${element})`, `▬ *Sifat umum:* ${trait}`]
    if (d.year) {
      lines.push(`▬ *Shio:* ${shioOf(d.year)}`)
      const a = age(d.year, d.month, d.day)
      if (a.years >= 0) lines.push(`▬ *Usia:* ${a.years} tahun ${a.months} bulan ${a.days} hari`)
      if (d.month <= 2) lines.push('', '_Catatan: shio mengikuti tahun Imlek, jadi kelahiran Januari-Februari bisa masuk shio tahun sebelumnya._')
    }
    lines.push('', '_Hiburan semata, bukan ramalan pasti._')
    await reply(lines.join('\n'))
  }
}
