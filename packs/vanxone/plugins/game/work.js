const { getUser, save, rp, rand, pick, duration, cooldown } = require('../../lib/game')

const HOUR = 60 * 60 * 1000
const JOBS = ['kuli bangunan', 'driver ojek online', 'barista', 'kurir paket', 'penjaga warnet', 'tukang parkir', 'freelance desainer', 'penjual gorengan']

module.exports = {
  name: 'work',
  command: ['work', 'kerja'],
  category: 'game',
  desc: 'Kerja untuk dapat money (cooldown 1 jam)',
  run: async ({ sender, reply }) => {
    const u = getUser(sender)
    const left = cooldown(u, 'lastWork', HOUR)
    if (left) return reply(`Kamu masih capek. Istirahat ${duration(left)} lagi.`)

    const earn = rand(5000, 25000)
    u.money += earn
    u.exp += 1000
    u.lastWork = Date.now()
    save()
    await reply(`Kamu bekerja sebagai ${pick(JOBS)} dan dapat ${rp(earn)}.`)
  }
}
