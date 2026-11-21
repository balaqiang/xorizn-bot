const axios = require('axios')

const ALIAS = {
  btc: 'bitcoin', eth: 'ethereum', bnb: 'binancecoin', sol: 'solana', xrp: 'ripple', ada: 'cardano',
  doge: 'dogecoin', usdt: 'tether', ton: 'the-open-network', trx: 'tron', dot: 'polkadot', ltc: 'litecoin',
  matic: 'matic-network', shib: 'shiba-inu', avax: 'avalanche-2', link: 'chainlink'
}

module.exports = {
  name: 'crypto',
  command: ['crypto', 'kripto'],
  category: 'tools',
  desc: 'Harga kripto (IDR & USD)',
  usage: '<btc/eth/sol/...>',
  run: async ({ args, prefix, reply }) => {
    const q = (args[0] || '').toLowerCase()
    if (!q) return reply(`Contoh: ${prefix}crypto btc\nBisa juga pakai nama: ${prefix}crypto dogecoin`)
    const id = ALIAS[q] || q

    try {
      const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: { ids: id, vs_currencies: 'idr,usd', include_24hr_change: true, include_market_cap: true },
        timeout: 15000
      })
      const c = data?.[id]
      if (!c) return reply(`Koin "${q}" tidak ditemukan.`)
      const ch = c.idr_24h_change ?? c.usd_24h_change ?? 0
      await reply(
        [
          `*${id.toUpperCase()}*`,
          '',
          `▬ *IDR:* Rp${Number(c.idr).toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
          `▬ *USD:* $${Number(c.usd).toLocaleString('en-US', { maximumFractionDigits: 6 })}`,
          `▬ *24 jam:* ${ch >= 0 ? '📈 +' : '📉 '}${ch.toFixed(2)}%`,
          c.usd_market_cap ? `▬ *Market cap:* $${Math.round(c.usd_market_cap).toLocaleString('en-US')}` : ''
        ]
          .filter(Boolean)
          .join('\n')
      )
    } catch (err) {
      await reply(err.response?.status === 429 ? 'Terlalu banyak permintaan, coba lagi sebentar lagi.' : 'Gagal mengambil harga. Coba lagi nanti.')
    }
  }
}
