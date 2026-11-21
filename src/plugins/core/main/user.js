/**
 * Fitur pengguna: daftar, profil, limit harian, status premium.
 * Owner: tambah limit, atur limit harian, wajib daftar on/off.
 */
import { getUser, findUser, isPremium, isOwner } from '../../../core/models.js'
import { userPart, toPnJid } from '../../../core/jid.js'
import { parseRegister, register, unregister, refreshLimit, dailyLimit, limitEnabled } from '../../../features/limit.js'

const fmtDate = (t) => new Date(t).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
const remain = (t) => {
  const ms = t - Date.now()
  if (ms <= 0) return 'habis'
  const d = Math.floor(ms / 86400000)
  const h = Math.floor((ms % 86400000) / 3600000)
  return d ? `${d} hari ${h} jam` : `${h} jam ${Math.floor((ms % 3600000) / 60000)} menit`
}

/** Target: mention, reply, atau nomor di argumen. */
function targetOf(m, args) {
  if (m.mentionedJid?.[0]) return m.mentionedJid[0]
  if (m.quoted?.sender) return m.quoted.sender
  const num = String(args.find((a) => /^\+?\d{8,16}$/.test(a.replace(/[\s-]/g, ''))) || '').replace(/\D/g, '')
  return num ? `${num}@s.whatsapp.net` : null
}

function limitText(jid, user) {
  if (isOwner(jid)) return '♾️ Tak terbatas (owner)'
  if (isPremium(jid)) return '♾️ Tak terbatas (premium)'
  if (!limitEnabled()) return '♾️ Tak terbatas'
  return `${refreshLimit(user)} / ${dailyLimit()} per hari`
}

