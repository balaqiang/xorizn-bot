const axios = require('axios')
const { parseAmount } = require('../../lib/game')

module.exports = {
  name: 'kurs',
  command: ['kurs', 'currency'],
  category: 'tools',
  desc: 'Konversi mata uang',
  usage: '[jumlah] <dari> [ke]',
  run: async ({ args, prefix, reply }) => {
    const a = [...args]
    let amount = 1
    if (a[0] && /^[\d.,]+$/.test(a[0])) amount = Number(a.shift().replace(/\./g, '').replace(',', '.'))
    const from = (a[0] || '').toUpperCase()
    const to = (a[1] || 'IDR').toUpperCase()

    if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to) || !Number.isFinite(amount) || amount <= 0) {
      return reply(`Contoh:\n${prefix}kurs usd\n${prefix}kurs 100 usd idr\n${prefix}kurs 50000 idr jpy`)
    }

    try {
      const { data } = await axios.get(`https://open.er-api.com/v6/latest/${from}`, { timeout: 15000 })
      const rate = data?.rates?.[to]
      if (data?.result !== 'success' || !rate) return reply('Kode mata uang tidak dikenali.')
      const f = (n) => n.toLocaleString('id-ID', { maximumFractionDigits: 4 })
      await reply(
        [
          '*KONVERSI MATA UANG*',
          '',
          `▬ *Hasil:* ${f(amount)} ${from} = *${f(amount * rate)} ${to}*`,
          `▬ *Kurs:* 1 ${from} = ${f(rate)} ${to}`,
          data.time_last_update_utc ? `▬ *Update:* ${data.time_last_update_utc}` : ''
        ]
          .filter(Boolean)
          .join('\n')
      )
    } catch {
      await reply('Gagal mengambil kurs. Coba lagi nanti.')
    }
  }
}
