const { zodiac } = require('../tools/zodiak')

const SIGNS = ['aquarius', 'pisces', 'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagitarius', 'capricorn']
const LOVE = ['Obrolan ringan hari ini bisa jadi awal kedekatan.', 'Dengarkan lebih banyak, bicara secukupnya.', 'Tunjukkan perhatian lewat hal kecil.', 'Hindari baper berlebihan, nikmati prosesnya.', 'Kejujuran membuat hubungan lebih tenang.']
const WORK = ['Fokus satu tugas dulu, jangan semuanya sekaligus.', 'Ide lamamu layak dicoba lagi.', 'Kerja sama tim membawa hasil lebih baik.', 'Catat target kecil dan selesaikan satu per satu.', 'Jangan ragu bertanya kalau belum paham.']
const MONEY = ['Tahan dulu belanja impulsif.', 'Ada peluang rezeki kecil, syukuri.', 'Rapikan catatan pengeluaranmu.', 'Menabung sedikit tapi rutin lebih baik.', 'Pertimbangkan dua kali sebelum meminjam.']
const TIPS = ['Minum air yang cukup.', 'Jangan lupa istirahat.', 'Rapikan meja kerjamu.', 'Telepon orang yang kamu sayang.', 'Jalan kaki sebentar hari ini.']

// Acak deterministik: tanda + tanggal yang sama = ramalan yang sama sepanjang hari
function seeded(seed) {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) / 4294967296)
}
const stars = (r) => '⭐'.repeat(1 + Math.floor(r() * 5))

module.exports = {
  name: 'ramalan',
  command: ['ramalan', 'horoskop'],
  category: 'fun',
  desc: 'Ramalan harian per zodiak (hiburan)',
  usage: '<zodiak | tgl-bln>',
  run: async ({ args, prefix, reply }) => {
    const raw = (args[0] || '').toLowerCase()
    let sign = SIGNS.find((s) => s === raw || (raw.length >= 3 && s.startsWith(raw)))
    const dm = raw.match(/^(\d{1,2})[-/.](\d{1,2})/)
    if (!sign && dm) sign = zodiac(Number(dm[2]), Number(dm[1]))[2].toLowerCase()
    if (!sign) return reply(`Masukkan zodiak atau tanggal lahir.\nContoh: ${prefix}ramalan leo  atau  ${prefix}ramalan 17-08\nZodiak: ${SIGNS.join(', ')}`)

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
    const r = seeded(`${sign}-${today}`)
    const pick = (a) => a[Math.floor(r() * a.length)]
    await reply(
      [
        `🔮 *RAMALAN ${sign.toUpperCase()}*`,
        `_${new Date().toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'long', day: 'numeric', month: 'long' })}_`,
        '',
        `💘 Cinta ${stars(r)}\n${pick(LOVE)}`,
        '',
        `💼 Karier ${stars(r)}\n${pick(WORK)}`,
        '',
        `💰 Keuangan ${stars(r)}\n${pick(MONEY)}`,
        '',
        `🍀 Angka keberuntungan: ${Math.floor(r() * 99) + 1}`,
        `💡 Saran: ${pick(TIPS)}`,
        '',
        '_Hanya hiburan, bukan ramalan sungguhan._'
      ].join('\n')
    )
  }
}
