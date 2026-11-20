// Hook: mencabut premium sementara yang sudah habis (cek tiap menit + saat user mengirim pesan)
const px = require('../../lib/premx')

let timer = null
module.exports = {
  name: 'prem-extra-hook',
  hook: true,
  init(sock) {
    if (timer) clearInterval(timer)
    const run = async () => {
      for (const u of px.sweep()) {
        sock.sendMessage(`${u}@s.whatsapp.net`, { text: '⭐ Masa premium kamu sudah habis. Terima kasih sudah memakai! Hubungi owner untuk perpanjang.' }).catch(() => {})
      }
    }
    timer = setInterval(run, 60000)
    if (timer.unref) timer.unref()
    run()
  },
  passive({ sender }) {
    const t = px.st.data.exp[px.id(sender)]
    if (t && t <= Date.now()) px.sweep()
    return false
  }
}
