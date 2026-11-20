import os from 'node:os'
import { readMore, runtime, now, greeting, adReply } from '../../src/utils/helpers.js'
import { userPart } from '../../src/core/jid.js'

const ICONS = {
  main: '🏠', info: 'ℹ️', group: '👥', owner: '👑', premium: '💎', tools: '🧰', sticker: '🎨', downloader: '📥',
  search: '🔎', ai: '🤖', 'ai-image': '🖼️', game: '🎮', fun: '🎉', rpg: '⚔️', maker: '✏️', islamic: '🕌', anime: '🌸',
  audio: '🎧', convert: '🔄', stalker: '🕵️', nsfw: '🔞', image: '🖼️', store: '🛒', economy: '💰', other: '📦'
}
const icon = (c) => ICONS[c] || '✨'

function header(m, ctx) {
  const { bot, settings } = ctx
  const total = bot.registry.active().length
  return [
    `╭─❖ *${settings.botName}* ❖`,
    `│ ${greeting(settings.timezone)}, *${m.pushName || userPart(m.sender)}*`,
    `│`,
    `│ 📅 ${now(settings.timezone)}`,
    `│ ⏱️ Aktif: ${runtime(Date.now() - bot.startedAt)}`,
    `│ 🔣 Prefix: ${settings.prefixes.join(' ')}`,
    `│ 🌐 Mode: ${settings.mode}`,
    `│ 📚 Total fitur: ${total}`,
    `│ 👤 Status: ${ctx.isOwner ? 'Owner 👑' : ctx.isPremium ? 'Premium 💎' : 'Free'}`,
    `╰──────────────`
  ].join('\n')
}

const line = (p, e) => `│ ◦ ${p}${e.name}${e.usage ? ` _${e.usage}_` : ''}${e.flags?.premium ? ' 💎' : ''}${e.flags?.owner ? ' 👑' : ''}`

export default [
  {
    command: ['menu', 'help', 'start', '?'],
    category: 'main',
    description: 'Daftar kategori fitur, atau isi satu kategori: .menu <kategori>',
    usage: '[kategori]',
    async run(m, ctx) {
      const { registry, prefix, text, settings } = ctx
      const p = prefix || settings.prefixes[0]
      const menu = registry.menu({ includeOwner: ctx.isOwner })
      const want = text.toLowerCase().trim()

      if (want && want !== 'all') {
        const cat = Object.keys(menu).find((c) => c === want) || Object.keys(menu).find((c) => c.startsWith(want))
        if (!cat) return m.reply(`Kategori *${want}* tidak ada. Ketik *${p}menu* untuk melihat daftar kategori.`)
        const body = [`╭─❖ ${icon(cat)} *${cat.toUpperCase()}* (${menu[cat].length})`, ...menu[cat].map((e) => line(p, e)), '╰──────────────'].join('\n')
        return m.reply({ text: body, contextInfo: adReply(`${icon(cat)} Menu ${cat}`, settings.footer) })
      }

      const cats = Object.entries(menu)
      const body = [
        header(m, ctx),
        '',
        `Ketik *${p}menu <kategori>* untuk melihat isinya, atau *${p}allmenu* untuk semua fitur.`,
        '',
        `╭─❖ *KATEGORI*`,
        ...cats.map(([c, list]) => `│ ${icon(c)} ${c} — ${list.length} fitur`),
        '╰──────────────',
        '',
        `_${settings.footer}_`
      ].join('\n')
      return m.reply({ text: body, contextInfo: adReply(settings.botName, `${cats.length} kategori • ${registry.active().length} fitur`) })
    }
  },
  {
    command: ['allmenu', 'menuall', 'semuamenu'],
    category: 'main',
    description: 'Tampilkan semua fitur',
    async run(m, ctx) {
      const { registry, prefix, settings } = ctx
      const p = prefix || settings.prefixes[0]
      const menu = registry.menu({ includeOwner: ctx.isOwner })
      const parts = [header(m, ctx), readMore]
      for (const [cat, list] of Object.entries(menu)) {
        parts.push('', `╭─❖ ${icon(cat)} *${cat.toUpperCase()}* (${list.length})`, ...list.map((e) => line(p, e)), '╰──────────────')
      }
      parts.push('', `_${settings.footer}_`)
      return m.reply({ text: parts.join('\n'), contextInfo: adReply(settings.botName, 'Semua fitur') })
    }
  },
  {
    command: ['info', 'botinfo', 'stats', 'status', 'runtime'],
    category: 'main',
    description: 'Informasi & statistik bot',
    async run(m, ctx) {
      const { bot, settings } = ctx
      const mem = process.memoryUsage()
      const counts = bot.registry.counts()
      const groups = bot.groupCache.list().length
      const users = Object.keys(bot.db.collection('users')).length
      return m.reply({
        text: [
          `╭─❖ *INFO ${settings.botName.toUpperCase()}*`,
          `│ ⏱️ Aktif: ${runtime(Date.now() - bot.startedAt)}`,
          `│ 💬 Pesan diproses: ${bot.runtime.messages}`,
          `│ ⚡ Perintah dijalankan: ${bot.runtime.commands}`,
          `│ 👥 Grup: ${groups} • 👤 Pengguna: ${users}`,
          `│ 📚 Fitur aktif: ${bot.registry.active().length} (native ${counts.native || 0} • vanXone ${counts.vanxone || 0} • Rubby ${counts.rubby || 0})`,
          `│ 🗄️ Database: ${bot.db.driverName}`,
          `│ 🧠 RAM: ${(mem.rss / 1048576).toFixed(0)} MB / ${(os.totalmem() / 1073741824).toFixed(1)} GB`,
          `│ 🖥️ ${os.platform()} • Node ${process.version}`,
          `│ 🔧 Baileys v7 • ${settings.mode}`,
          `╰──────────────`
        ].join('\n'),
        contextInfo: adReply(settings.botName, 'Statistik bot')
      })
    }
  },
  {
    command: ['owner', 'creator', 'pemilik'],
    category: 'main',
    description: 'Kontak owner bot',
    async run(m, { settings }) {
      const owners = settings.owners || []
      if (!owners.length) return m.reply('Owner belum diatur.')
      const contacts = owners.map((n) => ({
        displayName: settings.ownerName,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${settings.ownerName}\nORG:${settings.botName}\nTEL;type=CELL;type=VOICE;waid=${n}:+${n}\nEND:VCARD`
      }))
      return m.reply({ contacts: { displayName: settings.ownerName, contacts } })
    }
  },
  {
    command: ['totalfitur', 'fitur', 'features'],
    category: 'main',
    description: 'Jumlah fitur per sumber',
    async run(m, { bot }) {
      const c = bot.registry.counts()
      const conflicts = bot.registry.conflicts().length
      return m.reply(`📚 *Total fitur aktif:* ${bot.registry.active().length}\n\n• Native: ${c.native || 0}\n• vanXone: ${c.vanxone || 0}\n• Rubby-MD: ${c.rubby || 0}\n\n${conflicts} nama perintah dipakai lebih dari satu sumber (atur pemenangnya di dashboard → Perintah).`)
    }
  }
]
