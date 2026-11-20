// .jadwal — jadwal pribadi (kuliah/sekolah/kegiatan) per pengguna
const { createStore } = require('../../lib/store')
const { userOf } = require('../../lib/utils')
const { panel } = require('../../lib/uitext')

const store = createStore('jadwal', { users: {} })
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'] // 1..7
const ALIAS = { senin: 1, selasa: 2, rabu: 3, kamis: 4, jumat: 5, "jum'at": 5, sabtu: 6, minggu: 7, ahad: 7, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7 }
const MAX = 60

// 1..7 (Senin..Minggu) menurut WIB; offset=1 untuk besok
function dayNow(offset = 0) {
  const w = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jakarta', weekday: 'short' }).format(new Date())
  const base = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[w]
  return ((base - 1 + offset) % 7) + 1
}

function parseTime(raw) {
  const m = String(raw || '').match(/^(\d{1,2})[:.](\d{2})$/)
  if (!m) return null
  const h = Number(m[1])
  const mi = Number(m[2])
  return h <= 23 && mi <= 59 ? `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}` : null
}

const sorted = (list) => [...list].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))

module.exports = {
  name: 'jadwal',
  command: ['jadwal', 'schedule', 'jadwalku'],
  category: 'tools',
  emoji: '🗓️',
  desc: 'Jadwal pribadi: tambah, lihat hari ini/besok/semua, hapus',
  usage: '[besok|semua|<hari>] | add <hari> <jam> <kegiatan> | del <no> | reset',
  run: async ({ sender, args, prefix, reply }) => {
    const me = userOf(sender)
    const list = (store.data.users[me] ||= [])
    const sub = (args[0] || '').toLowerCase()

    // ---- tambah
    if (['add', 'tambah', 'set'].includes(sub)) {
      const day = ALIAS[(args[1] || '').toLowerCase()]
      const time = parseTime(args[2])
      const title = args.slice(3).join(' ').trim()
      if (!day || !time || !title) {
        return reply(`Format: ${prefix}jadwal add <hari> <jam> <kegiatan>\nContoh: ${prefix}jadwal add senin 08:00 Kuliah Matematika`)
      }
      if (title.length > 80) return reply('Nama kegiatan maksimal 80 karakter.')
      if (list.length >= MAX) return reply(`Jadwal penuh (maks ${MAX}). Hapus sebagian dulu dengan ${prefix}jadwal del <no>.`)
      list.push({ day, time, title })
      store.save()
      return reply(`✅ Ditambahkan: *${DAYS[day - 1]} ${time}* — ${title}\nLihat semua: ${prefix}jadwal semua`)
    }

    // ---- hapus
    if (['del', 'hapus', 'delete', 'rm'].includes(sub)) {
      const all = sorted(list)
      const n = parseInt(args[1], 10)
      if (!(n >= 1 && n <= all.length)) return reply(`Nomor tidak ada. Lihat nomor lewat ${prefix}jadwal semua, lalu ${prefix}jadwal del <no>.`)
      const gone = all[n - 1]
      list.splice(list.indexOf(gone), 1)
      store.save()
      return reply(`🗑️ Dihapus: *${DAYS[gone.day - 1]} ${gone.time}* — ${gone.title}`)
    }

    if (sub === 'reset') {
      if ((args[1] || '').toLowerCase() !== 'ya') return reply(`Ini akan menghapus ${list.length} jadwalmu. Ketik *${prefix}jadwal reset ya* untuk melanjutkan.`)
      store.data.users[me] = []
      store.save()
      return reply('Semua jadwalmu dihapus.')
    }

    // ---- lihat
    if (!list.length) {
      return reply(panel('JADWAL SAYA', [{ head: '📖 *BELUM ADA JADWAL*', lines: [`Tambah : ${prefix}jadwal add senin 08:00 Kuliah`, `Hari ini : ${prefix}jadwal`, `Besok : ${prefix}jadwal besok`, `Semua : ${prefix}jadwal semua`, `Hapus : ${prefix}jadwal del <no>`] }]))
    }
    const all = sorted(list)
    const idx = new Map(all.map((x, i) => [x, i + 1]))
    const line = (x) => `${idx.get(x)}. ${x.time} • ${x.title}`

    let days
    let title = 'JADWAL SAYA'
    if (sub === 'semua' || sub === 'all' || sub === 'minggu-ini') days = [1, 2, 3, 4, 5, 6, 7]
    else if (sub === 'besok') days = [dayNow(1)]
    else if (ALIAS[sub]) days = [ALIAS[sub]]
    else days = [dayNow(0)]
    if (days.length === 1) title = sub === 'besok' ? 'JADWAL BESOK' : ALIAS[sub] ? `JADWAL ${DAYS[days[0] - 1].toUpperCase()}` : 'JADWAL HARI INI'

    const sections = days
      .map((d) => ({ head: `🗓️ *${DAYS[d - 1].toUpperCase()}*`, lines: all.filter((x) => x.day === d).map(line) }))
      .filter((s) => s.lines.length)
    if (!sections.length) return reply(`Tidak ada jadwal untuk ${days.length === 1 ? DAYS[days[0] - 1] : 'minggu ini'}. 🎉\nTambah: ${prefix}jadwal add <hari> <jam> <kegiatan>`)
    await reply(panel(title, sections, { tip: `💡 ${prefix}jadwal add • ${prefix}jadwal del <no> • ${prefix}jadwal semua` }))
  }
}
