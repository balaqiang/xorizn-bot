const { getTargets, userOf } = require('../../lib/utils')

const TRAITS = ['Humoris', 'Pekerja keras', 'Suka tidur', 'Setia kawan', 'Pelupa', 'Perfeksionis', 'Santai', 'Penolong', 'Kreatif', 'Pemalu tapi hangat', 'Suka makan', 'Penyabar', 'Spontan', 'Pendengar yang baik', 'Suka rebahan', 'Tukang telat', 'Pencinta kucing', 'Penjelajah']
const seeded = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) / 4294967296) }

module.exports = {
  name: 'sifat',
  command: ['sifat', 'ceksifat', 'kepribadian'],
  category: 'fun',
  desc: 'Cek sifat seseorang (hiburan, tetap sama untuk orang yang sama)',
  usage: '[@user | nama]',
  run: async ({ sock, msg, sender, args, reply }) => {
    const target = getTargets(msg, args)[0]
    const label = target ? `@${userOf(target)}` : args.join(' ').trim() || `@${userOf(sender)}`
    const key = (target ? userOf(target) : args.join(' ').trim().toLowerCase() || userOf(sender))
    const r = seeded(`sifat-${key}`)
    const pool = [...TRAITS]
    const chosen = [0, 1, 2].map(() => pool.splice(Math.floor(r() * pool.length), 1)[0])
    const pct = (n) => Math.floor(r() * 61) + 40
    const text = [`🧬 *SIFAT ${label.toUpperCase()}*`, '', ...chosen.map((t) => `• ${t} — ${pct()}%`), '', '_Hanya hiburan 😄_'].join('\n')
    const mentions = target ? [target] : label.startsWith('@') ? [sender] : []
    await sock.sendMessage(msg.key.remoteJid, { text, mentions }, { quoted: msg })
  }
}
