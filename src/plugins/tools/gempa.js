const axios = require('axios')

module.exports = {
  name: 'gempa',
  command: ['gempa', 'infogempa'],
  category: 'tools',
  desc: 'Info gempa terbaru (BMKG)',
  run: async ({ sock, msg, from, reply }) => {
    try {
      const { data } = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json', { timeout: 15000 })
      const g = data?.Infogempa?.gempa
      if (!g) throw new Error('kosong')

      const caption = [
        '*INFO GEMPA TERKINI*',
        '',
        `▬ *Waktu:* ${g.Tanggal}, ${g.Jam}`,
        `▬ *Magnitudo:* ${g.Magnitude}`,
        `▬ *Kedalaman:* ${g.Kedalaman}`,
        `▬ *Lokasi:* ${g.Coordinates}`,
        `▬ *Wilayah:* ${g.Wilayah}`,
        `▬ *Potensi:* ${g.Potensi}`,
        g.Dirasakan ? `▬ *Dirasakan:* ${g.Dirasakan}` : '',
        '',
        '_Sumber: BMKG_'
      ]
        .filter((l) => l !== undefined)
        .join('\n')

      if (g.Shakemap) {
        try {
          const img = await axios.get(`https://data.bmkg.go.id/DataMKG/TEWS/${g.Shakemap}`, { responseType: 'arraybuffer', timeout: 20000 })
          return await sock.sendMessage(from, { image: Buffer.from(img.data), caption }, { quoted: msg })
        } catch {}
      }
      await reply(caption)
    } catch {
      await reply('Gagal mengambil data BMKG. Coba lagi nanti.')
    }
  }
}
