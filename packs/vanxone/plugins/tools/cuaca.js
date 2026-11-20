const axios = require('axios')
const { describe } = require('../../lib/weather')

module.exports = {
  name: 'cuaca',
  command: ['cuaca', 'weather'],
  category: 'tools',
  desc: 'Cek cuaca suatu kota',
  usage: '<kota>',
  run: async ({ text, prefix, reply }) => {
    if (!text) return reply(`Contoh: ${prefix}cuaca Bandung`)

    try {
      const geo = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: { name: text, count: 1, language: 'id' },
        timeout: 10000
      })
      const place = geo.data?.results?.[0]
      if (!place) return reply(`Kota "${text}" tidak ditemukan.`)

      const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: place.latitude,
          longitude: place.longitude,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
          timezone: 'auto'
        },
        timeout: 10000
      })
      const c = data.current
      await reply(
        [
          `*CUACA ${place.name.toUpperCase()}*${place.admin1 ? `, ${place.admin1}` : ''}${place.country ? `, ${place.country}` : ''}`,
          '',
          `▬ *Kondisi:* ${describe(c.weather_code)}`,
          `▬ *Suhu:* ${c.temperature_2m}°C (terasa ${c.apparent_temperature}°C)`,
          `▬ *Kelembapan:* ${c.relative_humidity_2m}%`,
          `▬ *Angin:* ${c.wind_speed_10m} km/jam`
        ].join('\n')
      )
    } catch {
      await reply('Gagal mengambil data cuaca. Coba lagi nanti.')
    }
  }
}
