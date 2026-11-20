const axios = require('axios')

module.exports = {
  name: 'sholat',
  command: ['sholat', 'jadwalsholat'],
  category: 'tools',
  desc: 'Jadwal sholat hari ini (data Kemenag via Aladhan)',
  usage: '<kota>',
  run: async ({ text, prefix, reply }) => {
    if (!text) return reply(`Contoh: ${prefix}sholat Jakarta`)

    try {
      const { data } = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
        params: { city: text, country: 'Indonesia', method: 20 },
        timeout: 15000
      })
      const t = data?.data?.timings
      if (!t) throw new Error('kosong')
      await reply(
        [
          `*JADWAL SHOLAT ${text.toUpperCase()}*`,
          data.data.date?.readable || '',
          '',
          `▬ *Subuh:* ${t.Fajr}`,
          `▬ *Terbit:* ${t.Sunrise}`,
          `▬ *Dzuhur:* ${t.Dhuhr}`,
          `▬ *Ashar:* ${t.Asr}`,
          `▬ *Maghrib:* ${t.Maghrib}`,
          `▬ *Isya:* ${t.Isha}`
        ].join('\n')
      )
    } catch {
      await reply(`Jadwal untuk "${text}" tidak ditemukan. Coba nama kota/kabupaten lain.`)
    }
  }
}
