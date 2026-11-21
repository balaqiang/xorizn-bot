import { getTarget, participantIdFor, mention } from '../../../utils/helpers.js'
import { participantPn, userPart, toPnJid, digits } from '../../../core/jid.js'
import { addWarn, resetWarn } from '../../../features/moderation.js'

function participantAction(command, action, verb, description) {
  return {
    command,
    category: 'group',
    description,
    usage: '@user | reply | nomor',
    group: true,
    admin: true,
    botAdmin: true,
    async run(m, { sock, text, participants }) {
      const targets = m.mentionedJid?.length ? m.mentionedJid : [getTarget(m, text)].filter(Boolean)
      if (!targets.length) return m.reply('Tag, reply pesan, atau tulis nomor targetnya.')
      const me = userPart(sock.user?.id)
      const ids = targets.filter((t) => userPart(t) !== me).map((t) => (action === 'add' ? toPnJid(t) : participantIdFor(participants, t)))
      if (!ids.length) return m.reply('Tidak bisa melakukan itu ke bot sendiri.')
      const res = await sock.groupParticipantsUpdate(m.chat, ids, action)
      const lines = res.map((r, i) => {
        const who = mention(targets[i] || r.jid)
        if (String(r.status) === '200') return `✅ ${who} berhasil ${verb}.`
        if (action === 'add' && String(r.status) === '403') return `📨 ${who} tidak bisa ditambahkan langsung (privasi). Undangan dikirim.`
        if (String(r.status) === '409') return `ℹ️ ${who} sudah ada di grup.`
        return `❌ ${who} gagal ${verb} (kode ${r.status}).`
      })
      return m.reply({ text: lines.join('\n'), mentions: targets })
    }
  }
}

