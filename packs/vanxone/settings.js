/*
 * SETTINGS vanXone — versi terintegrasi.
 *
 * File asli berisi pengaturan + kunci API dalam kode. Sekarang semua nilai diambil dari
 * core bot (config/config.json + pengaturan di dashboard) lewat global.__core yang diisi
 * oleh src/compat/vanxone.js sebelum file ini dimuat. Jangan menaruh kunci rahasia di sini.
 */
'use strict'

const core = global.__core || {}
const s = core.settings || {}
const cfg = core.config || {}
const integrations = cfg.integrations || {}
const owners = (s.owners || []).map((n) => String(n).replace(/\D/g, '')).filter(Boolean)

//================= IDENTITAS =================\\
global.botname = s.botName || 'Bitch Bot'
global.ownername = s.ownerName || 'Owner'
global.ownernumber = owners[0] || ''
global.owner = owners.slice(1)
global.prefix = (s.prefixes && s.prefixes[0]) || '.'
global.sessionName = 'session' // tidak dipakai: sesi login dikelola core (data/session)
global.pairingNumber = ''
global.packname = s.packname || global.botname
global.author = s.author || global.ownername
global.footer = s.footer || `By ${global.botname}`

//================= MENU & TAMPILAN =================\\
const vx = cfg.vanxone || {}
global.thumbnailvid = vx.menuMedia ?? 'https://raw.githubusercontent.com/ManzzyGacor/Urlmanzzy/main/file_1790604438988_521.mp4'
global.music = vx.menuAudio ?? ''
global.channel = vx.channel || ''      // jid saluran untuk label "Diteruskan" ('' = nonaktif)
global.channeln = vx.channelName || ''
global.richMode = vx.richMode !== false
global.richHints = true
global.uiMode = vx.uiMode || 'rich'     // 'rich' = kartu HTML vanXone | 'text' = teks biasa (.uimode text/rich)
global.uiCopy = 'auto'
global.uiPlain = []
global.uiBotJid = '867051314767696@bot'
global.uiNavButtons = false
global.uiTapLink = false

//================= KONTAK =================\\
global.ig = vx.instagram || ''
global.tele = vx.telegram || ''
global.saluran = vx.channelLink || ''
global.wagc = vx.groupLink || ''

//================= GRUP =================\\
global.antilink = { maxWarn: 3 }
global.warnLimit = 3

//================= DOWNLOADER =================\\
global.downloader = Object.assign({
  maxMB: 80,
  maxImages: 10,
  ytQuality: '720',
  cobalt: { url: '', apiKey: '' },
  scriptmind: true,
  ytultra: true,
  cobaltPool: true,
  scrapers: true,
  ytdlp: { path: '', cookies: '', proxy: '', autoInstall: true, maxMinutes: 30 }
}, vx.downloader || {})

//================= API KEY =================\\
global.apiKeys = Object.assign({ kyzz: '', azbry: '', siputzx: '' }, cfg.apiKeys || {})
global.APIs = Object.assign({
  kyzz: 'https://api.kyzzz.xyz',
  siputzx: 'https://api.siputzx.my.id',
  azbry: 'https://api.azbry.com',
  deline: 'https://api.deline.web.id'
}, global.APIs || {})

global.ghTokens = integrations.githubToken || ''
global.userGh = integrations.githubUser || ''
global.tgToken = integrations.telegramToken || ''
global.thumbnail = s.thumbnail || ''
global.fotoreply = s.thumbnail || ''

//================= PAYMENT GATEWAY (AutoOrder QRIS) =================\\
// Isi apiKey milikmu sendiri di config/config.json → integrations.autoorder. Kosong = fitur QRIS mati.
global.autoorder = Object.assign({
  apiKey: '',
  baseUrl: 'https://auto-order.alxzyy.my.id/api/v2',
  minTopup: 1000,
  maxTopup: 1000000,
  topupRate: 1,
  maxPending: 3,
  premium: { 7: 5000, 30: 15000 },
  storageKey: '',
  nokos: false,
  nokosMarkup: { percent: 10, flat: 0 }
}, integrations.autoorder || {})

//================= AI (.ai) =================\\
global.ai = Object.assign({
  provider: 'openai',
  url: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',
  model: 'gpt-4o-mini',
  free: { url: 'https://gen.pollinations.ai/v1/chat/completions', model: 'openai' },
  system: `Kamu adalah ${global.botname}, asisten WhatsApp yang ramah dan membantu. Jawab singkat, jelas, dan dalam bahasa yang dipakai pengguna.`
}, integrations.ai || {})

//================= LAIN-LAIN =================\\
global.weather = vx.weather || { name: 'Jakarta, Indonesia', lat: -6.2088, lon: 106.8456 }

//================= PESAN BOT =================\\
global.mess = Object.assign(global.mess || {}, {
  error: Object.assign(new String('❌ Terjadi kesalahan!'), { fitur: '❌ Terjadi kesalahan pada fitur ini. Coba lagi nanti.' }),
  only: {
    group: '👥 Fitur ini hanya bisa dipakai di grup.',
    owner: '🔒 Fitur ini khusus owner bot.',
    admin: '🛡️ Fitur ini khusus admin grup.',
    badmin: '🤖 Jadikan bot sebagai admin grup dulu.'
  }
})