export default [
  {
    command: ['daftar', 'register', 'reg', 'verify'],
    category: 'user',
    description: 'Daftar sebagai pengguna bot',
    usage: 'nama.umur',
    noRegister: true,
    async run(m, { user, text, prefix, command }) {
      if (user.registered) return m.reply(`Kamu sudah terdaftar sebagai *${user.regName}* (${user.regAge} th).\nHapus pendaftaran: *${prefix}unreg*`)
      const data = parseRegister(text)
      if (!data) return m.reply(`Format: *${prefix}${command} nama.umur*\nContoh: *${prefix}${command} Budi.17*`)
      if (data.age < 5 || data.age > 100) return m.reply('Umur harus antara 5 dan 100 tahun.')
      register(user, data)
      return m.reply(
        [
          '╭─❖ ✅ *PENDAFTARAN BERHASIL*',
          `│ Nama : ${data.name}`,
          `│ Umur : ${data.age} tahun`,
          `│ Nomor : ${userPart(m.sender)}`,
          `│ Waktu : ${fmtDate(user.regTime)}`,
          '╰──────────────',
          '',
          `Ketik *${prefix}menu* untuk melihat fitur.`
        ].join('\n')
      )
    }
  },
  {
    command: ['unreg', 'unregister', 'bataldaftar'],
    category: 'user',
    description: 'Hapus pendaftaran kamu',
    noRegister: true,
    async run(m, { user }) {
      return m.reply(unregister(user) ? '🗑️ Pendaftaran kamu sudah dihapus.' : 'Kamu belum terdaftar.')
    }
  },
  {
    command: ['me', 'profil', 'profile', 'my'],
    category: 'user',
    description: 'Lihat profil kamu (atau profil orang yang di-mention)',
    noRegister: true,
    async run(m, { args, sock }) {
      const jid = targetOf(m, args) || m.sender
      const u = jid === m.sender ? getUser(jid) : findUser(jid) || getUser(jid)
      const prem = isPremium(jid)
      let pp = null
      try {
        pp = await sock.profilePictureUrl(jid, 'image')
      } catch {}
      const text = [
        `╭─❖ 👤 *PROFIL*`,
        `│ Nama : ${u.regName || u.name || '-'}`,
        `│ Nomor : @${userPart(jid)}`,
        `│ Terdaftar : ${u.registered ? `ya (${u.regAge} th)` : 'belum'}`,
        `│ Status : ${isOwner(jid) ? 'Owner 👑' : prem ? 'Premium 💎' : 'Free'}`,
        prem && u.premiumTime ? `│ Premium sisa : ${remain(u.premiumTime)}` : null,
        `│ Limit : ${limitText(jid, u)}`,
        `│ Perintah dipakai : ${u.commands || 0}`,
        u.banned ? '│ ⛔ Diblokir dari bot' : null,
        '╰──────────────'
      ].filter(Boolean).join('\n')
      return m.reply(pp ? { image: { url: pp }, caption: text, mentions: [jid] } : { text, mentions: [jid] })
    }
  },
  {
    command: ['limit', 'ceklimit', 'sisalimit'],
    category: 'user',
    description: 'Cek sisa limit harian',
    noRegister: true,
    async run(m, { user, prefix }) {
      const free = !isPremium(m.sender) && limitEnabled()
      return m.reply(`🎫 *Limit kamu:* ${limitText(m.sender, user)}${free ? `\n\nLimit dipakai fitur berat (downloader, AI) dan terisi ulang setiap hari.\nPengguna *Premium* bebas limit — hubungi owner (*${prefix}owner*).` : ''}`)
    }
  },
  {
    command: ['cekprem', 'cekpremium', 'premium'],
    category: 'user',
    description: 'Cek status premium',
    noRegister: true,
    async run(m, { args, prefix }) {
      const jid = targetOf(m, args) || m.sender
      const u = findUser(jid)
      if (isOwner(jid)) return m.reply('👑 Owner otomatis punya semua akses premium.')
      if (!isPremium(jid)) return m.reply(`${jid === m.sender ? 'Kamu' : `@${userPart(jid)}`} belum premium.\n\n💎 *Keuntungan premium:*\n• Bebas limit harian\n• Akses fitur khusus premium\n\nHubungi owner: *${prefix}owner*`)
      return m.reply(`💎 ${jid === m.sender ? 'Kamu' : `@${userPart(jid)}`} premium ${u?.premiumTime ? `sampai ${fmtDate(u.premiumTime)} (sisa ${remain(u.premiumTime)})` : 'permanen'}.`)
    }
  },
  {
    command: ['addlimit', 'tambahlimit'],
    category: 'owner',
    owner: true,
    description: 'Tambah limit pengguna (hari ini)',
    usage: '@user <jumlah>',
    async run(m, { args, prefix, command }) {
      const jid = targetOf(m, args)
      const n = Number(args.find((a) => /^-?\d{1,5}$/.test(a)))
      if (!jid || !Number.isFinite(n)) return m.reply(`Format: *${prefix}${command} @user 10*`)
      const u = getUser(toPnJid(jid))
      refreshLimit(u)
      u.limit = Math.max(0, u.limit + n)
      return m.reply({ text: `🎫 Limit @${userPart(jid)} sekarang ${u.limit}.`, mentions: [jid] })
    }
  },
  {
    command: ['setlimit', 'limitharian'],
    category: 'owner',
    owner: true,
    description: 'Atur limit harian pengguna free (0 = matikan sistem limit)',
    usage: '<jumlah>',
    async run(m, { args, bot, prefix, command }) {
      if (!args[0]) return m.reply(`Limit harian sekarang: *${limitEnabled() ? dailyLimit() : 'nonaktif'}*\nUbah: *${prefix}${command} 25* • matikan: *${prefix}${command} 0*`)
      const n = Number(args[0])
      if (!Number.isInteger(n) || n < 0 || n > 10000) return m.reply('Masukkan angka 0 - 10000.')
      bot.saveSettings({ limit: { enabled: n > 0, daily: n || dailyLimit() } })
      return m.reply(n ? `✅ Limit harian pengguna free: *${n}*` : '✅ Sistem limit dimatikan.')
    }
  },
  {
    command: ['wajibdaftar', 'regis', 'autoregister'],
    category: 'owner',
    owner: true,
    description: 'Wajibkan pengguna daftar sebelum memakai bot',
    usage: 'on/off',
    async run(m, { args, bot, settings }) {
      const v = (args[0] || '').toLowerCase()
      if (!['on', 'off'].includes(v)) return m.reply(`Wajib daftar: *${settings.requireRegister ? 'ON' : 'OFF'}*\nUbah dengan *on* / *off*.`)
      bot.saveSettings({ requireRegister: v === 'on' })
      return m.reply(`✅ Wajib daftar ${v === 'on' ? 'diaktifkan' : 'dimatikan'}.`)
    }
  }
]
