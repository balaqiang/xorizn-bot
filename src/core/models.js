/**
 * Bentuk data default untuk pengaturan bot, pengguna, dan grup.
 * Field baru cukup ditambahkan di sini — dokumen lama otomatis dilengkapi (db.ensure).
 */
import bot from './bot.js'
import { digits, userPart, toPnJid } from './jid.js'

export const DEFAULT_WELCOME = 'Halo @user, selamat datang di *@group*! 👋\nKamu anggota ke-@count. Jangan lupa baca deskripsi grup ya.'
export const DEFAULT_GOODBYE = 'Selamat tinggal @user 👋\nSemoga betah di tempat lain.'

export function defaultSettings(config) {
  return {
    botName: config.bot.name || 'Bitch Bot',
    ownerName: config.bot.ownerName || 'Owner',
    owners: (config.bot.owners || []).map(digits).filter(Boolean),
    prefixes: ['.', '!', '#', '/'],
    noPrefix: false,
    mode: 'public', // public | self | group | private
    autoRead: false,
    autoTyping: true,
    alwaysOnline: false,
    antiCall: false,
    antiCallMessage: 'Maaf, bot tidak menerima panggilan. Panggilanmu ditolak otomatis.',
    cooldown: 2,
    packname: config.bot.name || 'Bitch Bot',
    author: config.bot.ownerName || 'Owner',
    footer: `© ${config.bot.name || 'Bitch Bot'}`,
    thumbnail: '',
    timezone: config.bot.timezone || 'Asia/Jakarta',
    welcomeText: DEFAULT_WELCOME,
    goodbyeText: DEFAULT_GOODBYE,
    welcomeBackground: '',
    welcomeColor: '#2dd4bf',
    goodbyeColor: '#f43f5e',
    disabledCommands: [],
    /** override penyedia perintah: { "menu": "native", "tiktok": "rubby" } */
    commandProviders: {},
    /** urutan prioritas bila nama perintah bentrok */
    providerOrder: ['native', 'vanxone', 'rubby'],
    /** respon otomatis global: [{ trigger, response, exact }] */
    autoResponses: [],
    /** stiker yang dipetakan ke perintah: { fileSha256(base64): "menu" } */
    stickerCommands: {}
  }
}

export const DEFAULT_GROUP = {
  name: '',
  botEnabled: true,
  onlyAdmin: false,
  welcome: false,
  goodbye: false,
  welcomeText: '',
  goodbyeText: '',
  welcomeCard: true,
  cardBackground: '',
  promoteNotify: false,
  antilink: 'off', // off | wa | all
  antilinkAction: 'delete', // delete | warn | kick
  antiBadword: false,
  badwords: [],
  warnLimit: 3,
  warns: {},
  nsfw: false,
  antiDelete: false,
  autoSticker: false,
  disabledCommands: [],
  autoResponses: [],
  muted: [],
  joinedAt: 0,
  stats: { messages: 0, commands: 0 }
}

export const DEFAULT_USER = {
  name: '',
  lid: '',
  premium: false,
  premiumTime: 0,
  banned: false,
  banReason: '',
  limit: 50,
  exp: 0,
  level: 0,
  money: 0,
  registered: false,
  afk: -1,
  afkReason: '',
  commands: 0,
  firstSeen: 0,
  lastSeen: 0
}

export function getGroup(jid) {
  return bot.db.ensure('groups', jid, DEFAULT_GROUP)
}

/** Dokumen user disimpan dengan key jid PN (…@s.whatsapp.net) bila diketahui, kalau tidak pakai LID. */
export function getUser(jid) {
  const id = toPnJid(jid)
  const u = bot.db.ensure('users', id, DEFAULT_USER)
  if (!u.firstSeen) u.firstSeen = Date.now()
  return u
}

export function findUser(jid) {
  return bot.db.get('users', toPnJid(jid))
}

export function ownerNumbers() {
  return (bot.settings?.owners || []).map(digits).filter(Boolean)
}

/** Owner bila nomor (atau LID) pengirim ada di daftar owner. */
export function isOwner(...jids) {
  const owners = ownerNumbers()
  const me = userPart(bot.sock?.user?.id || '')
  return jids.filter(Boolean).some((j) => {
    const u = userPart(j)
    return owners.includes(u) || (me && u === me)
  })
}

export function isPremium(jid) {
  if (isOwner(jid)) return true
  const u = findUser(jid)
  if (!u?.premium) return false
  if (u.premiumTime && u.premiumTime < Date.now()) {
    u.premium = false
    u.premiumTime = 0
    bot.db.save()
    return false
  }
  return true
}
