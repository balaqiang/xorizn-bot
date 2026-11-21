// .cekbaileys — versi Baileys & fungsi yang didukung (diagnosis cepat)
const compat = require('../../lib/compat')
const { panel } = require('../../lib/uitext')

module.exports = {
  name: 'cekbaileys',
  command: ['cekbaileys', 'baileys', 'cekkompat'],
  category: 'info',
  emoji: '🧬',
  desc: 'Versi Baileys & fitur WhatsApp yang didukung',
  run: async ({ sock, reply }) => {
    const r = compat.report(sock)
    const bad = r.items.filter((i) => !i.ok)
    await reply(
      panel('CEK BAILEYS', [
        { head: '🧬 *VERSI*', lines: [`Paket : ${r.version}`, `Node : ${r.node}`] },
        { head: '✅ *DUKUNGAN FITUR*', lines: r.items.map((i) => `${i.ok ? '✅' : '❌'} ${i.label}`) },
        bad.length && { head: '⚠️ *YANG KURANG*', lines: bad.map((i) => `${i.label}: ${i.missing.join(', ')}`) }
      ].filter(Boolean), { tip: bad.length ? '💡 Update: npm i @whiskeysockets/baileys@latest lalu restart bot. Fitur yang kurang akan memberi pesan jelas, bukan crash.' : '💡 Semua fungsi yang dipakai bot tersedia.' })
    )
  }
}
