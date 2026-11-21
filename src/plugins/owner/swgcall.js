// .swgcall — siarkan Status Grup ke SEMUA grup tempat bot bergabung (owner saja)
const gs = require('../../lib/groupstatus')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

module.exports = {
  name: 'swgcall',
  command: ['swgcall', 'swgcbc', 'groupstoryall', 'upswgcall'],
  category: 'owner',
  emoji: '📣',
  desc: 'Posting Status Grup ke semua grup (owner)',
  usage: '<teks> | [warna] | [font] — atau kirim/reply media',
  owner: true,
  run: async ({ sock, msg, text, prefix, command, reply, react }) => {
    if (!gs.supported()) return reply('Versi Baileys di bot ini belum mendukung Status Grup. Update baileys lalu restart bot.')
    const prep = await gs.prepare(sock, msg, text, async (t) => reply(t))
    if (prep.error) return reply(`❌ ${prep.error}`)
    if (prep.help) return reply(`Kirim/reply media atau tulis teks.\nContoh: ${prefix}${command} Info penting | merah | 2\nStatus akan diposting ke semua grup bot (jeda ±3 detik per grup).`)

    const groups = Object.values(await sock.groupFetchAllParticipating())
    if (!groups.length) return reply('Bot belum bergabung ke grup mana pun.')
    await react('⏳')
    await reply(`📣 Memulai siaran ke ${groups.length} grup (±${Math.ceil((groups.length * 3) / 60)} menit)…`)

    let ok = 0
    const fail = []
    for (const g of groups) {
      try {
        for (const p of prep.payloads) {
          await gs.postStatus(sock, g.id, p.content, prep.style)
          if (prep.payloads.length > 1) await sleep(1500)
        }
        ok++
      } catch (err) {
        fail.push(`${String(g.subject || g.id).slice(0, 30)} (${String(err.message).slice(0, 40)})`)
      }
      await sleep(2500 + Math.floor(Math.random() * 1000))
    }
    await reply(`✅ Siaran selesai\nBerhasil: ${ok} grup\nGagal: ${fail.length} grup${fail.length ? `\n\n${fail.slice(0, 10).map((f) => `• ${f}`).join('\n')}${fail.length > 10 ? `\n…dan ${fail.length - 10} lainnya` : ''}` : ''}`)
  }
}
