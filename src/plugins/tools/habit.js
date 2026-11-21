// .habit — pelacak kebiasaan dengan streak harian
const { createStore } = require('../../lib/store')
const { userOf, today, bar } = require('../../lib/fx')
const store = createStore('habit', { users: {} })
const yest = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date(Date.now() - 864e5))
module.exports = {
  name: 'habit', command: ['habit', 'kebiasaan', 'streak'], category: 'tools', emoji: '🔥', desc: 'Pelacak kebiasaan & streak harian', usage: 'add <nama> | done <no> | list | del <no>',
  run: async ({ sender, args, prefix, reply }) => {
    const me = userOf(sender); const list = (store.data.users[me] ||= [])
    const sub = (args[0] || 'list').toLowerCase()
    if (sub === 'add') {
      const name = args.slice(1).join(' ').trim()
      if (!name || name.length > 40) return reply(`Contoh: ${prefix}habit add Olahraga pagi`)
      if (list.length >= 12) return reply('Maksimal 12 kebiasaan.')
      list.push({ name, last: '', streak: 0, best: 0, total: 0 }); store.save()
      return reply(`✅ Kebiasaan *${name}* ditambahkan.\nCentang tiap hari: ${prefix}habit done ${list.length}`)
    }
    if (sub === 'done' || sub === 'cek') {
      const h = list[parseInt(args[1], 10) - 1]
      if (!h) return reply(`Nomor tidak ada. Lihat ${prefix}habit list`)
      if (h.last === today()) return reply(`Sudah dicentang hari ini. Streak: 🔥 ${h.streak}`)
      h.streak = h.last === yest() ? h.streak + 1 : 1; h.best = Math.max(h.best, h.streak); h.total++; h.last = today(); store.save()
      return reply(`🔥 *${h.name}* selesai hari ini!\n▬ *Streak:* ${h.streak} hari\n▬ *Rekor:* ${h.best} hari\n▬ *Total:* ${h.total}x${h.streak % 7 === 0 ? '\n🎉 Streak 7 hari berlipat — keren!' : ''}`)
    }
    if (sub === 'del' || sub === 'hapus') {
      const i = parseInt(args[1], 10) - 1
      if (!list[i]) return reply('Nomor tidak ada.')
      const [g] = list.splice(i, 1); store.save(); return reply(`🗑️ Dihapus: ${g.name}`)
    }
    if (!list.length) return reply(`🔥 *HABIT TRACKER*\n\nBelum ada kebiasaan.\n➥ ${prefix}habit add Minum air 8 gelas\n➥ ${prefix}habit done 1`)
    const doneToday = list.filter((h) => h.last === today()).length
    await reply(`🔥 *HABIT TRACKER*\n\n▬ *Hari ini:* ${doneToday}/${list.length}\n${bar((doneToday / list.length) * 100, 12)} ${Math.round((doneToday / list.length) * 100)}%\n\n${list.map((h, i) => { const alive = h.last === today() || h.last === yest(); return `${h.last === today() ? '✅' : '⬜'} ${i + 1}. ${h.name} — 🔥 ${alive ? h.streak : 0} (rekor ${h.best})` }).join('\n')}\n\n💡 ${prefix}habit done <no>`)
  }
}
