// Generator: lorem ipsum & nama acak Indonesia
const { panel } = require('../../lib/uitext')

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ')
const PRIA = ['Budi', 'Agus', 'Andi', 'Bambang', 'Dedi', 'Eko', 'Fajar', 'Gilang', 'Hendra', 'Indra', 'Joko', 'Kurniawan', 'Lukman', 'Made', 'Naufal', 'Oki', 'Putra', 'Rizky', 'Satria', 'Teguh', 'Wahyu', 'Yoga', 'Zainal', 'Arif', 'Bayu', 'Dimas', 'Fikri', 'Galih', 'Haikal', 'Iqbal']
const WANITA = ['Siti', 'Dewi', 'Ayu', 'Rina', 'Sari', 'Wulan', 'Putri', 'Intan', 'Lestari', 'Maya', 'Nur', 'Ratna', 'Sinta', 'Tika', 'Utami', 'Vina', 'Yuni', 'Anisa', 'Bunga', 'Citra', 'Dian', 'Eka', 'Fitri', 'Gita', 'Hana', 'Indah', 'Jihan', 'Kartika', 'Laras', 'Mega']
const BELAKANG = ['Saputra', 'Wijaya', 'Pratama', 'Santoso', 'Hidayat', 'Nugroho', 'Kusuma', 'Setiawan', 'Rahmawati', 'Permana', 'Utomo', 'Lestari', 'Hartono', 'Susanto', 'Firmansyah', 'Ramadhan', 'Anggraini', 'Maulana', 'Purnama', 'Siregar', 'Nasution', 'Simanjuntak', 'Hutagalung', 'Lubis', 'Pane', 'Wibowo', 'Kurniawan', 'Gunawan', 'Halim', 'Suryadi']
const rnd = (a) => a[Math.floor(Math.random() * a.length)]

function sentence() {
  const n = 6 + Math.floor(Math.random() * 9)
  const w = Array.from({ length: n }, () => rnd(WORDS))
  return `${w[0][0].toUpperCase()}${w[0].slice(1)} ${w.slice(1).join(' ')}.`
}

module.exports = {
  name: 'generator',
  command: ['lorem', 'namaindo'],
  category: 'tools',
  emoji: '🎰',
  desc: 'Generator lorem ipsum dan nama acak Indonesia',
  usage: 'lorem [jumlah kalimat | 2p] | namaindo [jumlah] [pria|wanita]',
  run: async ({ command, args, prefix, reply }) => {
    if (command === 'lorem') {
      const a = (args[0] || '3').toLowerCase()
      const m = a.match(/^(\d{1,2})(p|par|paragraf)?$/)
      if (!m || Number(m[1]) < 1) return reply(`Contoh: ${prefix}lorem 5  (5 kalimat)  •  ${prefix}lorem 2p  (2 paragraf)`)
      if (m[2]) {
        const n = Math.min(Number(m[1]), 6)
        return reply(Array.from({ length: n }, () => Array.from({ length: 4 }, sentence).join(' ')).join('\n\n'))
      }
      return reply(Array.from({ length: Math.min(Number(m[1]), 20) }, sentence).join(' '))
    }
    const n = Math.min(Math.max(Number(args.find((x) => /^\d+$/.test(x))) || 5, 1), 15)
    const g = args.map((x) => x.toLowerCase()).find((x) => ['pria', 'wanita'].includes(x))
    const names = Array.from({ length: n }, () => {
      const pool = g === 'pria' ? PRIA : g === 'wanita' ? WANITA : Math.random() < 0.5 ? PRIA : WANITA
      const two = Math.random() < 0.35
      return `${rnd(pool)} ${two ? `${rnd(pool === PRIA ? PRIA : WANITA)} ` : ''}${rnd(BELAKANG)}`.replace(/(\S+) \1/, '$1')
    })
    await reply(panel('NAMA ACAK', [{ head: `🎰 *${n} NAMA${g ? ` (${g})` : ''}*`, lines: names.map((x, i) => `${i + 1}. ${x}`), plain: true }]))
  }
}
module.exports.sentence = sentence
