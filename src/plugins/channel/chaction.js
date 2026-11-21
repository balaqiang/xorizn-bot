// .chfollow / .chunfollow / .chmute / .chunmute — ikuti, berhenti ikuti, bisukan saluran
const ch = require('../../lib/channels')

const ACT = {
  chfollow: ['newsletterFollow', 'Sekarang mengikuti saluran'],
  ikutich: ['newsletterFollow', 'Sekarang mengikuti saluran'],
  chunfollow: ['newsletterUnfollow', 'Berhenti mengikuti saluran'],
  keluarch: ['newsletterUnfollow', 'Berhenti mengikuti saluran'],
  chmute: ['newsletterMute', 'Saluran dibisukan'],
  chunmute: ['newsletterUnmute', 'Bisu saluran dibuka']
}

module.exports = {
  name: 'chaction',
  command: Object.keys(ACT),
  category: 'channel',
  emoji: '🔔',
  desc: 'Ikuti / berhenti ikuti / bisukan saluran',
  usage: '<link saluran>',
  owner: true,
  run: async ({ sock, command, body, prefix, reply }) => {
    const [fn, ok] = ACT[command]
    const raw = String(body || '').replace(/^\S+\s*/, '')
    try {
      ch.need(sock, fn)
      const t = await ch.pickTarget(sock, raw)
      await sock[fn](t.id)
      await reply(`✅ ${ok}: *${t.name}*`)
    } catch (err) {
      console.log(`[CH] ${command}:`, err.message)
      await reply(`❌ ${ch.explain(err)}${/Belum ada saluran/.test(String(err.message)) ? '' : `\nContoh: ${prefix}${command} <link saluran>`}`)
    }
  }
}
