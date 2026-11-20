// .antifake — keluarkan otomatis member baru dengan nomor di luar kode negara yang diizinkan
const gg = require('../../lib/groupguard')
const { panel } = require('../../lib/uitext')

module.exports = {
  name: 'antifake',
  command: ['antifake', 'antiasing', 'antinomor'],
  category: 'group',
  emoji: '🚫',
  desc: 'Keluarkan otomatis member baru dengan kode negara tidak diizinkan',
  usage: 'on|off|allow <kode...>|status',
  group: true,
  admin: true,
  run: async ({ sock, from, args, prefix, reply }) => {
    const g = gg.cfg(from)
    const sub = (args[0] || 'status').toLowerCase()

    if (sub === 'on' || sub === 'off') {
      g.fake.on = sub === 'on'
      gg.save()
      return reply(g.fake.on ? `🚫 Antifake *aktif*. Member baru dengan nomor di luar ${g.fake.allow.map((x) => '+' + x).join(', ')} akan dikeluarkan.\nBot harus jadi admin. Member lama tidak terpengaruh.` : 'Antifake dimatikan.')
    }
    if (sub === 'allow') {
      const codes = args.slice(1).map((x) => x.replace(/\D/g, '')).filter(Boolean)
      if (args[1] && args[1].toLowerCase() === 'reset') {
        g.fake.allow = ['62']
        gg.save()
        return reply('Kode negara dikembalikan ke +62 saja.')
      }
      if (!codes.length || codes.length > 10 || codes.some((c) => c.length > 4)) return reply(`Isi kode negara (angka, maks 4 digit).\nContoh: ${prefix}antifake allow 62 60 65\nKembalikan: ${prefix}antifake allow reset`)
      g.fake.allow = [...new Set(codes)]
      gg.save()
      return reply(`Kode negara yang diizinkan: ${g.fake.allow.map((x) => '+' + x).join(', ')}`)
    }
    const meta = await sock.groupMetadata(from)
    const botAdmin = gg.botIsAdmin(sock, meta)
    await reply(
      panel('ANTIFAKE', [
        { head: '⚙️ *PENGATURAN*', lines: [`Status : ${g.fake.on ? '✅ Aktif' : '❌ Mati'}`, `Kode negara diizinkan : ${g.fake.allow.map((x) => '+' + x).join(', ')}`, `Bot admin : ${botAdmin ? 'Ya' : '⚠️ Bukan (tidak bisa menindak)'}`] },
        { head: '📖 *PERINTAH*', lines: [`${prefix}antifake on | off`, `${prefix}antifake allow 62 60  (ubah kode negara)`, `${prefix}antifake allow reset`] }
      ], { tip: '💡 Member yang ditambahkan langsung oleh admin tidak dikeluarkan.' })
    )
  }
}
