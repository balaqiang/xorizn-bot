import { onOff } from '../../src/utils/helpers.js'
import { sendGreeting } from '../../src/features/greetings.js'
import { DEFAULT_WELCOME, DEFAULT_GOODBYE } from '../../src/core/models.js'

const status = (v) => (v ? '✅ aktif' : '❌ mati')

/** Pembuat perintah toggle on/off untuk satu field pengaturan grup. */
function toggle(command, field, label, description, extra = {}) {
  return {
    command,
    category: 'group',
    description,
    usage: 'on|off',
    group: true,
    admin: true,
    ...extra,
    async run(m, { args, group, db, prefix }) {
      const v = onOff(args[0])
      if (v === null) return m.reply(`*${label}*: ${status(group[field])}\n\nPakai: ${prefix}${command[0]} on / off`)
      group[field] = v
      db.save()
      return m.reply(`${label} ${v ? 'diaktifkan ✅' : 'dimatikan ❌'}.`)
    }
  }
}

export default [
  toggle(['welcome', 'wc'], 'welcome', 'Pesan welcome', 'Aktif/nonaktifkan kartu welcome anggota baru'),
  toggle(['goodbye', 'leave', 'bye'], 'goodbye', 'Pesan goodbye', 'Aktif/nonaktifkan kartu goodbye anggota keluar'),
  toggle(['welcomecard', 'kartuwelcome'], 'welcomeCard', 'Kartu gambar welcome/goodbye', 'Pakai gambar (discord-canvas) atau teks saja'),
  toggle(['promotenotify', 'notifadmin'], 'promoteNotify', 'Notifikasi promote/demote', 'Umumkan saat ada admin baru / dicopot'),
  toggle(['nsfw'], 'nsfw', 'Fitur NSFW', 'Izinkan perintah kategori NSFW di grup ini'),
  toggle(['autosticker', 'autostiker'], 'autoSticker', 'Auto stiker', 'Ubah otomatis gambar/video pendek jadi stiker'),
  toggle(['onlyadmin', 'adminonly'], 'onlyAdmin', 'Mode hanya admin', 'Hanya admin yang bisa memakai bot di grup ini'),
  {
    command: ['bot', 'botgc', 'mutegc'],
    category: 'group',
    description: 'Nyalakan/matikan bot untuk anggota di grup ini (admin tetap bisa pakai)',
    usage: 'on|off',
    group: true,
    admin: true,
    async run(m, { args, group, db, prefix, command }) {
      let v = onOff(args[0])
      if (command === 'mutegc' && v !== null) v = !v
      if (v === null) return m.reply(`Bot di grup ini: ${status(group.botEnabled)}\n\nPakai: ${prefix}bot on / off`)
      group.botEnabled = v
      db.save()
      return m.reply(v ? '🤖 Bot diaktifkan untuk semua anggota.' : '🔇 Bot dimatikan untuk anggota (admin tetap bisa memakai).')
    }
  },
  {
    command: ['setwelcome', 'setwc'],
    category: 'group',
    description: 'Ubah teks welcome. Placeholder: @user @name @group @count @desc',
    usage: '<teks> | reset',
    group: true,
    admin: true,
    async run(m, { text, group, db, settings }) {
      if (!text) return m.reply(`Teks welcome sekarang:\n\n${group.welcomeText || settings.welcomeText}\n\nPlaceholder: @user @name @group @count @desc @number`)
      group.welcomeText = text.toLowerCase() === 'reset' ? '' : text
      db.save()
      return m.reply(`✅ Teks welcome ${group.welcomeText ? 'diubah' : 'dikembalikan ke default'}.`)
    }
  },
  {
    command: ['setgoodbye', 'setbye', 'setleave'],
    category: 'group',
    description: 'Ubah teks goodbye. Placeholder: @user @name @group @count',
    usage: '<teks> | reset',
    group: true,
    admin: true,
    async run(m, { text, group, db, settings }) {
      if (!text) return m.reply(`Teks goodbye sekarang:\n\n${group.goodbyeText || settings.goodbyeText}`)
      group.goodbyeText = text.toLowerCase() === 'reset' ? '' : text
      db.save()
      return m.reply(`✅ Teks goodbye ${group.goodbyeText ? 'diubah' : 'dikembalikan ke default'}.`)
    }
  },
  {
    command: ['setbgwelcome', 'setbackground'],
    category: 'group',
    description: 'Atur latar kartu welcome/goodbye (URL gambar, atau reply gambar)',
    usage: '<url> | reset',
    group: true,
    admin: true,
    async run(m, { text, group, db }) {
      if (text.toLowerCase() === 'reset') {
        group.cardBackground = ''
        db.save()
        return m.reply('✅ Latar kartu dikembalikan ke default.')
      }
      if (/^https?:\/\//i.test(text)) {
        group.cardBackground = text.trim()
        db.save()
        return m.reply('✅ Latar kartu diubah.')
      }
      return m.reply('Kirim URL gambar (https://...) atau *reset*. Gambar sebaiknya 1024×450.')
    }
  },
  {
    command: ['testwelcome', 'testgoodbye'],
    category: 'group',
    description: 'Coba tampilan welcome / goodbye',
    group: true,
    admin: true,
    async run(m, { sock, command }) {
      const kind = command === 'testgoodbye' ? 'goodbye' : 'welcome'
      return sendGreeting(sock, m.chat, kind, { id: m.senderLid || m.sender, phoneNumber: m.sender })
    }
  },
  {
    command: ['antilink', 'antilinkgc'],
    category: 'group',
    description: 'Hapus link: wa (link grup/saluran WA) | all (semua link) | off. Aksi: delete | warn | kick',
    usage: 'wa|all|off [delete|warn|kick]',
    group: true,
    admin: true,
    async run(m, { args, group, db, prefix }) {
      const mode = (args[0] || '').toLowerCase()
      const map = { on: 'wa', wa: 'wa', all: 'all', semua: 'all', off: 'off', mati: 'off' }
      if (!map[mode]) {
        return m.reply(`*Anti-link*: ${group.antilink} (aksi: ${group.antilinkAction})\n\n${prefix}antilink wa|all|off [delete|warn|kick]\n• wa = hanya link grup/saluran WhatsApp\n• all = semua link`)
      }
      group.antilink = map[mode]
      const action = (args[1] || '').toLowerCase()
      if (['delete', 'warn', 'kick'].includes(action)) group.antilinkAction = action
      db.save()
      return m.reply(`✅ Anti-link: *${group.antilink}*${group.antilink !== 'off' ? `, aksi: *${group.antilinkAction}*` : ''}.`)
    }
  },
  {
    command: ['antibadword', 'antitoxic', 'antikasar'],
    category: 'group',
    description: 'Hapus pesan berisi kata terlarang (atur daftar dengan .addbadword)',
    usage: 'on|off',
    group: true,
    admin: true,
    async run(m, { args, group, db, prefix }) {
      const v = onOff(args[0])
      if (v === null) return m.reply(`*Anti kata kasar*: ${status(group.antiBadword)}\nKata terlarang: ${group.badwords.length ? group.badwords.join(', ') : '-'}\n\n${prefix}antibadword on/off\n${prefix}addbadword <kata>\n${prefix}delbadword <kata>`)
      group.antiBadword = v
      db.save()
      return m.reply(`Anti kata kasar ${v ? 'diaktifkan ✅' : 'dimatikan ❌'}.${v && !group.badwords.length ? `\nTambahkan kata dengan ${prefix}addbadword <kata>` : ''}`)
    }
  },
  {
    command: ['addbadword', 'addtoxic'],
    category: 'group',
    description: 'Tambah kata terlarang (pisahkan dengan koma)',
    usage: '<kata, kata2>',
    group: true,
    admin: true,
    async run(m, { text, group, db }) {
      const words = text.split(/[,\n]/).map((w) => w.trim().toLowerCase()).filter(Boolean)
      if (!words.length) return m.reply('Tulis kata yang ingin dilarang.')
      group.badwords = [...new Set([...group.badwords, ...words])]
      db.save()
      return m.reply(`✅ Ditambahkan: ${words.join(', ')}\nTotal: ${group.badwords.length} kata.`)
    }
  },
  {
    command: ['delbadword', 'deltoxic'],
    category: 'group',
    description: 'Hapus kata terlarang',
    usage: '<kata>',
    group: true,
    admin: true,
    async run(m, { text, group, db }) {
      const words = text.split(/[,\n]/).map((w) => w.trim().toLowerCase()).filter(Boolean)
      group.badwords = group.badwords.filter((w) => !words.includes(w))
      db.save()
      return m.reply(`✅ Daftar kata terlarang: ${group.badwords.join(', ') || '-'}`)
    }
  },
  {
    command: ['groupsettings', 'gcsettings', 'settinggc'],
    category: 'group',
    description: 'Lihat semua pengaturan bot di grup ini',
    group: true,
    async run(m, { group, settings }) {
      return m.reply([
        `⚙️ *Pengaturan grup*`,
        `• Bot: ${status(group.botEnabled)}`,
        `• Hanya admin: ${status(group.onlyAdmin)}`,
        `• Welcome: ${status(group.welcome)} • Goodbye: ${status(group.goodbye)}`,
        `• Kartu gambar: ${status(group.welcomeCard)}`,
        `• Anti-link: ${group.antilink} (${group.antilinkAction})`,
        `• Anti kata kasar: ${status(group.antiBadword)} (${group.badwords.length} kata)`,
        `• NSFW: ${status(group.nsfw)} • Auto stiker: ${status(group.autoSticker)}`,
        `• Notif admin: ${status(group.promoteNotify)}`,
        `• Batas peringatan: ${group.warnLimit}`,
        `• Perintah nonaktif: ${group.disabledCommands.join(', ') || '-'}`,
        '',
        `Teks welcome: ${group.welcomeText || settings.welcomeText || DEFAULT_WELCOME}`,
        `Teks goodbye: ${group.goodbyeText || settings.goodbyeText || DEFAULT_GOODBYE}`
      ].join('\n'))
    }
  },
  {
    command: ['disablegc', 'enablegc'],
    category: 'group',
    description: 'Nonaktifkan/aktifkan perintah tertentu hanya di grup ini',
    usage: '<perintah>',
    group: true,
    admin: true,
    async run(m, { args, group, db, command, registry }) {
      const name = (args[0] || '').toLowerCase().replace(/^[./!#]/, '')
      if (!name || !registry.has(name)) return m.reply('Perintah tidak ditemukan.')
      const set = new Set(group.disabledCommands)
      command === 'disablegc' ? set.add(name) : set.delete(name)
      group.disabledCommands = [...set]
      db.save()
      return m.reply(`✅ Perintah *${name}* ${command === 'disablegc' ? 'dinonaktifkan' : 'diaktifkan'} di grup ini.`)
    }
  }
]
