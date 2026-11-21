const { pick } = require('../../lib/game')
const { getTargets, userOf } = require('../../lib/utils')

const LIST = [
  'Kucing Oren Sakti', 'Sandal Jepit Hijau', 'Nasi Padang Bungkus Extra Rendang', 'Rice Cooker Tanpa Colokan',
  'Kambing Berdasi', 'Ayam Geprek Level 5', 'Naga Wifi Tetangga', 'Kulkas Dua Pintu Berjalan', 'Tuyul Pensiun',
  'Macan Cisewu Kerja Remote', 'Bebek Karet Pemberani', 'Genteng Bocor Setia', 'Kopi Sachet Legendaris', 'Motor Vario Tanpa Rem'
]

module.exports = {
  name: 'khodam',
  command: ['khodam', 'cekkhodam'],
  category: 'fun',
  desc: 'Cek khodam kamu (hiburan)',
  usage: '[@user]',
  run: async ({ sock, msg, from, sender, args }) => {
    const target = getTargets(msg, args)[0] || sender
    await sock.sendMessage(from, { text: `🔮 Khodam @${userOf(target)} adalah:\n*${pick(LIST)}*\n\n_Hanya hiburan ya!_`, mentions: [target] }, { quoted: msg })
  }
}
