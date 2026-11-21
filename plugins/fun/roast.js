const { pick, targetOf, userOf } = require('../../lib/fx')
const R = [
  'wifi di rumah kamu aja lebih stabil daripada keputusan hidupmu 📶',
  'kamu itu kayak update Windows: dateng pas lagi gak dibutuhin 🪟',
  'rencana kamu banyak, eksekusinya kayak sinyal di lift 📉',
  'katanya mau rajin, tapi kasur selalu menang 🛏️',
  'chat kamu centang dua biru tapi gak dibalas, tega banget 😭',
  'baterai kamu 1% tapi masih sempet main HP, mental baja 🔋',
  'janji "bentar lagi" kamu itu setara satu semester ⏳',
  'otak kamu kayak tab Chrome: kebanyakan kebuka, semuanya lemot 🧠',
  'kamu tuh tipe orang yang cek kulkas tiap 5 menit berharap ada isi baru 🧊',
  'alarm kamu bunyi 7 kali, kamu cuma bangun di yang ke-8 ⏰',
  'semangat kamu naik pas gajian, turun pas tanggal 20 📆',
  'kamu bilang diet, tapi gorengan selalu jadi pengecualian 🍤'
]
module.exports = {
  name: 'roast', command: ['roast', 'ejek'], category: 'fun', emoji: '🔥', desc: 'Roasting lucu (hiburan, tanpa menyakiti)', usage: '[@user]',
  run: async ({ sock, msg, from, sender, args }) => {
    const t = targetOf(msg, args, sender)
    await sock.sendMessage(from, { text: `🔥 *ROASTING TIME*\n\n@${userOf(t)}, ${pick(R)}\n\n_Cuma bercanda ya, jangan baper 😆_`, mentions: [t] }, { quoted: msg })
  }
}
