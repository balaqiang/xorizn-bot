// .uimode — ganti tampilan bot: text (balasan teks) / rich (UI kartu HTML)
const uimode = require('../../lib/uimode')
const { panel } = require('../../lib/uitext')

const NAMES = { text: 'TEXT — balasan teks biasa', rich: 'RICH — UI kartu HTML' }

module.exports = {
  name: 'uimode',
  command: ['uimode', 'tampilan', 'setui', 'ui'],
  category: 'owner',
  emoji: '🎛️',
  desc: 'Ganti tampilan bot: text (teks biasa) atau rich (UI kartu)',
  usage: 'text | rich',
  owner: true,
  run: async ({ args, prefix, reply }) => {
    const want = args[0]
    if (!want) {
      return reply(
        panel('TAMPILAN BOT', [
          { head: '🎛️ *MODE SAAT INI*', lines: [NAMES[uimode.get()]] },
          { head: '📖 *CARA PAKAI*', lines: [`${prefix}uimode text → balasan teks biasa (menu & tombol ZeroTwo)`, `${prefix}uimode rich → UI kartu HTML (menu interaktif + tombol salin)`] }
        ])
      )
    }
    const m = uimode.set(want)
    if (!m) return reply(`Pilihan tidak dikenal "${want}".\nGunakan: ${prefix}uimode text  atau  ${prefix}uimode rich`)
    return reply(
      panel('TAMPILAN DIUBAH', [
        { head: '✅ *MODE AKTIF*', lines: [NAMES[m]] },
        { head: '💡 *LANGKAH BERIKUT*', lines: [`Ketik ${prefix}menu untuk melihat hasilnya`, 'Berlaku langsung, tanpa restart bot'] }
      ])
    )
  }
}
