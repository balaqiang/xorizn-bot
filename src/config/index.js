// Adaptor: membaca settings.js (global.*) dan menyusunnya jadi objek config yang dipakai seluruh kode bot.
// Ubah pengaturan di settings.js, bukan di sini.
require('./settings')

const g = global
// global bawaan yang dipakai banyak fitur hasil porting (engine/plus/orbit) sebagai variabel telanjang
if (typeof g.wait === 'undefined') g.wait = '⏳ _Tunggu sebentar..._'
if (typeof g.eror === 'undefined') g.eror = '🚩 Terjadi kesalahan, coba lagi nanti.'
if (typeof g.wm === 'undefined') g.wm = String(g.botname || 'xorizn-bot')
const digits = (x) => String(x || '').replace(/\D/g, '')

const botName = String(g.botname || 'xorizn-bot')
const ownerName = String(g.ownername || botName)
// owner = nomor utama (global.ownernumber) + owner tambahan (global.owner), semuanya dari settings.js
const owners = [...new Set([].concat(g.ownernumber || [], g.owner || []).map(digits).filter(Boolean))]
Object.defineProperty(g, 'owner', { value: owners, writable: false, configurable: false, enumerable: true })
const ownerNumber = owners[0] || ''

const defaults = {
  error: { fitur: 'Terjadi kesalahan pada fitur ini. Coba lagi nanti.' },
  only: {
    group: 'Fitur ini hanya bisa dipakai di grup.',
    owner: 'Fitur ini hanya untuk owner.',
    admin: 'Fitur ini hanya untuk admin grup.',
    badmin: 'Jadikan bot sebagai admin grup dulu.'
  }
}
const mess = {
  error: { ...defaults.error, ...(g.mess?.error || {}) },
  only: { ...defaults.only, ...(g.mess?.only || {}) }
}

module.exports = {
  botName,
  ownerName,
  ownerNumber,
  ownerNumbers: owners,
  prefix: g.prefix || '.',
  sessionDir: g.sessionName || 'session',
  stickerPack: g.packname || g.botname || 'xorizn-bot',
  stickerAuthor: String(g.author || 'xorizn-bot').replace(/\s+/g, ' ').trim(),

  menuMedia: g.thumbnailvid || g.menuMedia || '',
  menuAudio: g.music || '',
  footer: g.footer || '',
  richMode: g.richMode !== false,
  richHints: g.richHints !== false,
  newsletter: { jid: g.channel || '', name: g.channeln || '' },

  downloader: g.downloader || {},
  antilink: g.antilink || { maxWarn: 3 },
  warnLimit: g.warnLimit ?? 3,
  ai: g.ai || {},
  weather: g.weather || { name: 'Jakarta, Indonesia', lat: -6.2088, lon: 106.8456 },

  links: {
    wa: ownerNumber ? `wa.me/${ownerNumber}` : '',
    tg: g.tele ? `t.me/${String(g.tele).replace(/^@/, '')}` : '',
    ig: g.ig ? `instagram.com/${String(g.ig).replace(/^@/, '')}` : '',
    channel: g.saluran || '',
    group: g.wagc || ''
  },
  mess
}
