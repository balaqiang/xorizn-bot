// Hook: setelah bot terhubung, lanjutkan pemantauan tagihan QRIS & pesanan nomor virtual yang masih menunggu (juga setelah restart / pm2 reload)
const AP = require('../../lib/autopay')
const NK = require('../../lib/aonokos')

module.exports = {
  name: 'autopay-hook',
  hook: true,
  init(sock) {
    AP.resume(sock)
    NK.resume(sock)
  }
}
