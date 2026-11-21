/**
 * Variabel global yang diharapkan plugin classic & extra. Diisi dari pengaturan core
 * dan disinkronkan lagi setiap kali pengaturan berubah (mis. lewat dashboard).
 */
import fs from 'node:fs'
import path from 'node:path'
import { AIRich } from 'xorizn-baileys'
import bot from '../core/bot.js'
import { digits } from '../core/jid.js'

const REACTIONS = { loading: '⏳', wait: '⏳', process: '⏳', success: '✅', done: '✅', error: '❌', fail: '❌' }

/** global.API gabungan: kompatibel gaya extra (nama/URL + nama parameter apikey) & classic. */
function apiUrl(name, p = '/', params = {}, keyParam) {
  const apis = global.APIs || {}
  const base = String(apis[name] || (/^https?:\/\//i.test(name) ? name : '')).replace(/\/+$/, '')
  if (!base) throw new Error(`API "${name}" belum terdaftar di global.APIs.`)
  const key = (global.apiKeys || {})[name] || (global.APIKeys || {})[base] || (global.APIKeys || {})[name]
  const u = new URL(base + '/' + String(p).replace(/^\/+/, ''))
  for (const [k, v] of Object.entries(params || {})) if (v !== undefined && v !== null) u.searchParams.set(k, String(v))
  if (key) u.searchParams.set(keyParam || 'apikey', key)
  return u.toString()
}

export function installGlobals() {
  const { config } = bot
  const root = config.paths.root
  const thumbFile = path.join(config.paths.assets, 'images', 'thumbnail.jpg')
  let thumbCache = null

  global.__core = { bot, config, settings: bot.settings }
  global.owner = [...new Set((bot.settings.owners || []).map(digits).filter(Boolean))]
  global.startTime = bot.startedAt
  global.searchCache = global.searchCache || {}
  global.AIRich = AIRich
  global.website = bot.settings.website || bot.settings.channel?.url || 'https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R'
  // JID channel WhatsApp bot (diisi otomatis dari link channel saat bot tersambung) — dipakai label "Diteruskan dari channel"
  Object.defineProperty(global, 'channelJid', { configurable: true, get: () => bot.settings.channel?.jid || undefined })
  Object.defineProperty(global, 'channelLink', { configurable: true, get: () => bot.settings.channel?.url || '' })
  global.thumb = path.join(config.paths.media, 'thumb.jpg')
  global.getThumbBuffer = () => {
    if (!thumbCache) thumbCache = fs.existsSync(thumbFile) ? fs.readFileSync(thumbFile) : Buffer.alloc(0)
    return thumbCache
  }
  global.react = async (sock, m, kind) => {
    const emoji = REACTIONS[kind] ?? kind
    const key = m?.key || m?.raw?.key
    const jid = m?.chat || key?.remoteJid
    if (!sock || !jid || !key) return
    return sock.sendMessage(jid, { react: { text: emoji, key } }).catch(() => {})
  }

  Object.defineProperty(global, 'mode', {
    configurable: true,
    get: () => bot.settings.mode,
    set: (v) => bot.saveSettings({ mode: String(v || 'public') })
  })

  // Kunci API (dipakai kedua pack)
  global.apiKeys = { ...(config.apiKeys || {}) }
  global.APIs = { kyzz: 'https://api.kyzzz.xyz', siputzx: 'https://api.siputzx.my.id', azbry: 'https://api.azbry.com', deline: 'https://api.deline.web.id', ...(global.APIs || {}) }
  global.APIKeys = Object.fromEntries(Object.entries(global.apiKeys).filter(([, v]) => v).map(([k, v]) => [global.APIs[k] || k, v]))
  global.API = apiUrl
  global.tokengh = config.integrations?.githubToken || ''

  global.mess = {
    wait: '⏳ Sedang diproses...',
    success: '✅ Berhasil!',
    error: Object.assign(new String('❌ Terjadi kesalahan!'), { fitur: '❌ Terjadi kesalahan pada fitur ini. Coba lagi nanti.' }),
    only: {
      group: '👥 Fitur ini hanya bisa dipakai di grup.',
      owner: '🔒 Fitur ini khusus owner bot.',
      admin: '🛡️ Fitur ini khusus admin grup.',
      badmin: '🤖 Jadikan bot sebagai admin grup dulu.'
    },
    owner: '🔒 Fitur ini khusus owner bot.',
    admin: '🛡️ Fitur ini khusus admin grup.',
    group: '👥 Fitur ini hanya bisa dipakai di grup.',
    private: '💬 Fitur ini hanya bisa dipakai di chat pribadi.',
    bot: '🤖 Jadikan bot sebagai admin grup dulu.',
    query: { text: 'Masukkan teks/query-nya.' }
  }
  syncGlobals()
  bot.on('settings', syncGlobals)
}

/** Dipanggil setelah pack dimuat: pack bisa menimpa global.API/mess dengan versinya sendiri. */
export function reassertGlobals() {
  global.API = apiUrl
  global.apiKeys = Object.assign(global.apiKeys || {}, Object.fromEntries(Object.entries(bot.config.apiKeys || {}).filter(([, v]) => v)))
}

/** Sinkronkan nilai yang bisa berubah saat bot berjalan. */
export function syncGlobals() {
  const s = bot.settings
  global.__core.settings = s
  const owners = [...new Set((s.owners || []).map(digits).filter(Boolean))]
  // global.owner bisa dikunci (non-writable) oleh plugin classic → ubah isinya, bukan referensinya
  if (Array.isArray(global.owner)) global.owner.splice(0, global.owner.length, ...owners)
  global.botName = global.namaBot = s.botName
  global.botCreator = global.namaOwner = s.ownerName
  global.botname = s.botName
  global.ownername = s.ownerName
  global.packname = s.packname
  global.author = s.author
  global.footer = s.footer
  global.wm = s.botName
  global.prefix = s.prefixes?.[0] || '.'
  global.noBot = digits(bot.sock?.user?.id?.split(':')[0] || '')
}
