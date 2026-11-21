// .antikudeta — lindungi grup dari pengambilalihan oleh admin lain
const gg = require('../../lib/groupguard')
const { getTargets, userOf } = require('../../lib/utils')
const { panel } = require('../../lib/uitext')

module.exports = {
  name: 'antikudeta',
  command: ['antikudeta', 'antitakeover', 'anticoup'],
  category: 'group',
  emoji: '🛡️',
  desc: 'Anti kudeta: balikkan admin yang dicopot/dikeluarkan & hukum pelakunya',
  usage: 'on|off|mode demote|kick|strict on|off|trust @user|untrust @user|list',
  group: true,
  admin: true,
  run: async ({ sock, msg, from, sender, args, isOwner, prefix, reply }) => {
    const meta = await sock.groupMetadata(from)
    const members = gg.membersOf(meta)
    const me = gg.expand(gg.aliasesOf(sender), members)
    const isSuper = gg.intersects(me, gg.superIds(meta))
    const manage = isOwner || isSuper
    const g = gg.cfg(from)
    const k = g.kudeta
    const sub = (args[0] || 'status').toLowerCase()
    const botAdmin = gg.botIsAdmin(sock, meta)
    const deny = () => reply('Hanya *pembuat grup* (superadmin) atau owner bot yang boleh mengubah pengaturan ini, supaya admin lain tidak bisa mematikannya.')

    if (sub === 'status' || sub === 'list') {
      const sup = gg.superIds(meta)
      return sock.sendMessage(
        from,
        {
          text: panel(
            'ANTI-KUDETA',
            [
              { head: '⚙️ *PENGATURAN*', lines: [`Status : ${k.on ? '✅ Aktif' : '❌ Mati'}`, `Hukuman pelaku : ${k.mode === 'kick' ? 'Dikeluarkan' : 'Dicopot dari admin'}`, `Mode ketat : ${k.strict ? 'Aktif' : 'Mati'}`, `Bot admin : ${botAdmin ? 'Ya' : '⚠️ Bukan (tidak bisa menindak)'}`] },
              { head: '🛡️ *DILINDUNGI*', lines: [`Pembuat grup : ${sup.length ? sup.map((x) => `@${x}`).join(', ') : '-'}`, ...(k.trust.length ? k.trust.map((t) => `Trust : @${t.label}`) : ['Trust : (kosong)'])] },
              { head: '📖 *PERINTAH*', lines: [`${prefix}antikudeta on | off`, `${prefix}antikudeta mode demote | kick`, `${prefix}antikudeta strict on | off`, `${prefix}antikudeta trust @user  /  untrust @user`] }
            ],
            { tip: '💡 Hanya pembuat grup & owner bot yang bisa mengubah pengaturan.' }
          ),
          mentions: [...sup, ...k.trust.map((t) => t.label)].map((n) => `${n}@s.whatsapp.net`)
        },
        { quoted: msg }
      )
    }

    if (!manage) return deny()

    if (sub === 'on' || sub === 'off') {
      k.on = sub === 'on'
      gg.save()
      return reply(k.on ? `🛡️ Anti-kudeta *aktif*.${botAdmin ? '' : '\n⚠️ Jadikan bot admin supaya bisa menindak.'}\nYang dilindungi: pembuat grup + daftar trust (${prefix}antikudeta trust @user).` : 'Anti-kudeta dimatikan.')
    }
    if (sub === 'mode') {
      const m = (args[1] || '').toLowerCase()
      if (!['demote', 'kick'].includes(m)) return reply(`Pilih mode hukuman:\n${prefix}antikudeta mode demote  → pelaku dicopot dari admin\n${prefix}antikudeta mode kick  → pelaku dikeluarkan`)
      k.mode = m
      gg.save()
      return reply(`Hukuman pelaku: ${m === 'kick' ? 'dikeluarkan dari grup' : 'dicopot dari admin'}.`)
    }
    if (sub === 'strict') {
      const v = (args[1] || '').toLowerCase()
      if (!['on', 'off'].includes(v)) return reply(`Mode ketat: hanya pembuat grup & trust yang boleh menambah admin; promosi dari admin lain dibatalkan.\n${prefix}antikudeta strict on | off`)
      k.strict = v === 'on'
      gg.save()
      return reply(`Mode ketat ${k.strict ? 'diaktifkan' : 'dimatikan'}.`)
    }
    if (sub === 'trust' || sub === 'untrust') {
      const targets = getTargets(msg, args.slice(1))
      if (!targets.length) return reply(`Tag atau reply orangnya.\nContoh: ${prefix}antikudeta ${sub} @user`)
      let n = 0
      for (const t of targets) {
        const ids = gg.expand([userOf(t)], members)
        const label = ids.find((x) => members.some((m) => m.raw.phoneNumber && userOf(m.raw.phoneNumber) === x)) || userOf(t) // utamakan nomor HP
        if (sub === 'trust') {
          if (!k.trust.some((x) => gg.intersects(x.ids, ids))) {
            k.trust.push({ ids, label })
            n++
          }
        } else {
          const before = k.trust.length
          k.trust = k.trust.filter((x) => !gg.intersects(x.ids, ids))
          n += before - k.trust.length
        }
      }
      gg.save()
      return reply(n ? `Daftar trust diperbarui (${sub === 'trust' ? '+' : '-'}${n}).` : sub === 'trust' ? 'Orang itu sudah ada di daftar trust.' : 'Orang itu tidak ada di daftar trust.')
    }
    return reply(`Perintah tidak dikenal. Ketik ${prefix}antikudeta untuk melihat pengaturan.`)
  }
}
