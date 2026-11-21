module.exports = {
  name: 'poll',
  command: ['poll', 'polling', 'vote'],
  category: 'tools',
  desc: 'Buat polling WhatsApp (tambah -m untuk pilihan ganda)',
  usage: '[-m] <pertanyaan> | <opsi1> | <opsi2> | ...',
  run: async ({ sock, msg, from, text, prefix, reply }) => {
    let raw = text.trim()
    let multi = false
    if (/^-m\b/i.test(raw)) {
      multi = true
      raw = raw.slice(2).trim()
    }

    const parts = raw.split('|').map((s) => s.trim()).filter(Boolean)
    const [name, ...options] = parts
    if (!name || options.length < 2) {
      return reply(`Format: ${prefix}poll <pertanyaan> | <opsi1> | <opsi2> | ...\nContoh: ${prefix}poll Makan apa? | Nasi goreng | Mie ayam | Bakso\nPilihan ganda: ${prefix}poll -m Hobi? | Game | Musik | Olahraga`)
    }
    const values = [...new Set(options.map((o) => o.slice(0, 100)))]
    if (values.length < 2) return reply('Minimal 2 opsi yang berbeda.')
    if (values.length > 12) return reply('Maksimal 12 opsi.')

    await sock.sendMessage(from, { poll: { name: name.slice(0, 200), values, selectableCount: multi ? values.length : 1 } }, { quoted: msg })
  }
}
