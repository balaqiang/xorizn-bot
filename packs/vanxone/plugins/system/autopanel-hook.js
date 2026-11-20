// Hook: setelah bot terhubung, lanjutkan pemantauan order panel yang masih menunggu pembayaran (juga setelah restart / pm2 reload)
const AP = require('../../lib/autopanel')

module.exports = {
  name: 'autopanel-hook',
  hook: true,
  init(sock) {
    AP.resume(sock)
  }
}
