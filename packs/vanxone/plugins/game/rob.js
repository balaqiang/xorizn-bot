const { getUser, save, rp, rand, duration, cooldown } = require('../../lib/game')
const { getTargets, isBot, userOf, sameUser } = require('../../lib/utils')

const HOUR = 60 * 60 * 1000

module.exports = {
  name: 'rob',
  command: ['rob', 'rampok', 'maling'],
  category: 'game',
  desc: 'Coba curi money member lain (cooldown 1 jam, berisiko)',
  usage: '@user',
  run: async ({ sock, msg, from, sender, args, prefix, reply }) => {
    const target = getTargets(msg, args).find((j) => !isBot(sock, j))
    if (!target) return reply(`Tag atau reply korbanmu.\nContoh: ${prefix}rob @user`)
    if (sameUser(target, sender)) return reply('Mau mencuri dari diri sendiri? 😅')

    const me = getUser(sender)
    const left = cooldown(me, 'lastRob', HOUR)
    if (left) return reply(`Polisi masih berpatroli. Coba lagi dalam ${duration(left)}.`)
    if (me.money < 20000) return reply('Kamu butuh minimal Rp20.000 di dompet sebagai modal (dipakai untuk denda kalau gagal).')

    const victim = getUser(target)
    if (victim.money < 20000) return reply('Korbannya miskin, dompetnya hampir kosong. Cari target lain!')

    me.lastRob = Date.now()
    const tag = `@${userOf(target)}`
    if (rand(1, 100) <= 45) {
      const loot = Math.min(Math.floor(victim.money * (rand(5, 25) / 100)), 500000)
      victim.money -= loot
      me.money += loot
      save()
      return sock.sendMessage(from, { text: `🦹 Berhasil! Kamu mencuri *${rp(loot)}* dari ${tag}.`, mentions: [target] }, { quoted: msg })
    }

    const fine = Math.min(Math.floor(me.money * (rand(5, 15) / 100)) + 5000, me.money)
    me.money -= fine
    save()
    await sock.sendMessage(from, { text: `🚓 Kamu tertangkap saat mencoba mencuri dari ${tag}! Denda *${rp(fine)}*.`, mentions: [target] }, { quoted: msg })
  }
}
