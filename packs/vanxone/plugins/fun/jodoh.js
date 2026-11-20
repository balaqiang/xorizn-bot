const crypto = require('crypto')
const { getTargets, userOf } = require('../../lib/utils')

const verdict = (p) =>
  p >= 90 ? 'Jodoh banget! 💍' : p >= 70 ? 'Cocok nih, gas! 💕' : p >= 50 ? 'Lumayan, perlu usaha 😊' : p >= 30 ? 'Hmm, agak berat 😅' : 'Mending temenan aja 😬'

module.exports = {
  name: 'jodoh',
  command: ['jodoh', 'cocok', 'ship'],
  category: 'fun',
  desc: 'Cek kecocokan dua orang (hiburan)',
  usage: '@user1 [@user2]',
  run: async ({ sock, msg, from, sender, args, prefix, reply }) => {
    const t = getTargets(msg, args)
    const [a, b] = t.length >= 2 ? t : [sender, t[0]]
    if (!b) return reply(`Tag orangnya.\nContoh: ${prefix}jodoh @user atau ${prefix}jodoh @user1 @user2`)

    // hasil konsisten untuk pasangan yang sama
    const key = [userOf(a), userOf(b)].sort().join(':')
    const p = crypto.createHash('md5').update(key).digest().readUInt16BE(0) % 101
    const bar = '❤️'.repeat(Math.round(p / 10)) + '🖤'.repeat(10 - Math.round(p / 10))
    await sock.sendMessage(
      from,
      { text: `💘 *KECOCOKAN*\n\n@${userOf(a)} ❤ @${userOf(b)}\n\n${bar}\n*${p}%* — ${verdict(p)}`, mentions: [a, b] },
      { quoted: msg }
    )
  }
}
