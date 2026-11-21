// Hook sewa: cek kedaluwarsa berkala (keluar otomatis bila sewamode ON) + mode tidur
const S = require('../../lib/engine/lumen_sewa')
let timer = null

async function sweep(sock) {
  const now = Date.now()
  for (const [jid, g] of Object.entries(S.st.data.groups)) {
    const left = g.until - now
    if (left <= 0) {
      if (S.st.data.mode && !g.left) {
        g.left = true; S.st.save()
        await sock.sendMessage(jid, { text: '⏰ Masa sewa bot di grup ini telah *berakhir*. Terima kasih sudah memakai layanan! Hubungi owner untuk memperpanjang.' }).catch(() => {})
        await new Promise((r) => setTimeout(r, 1500))
        await sock.groupLeave(jid).catch(() => {})
      }
    } else if (left < 3 * 86400000 && !g.warned) {
      g.warned = true; S.st.save()
      await sock.sendMessage(jid, { text: `⏳ Masa sewa bot di grup ini tinggal *${S.days(left)} hari*. Hubungi owner untuk perpanjang.` }).catch(() => {})
    }
  }
}
module.exports = {
  name: 'anya-sewa-hook',
  hook: true,
  init: (sock) => { clearInterval(timer); timer = setInterval(() => sweep(sock).catch(() => {}), 30 * 60 * 1000); if (timer.unref) timer.unref(); setTimeout(() => sweep(sock).catch(() => {}), 20000) },
  passive: async ({ body, prefix, isOwner }) => !isOwner && S.sleeping() && body.startsWith(prefix)
}
