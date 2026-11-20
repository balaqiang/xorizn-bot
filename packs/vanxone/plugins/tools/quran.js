const axios = require('axios')

const API = 'https://equran.id/api/v2/surat'
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '')

module.exports = {
  name: 'quran',
  command: ['quran', 'alquran', 'surah'],
  category: 'tools',
  desc: 'Baca Al-Quran (Arab, latin, terjemah)',
  usage: '<surah> [ayat | awal-akhir]',
  run: async ({ args, prefix, reply }) => {
    if (!args[0]) {
      return reply(`Contoh:\n${prefix}quran 1\n${prefix}quran 2 255\n${prefix}quran yasin 1-5\n${prefix}quran alfatihah`)
    }

    try {
      // surah bisa berupa nomor atau nama
      let number = /^\d+$/.test(args[0]) ? Number(args[0]) : 0
      let rest = args.slice(1)
      if (!number) {
        let name = norm(args[0])
        // nama dua kata, mis. "al baqarah"
        if (args[1] && !/^[\d-]+$/.test(args[1])) {
          name = norm(`${args[0]}${args[1]}`)
          rest = args.slice(2)
        }
        const list = (await axios.get(API, { timeout: 15000 })).data?.data || []
        const found = list.find((s) => norm(s.namaLatin) === name) || list.find((s) => norm(s.namaLatin).includes(name))
        if (!found) return reply(`Surah "${args[0]}" tidak ditemukan. Coba pakai nomor surah (1-114).`)
        number = found.nomor
      }
      if (number < 1 || number > 114) return reply('Nomor surah harus 1-114.')

      const s = (await axios.get(`${API}/${number}`, { timeout: 20000 })).data?.data
      if (!s?.ayat) throw new Error('kosong')

      const range = (rest[0] || '').match(/^(\d+)(?:-(\d+))?$/)
      let from = 1
      let to = Math.min(5, s.jumlahAyat)
      if (range) {
        from = Number(range[1])
        to = Number(range[2] || range[1])
      }
      if (from < 1 || from > s.jumlahAyat || to < from) return reply(`Surah ${s.namaLatin} hanya punya ${s.jumlahAyat} ayat.`)
      to = Math.min(to, s.jumlahAyat, from + 9) // maks 10 ayat per pesan

      const lines = [`*${s.namaLatin}* (${s.nama}) — ${s.arti}`, `${s.jumlahAyat} ayat • ${s.tempatTurun}`, '']
      for (const a of s.ayat.filter((x) => x.nomorAyat >= from && x.nomorAyat <= to)) {
        lines.push(`*${a.nomorAyat}.* ${a.teksArab}`, `_${a.teksLatin}_`, a.teksIndonesia, '')
      }
      if (to < s.jumlahAyat) lines.push(`Lanjut: ${prefix}quran ${number} ${to + 1}-${Math.min(to + 10, s.jumlahAyat)}`)
      await reply(lines.join('\n').trim())
    } catch {
      await reply('Gagal mengambil data Al-Quran. Coba lagi nanti.')
    }
  }
}