export default [
  participantAction(['kick', 'tendang', 'dor', 'remove'], 'remove', 'dikeluarkan', 'Keluarkan anggota'),
  participantAction(['add', 'tambah'], 'add', 'ditambahkan', 'Tambah anggota lewat nomor'),
  participantAction(['promote', 'jadiadmin'], 'promote', 'dijadikan admin', 'Jadikan admin'),
  participantAction(['demote', 'unadmin'], 'demote', 'dicopot dari admin', 'Copot admin'),
  {
    command: ['hidetag', 'h'],
    category: 'group',
    description: 'Kirim pesan sambil men-tag semua anggota diam-diam',
    usage: '<teks> | reply',
    group: true,
    admin: true,
    async run(m, { sock, text, participants }) {
      const mentions = participants.map((p) => p.id)
      const content = text || m.quoted?.text || '📢'
      return sock.sendMessage(m.chat, { text: content, mentions })
    }
  },
  {
    command: ['tagall', 'everyone', 'semua'],
    category: 'group',
    description: 'Tag semua anggota dengan daftar nama',
    usage: '[pesan]',
    group: true,
    admin: true,
    async run(m, { sock, text, participants }) {
      const list = participants.map((p) => `◦ @${userPart(participantPn(p))}`)
      return sock.sendMessage(m.chat, {
        text: `📢 *${text || 'Perhatian semuanya!'}*\n\n${list.join('\n')}`,
        mentions: participants.map((p) => participantPn(p))
      })
    }
  },
  {
    command: ['linkgc', 'linkgroup', 'link'],
    category: 'group',
    description: 'Link undangan grup',
    group: true,
    botAdmin: true,
    async run(m, { sock, groupMetadata, group, db }) {
      const code = await sock.groupInviteCode(m.chat)
      group.inviteCode = code
      db.save()
      return m.reply(`🔗 *${groupMetadata?.subject || 'Grup'}*\nhttps://chat.whatsapp.com/${code}`)
    }
  },
  {
    command: ['revoke', 'resetlink', 'resetlinkgc'],
    category: 'group',
    description: 'Reset link undangan grup',
    group: true,
    admin: true,
    botAdmin: true,
    async run(m, { sock, group, db }) {
      const code = await sock.groupRevokeInvite(m.chat)
      group.inviteCode = code
      db.save()
      return m.reply(`✅ Link grup direset.\nhttps://chat.whatsapp.com/${code}`)
    }
  },
  {
    command: ['group', 'grup'],
    category: 'group',
    description: 'Buka/tutup grup (hanya admin yang bisa kirim pesan)',
    usage: 'open|close',
    group: true,
    admin: true,
    botAdmin: true,
    async run(m, { sock, args, prefix }) {
      const a = (args[0] || '').toLowerCase()
      if (['open', 'buka'].includes(a)) {
        await sock.groupSettingUpdate(m.chat, 'not_announcement')
        return m.reply('🔓 Grup dibuka, semua anggota bisa mengirim pesan.')
      }
      if (['close', 'tutup'].includes(a)) {
        await sock.groupSettingUpdate(m.chat, 'announcement')
        return m.reply('🔒 Grup ditutup, hanya admin yang bisa mengirim pesan.')
      }
      return m.reply(`Pakai: ${prefix}group open / close`)
    }
  },
  {
    command: ['opengc', 'bukagc'],
    category: 'group',
    description: 'Buka grup',
    group: true,
    admin: true,
    botAdmin: true,
    async run(m, { sock }) {
      await sock.groupSettingUpdate(m.chat, 'not_announcement')
      return m.reply('🔓 Grup dibuka.')
    }
  },
  {
    command: ['closegc', 'tutupgc'],
    category: 'group',
    description: 'Tutup grup',
    group: true,
    admin: true,
    botAdmin: true,
    async run(m, { sock }) {
      await sock.groupSettingUpdate(m.chat, 'announcement')
      return m.reply('🔒 Grup ditutup.')
    }
  },
  {
    command: ['setnamegc', 'setsubject', 'setname'],
    category: 'group',
    description: 'Ganti nama grup',
    usage: '<nama>',
    group: true,
    admin: true,
    botAdmin: true,
    async run(m, { sock, text }) {
      if (!text) return m.reply('Tulis nama grup baru.')
      await sock.groupUpdateSubject(m.chat, text.slice(0, 100))
      return m.reply('✅ Nama grup diganti.')
    }
  },
  {
    command: ['setdescgc', 'setdesc', 'setdeskgc'],
    category: 'group',
    description: 'Ganti deskripsi grup',
    usage: '<teks>',
    group: true,
    admin: true,
    botAdmin: true,
    async run(m, { sock, text }) {
      await sock.groupUpdateDescription(m.chat, text || '')
      return m.reply('✅ Deskripsi grup diganti.')
    }
  },
  {
    command: ['groupinfo', 'infogrup'],
    category: 'group',
    description: 'Informasi grup',
    group: true,
    async run(m, { groupMetadata: g, group }) {
      if (!g) return m.reply('Gagal mengambil info grup.')
      const admins = g.participants.filter((p) => p.admin)
      return m.reply({
        text: [
          `👥 *${g.subject}*`,
          `🆔 ${g.id}`,
          `👤 Anggota: ${g.participants.length} (admin ${admins.length})`,
          `👑 Pembuat: ${g.owner ? '@' + userPart(g.ownerPn || g.owner) : '-'}`,
          `📅 Dibuat: ${g.creation ? new Date(g.creation * 1000).toLocaleDateString('id-ID') : '-'}`,
          `🔒 Hanya admin kirim pesan: ${g.announce ? 'ya' : 'tidak'}`,
          `💬 Pesan tercatat bot: ${group.stats.messages} • perintah: ${group.stats.commands}`,
          '',
          g.desc ? `📝 ${g.desc}` : ''
        ].join('\n'),
        mentions: [g.ownerPn || g.owner].filter(Boolean)
      })
    }
  },
  {
    command: ['warn', 'peringatan'],
    category: 'group',
    description: 'Beri peringatan; dikeluarkan bila mencapai batas',
    usage: '@user | reply',
    group: true,
    admin: true,
    async run(m, { sock, text, group, isBotAdmin, participants }) {
      const target = getTarget(m, text)
      if (!target) return m.reply('Tag atau reply anggota yang ingin diberi peringatan.')
      const count = addWarn(group, target)
      const limit = Number(group.warnLimit) || 3
      if (count >= limit) {
        resetWarn(group, target)
        if (isBotAdmin) {
          await sock.groupParticipantsUpdate(m.chat, [participantIdFor(participants, target)], 'remove').catch(() => {})
          return m.reply({ text: `🚫 ${mention(target)} mencapai ${limit} peringatan dan dikeluarkan.`, mentions: [target] })
        }
        return m.reply({ text: `🚫 ${mention(target)} mencapai ${limit} peringatan. (Bot bukan admin, tidak bisa mengeluarkan)`, mentions: [target] })
      }
      return m.reply({ text: `⚠️ ${mention(target)} mendapat peringatan ${count}/${limit}.`, mentions: [target] })
    }
  },
  {
    command: ['unwarn', 'delwarn', 'resetwarn'],
    category: 'group',
    description: 'Hapus peringatan anggota',
    usage: '@user | reply',
    group: true,
    admin: true,
    async run(m, { text, group }) {
      const target = getTarget(m, text)
      if (!target) return m.reply('Tag atau reply anggotanya.')
      resetWarn(group, target)
      return m.reply({ text: `✅ Peringatan ${mention(target)} dihapus.`, mentions: [target] })
    }
  },
  {
    command: ['setwarnlimit', 'batasperingatan'],
    category: 'group',
    description: 'Atur batas peringatan sebelum dikeluarkan',
    usage: '<angka>',
    group: true,
    admin: true,
    async run(m, { args, group, db }) {
      const n = Number(digits(args[0]))
      if (!n || n < 1 || n > 20) return m.reply('Masukkan angka 1-20.')
      group.warnLimit = n
      db.save()
      return m.reply(`✅ Batas peringatan: ${n}.`)
    }
  },
  {
    command: ['del', 'delete', 'hapus'],
    category: 'group',
    description: 'Hapus pesan yang di-reply (pesan orang lain butuh bot admin)',
    async run(m, { sock, isBotAdmin, isAdmin }) {
      if (!m.quoted) return m.reply('Reply pesan yang ingin dihapus.')
      if (!m.quoted.fromMe && m.isGroup && (!isBotAdmin || !isAdmin)) return m.reply('Untuk menghapus pesan anggota, kamu dan bot harus admin.')
      return sock.sendMessage(m.chat, { delete: m.quoted.key })
    }
  }
]
