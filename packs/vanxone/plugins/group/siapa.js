const { shuffle, pick, userOf } = require('../../lib/fx')
module.exports = {
  name: 'siapa', command: ['siapa', 'siapayang', 'randomtag', 'acakmember'], category: 'group', emoji: '🎯', desc: 'Pilih member acak: "siapa yang paling ..." atau tag N member acak', usage: '<pertanyaan> | randomtag <jumlah>',
  group: true,
  run: async ({ sock, msg, from, sender, command, args, text, prefix, reply }) => {
    const meta = await sock.groupMetadata(from)
    const ids = meta.participants.map((p) => p.id).filter((id) => userOf(id) !== userOf(sock.user?.id))
    if (command === 'randomtag' || command === 'acakmember') {
      const n = Math.max(1, Math.min(15, parseInt(args[0], 10) || 3))
      const sel = shuffle(ids).slice(0, n)
      return sock.sendMessage(from, { text: `🎲 *${sel.length} MEMBER TERPILIH*\n\n${sel.map((j, i) => `${i + 1}. @${userOf(j)}`).join('\n')}`, mentions: sel }, { quoted: msg })
    }
    if (!text) return reply(`Contoh: ${prefix}siapa yang paling sering telat?`)
    const j = pick(ids)
    const lead = pick(['Menurut ramalan bot,', 'Setelah dihitung dengan teliti,', 'Tidak diragukan lagi,', 'Hasil voting semesta:'])
    await sock.sendMessage(from, { text: `🎯 *SIAPA YANG PALING...*\n\n❓ ${text.replace(/^yang\s+/i, '')}\n\n${lead} jawabannya adalah 👉 @${userOf(j)}\n_Bercanda ya, jangan baper!_`, mentions: [j] }, { quoted: msg })
  }
}
