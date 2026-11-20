/**
 * Database Rubby — versi terintegrasi.
 * Versi asli memakai sql.js (SQLite di memori). Sekarang semua fungsi diteruskan ke database core
 * bot sehingga premium, data user, pengaturan grup, dan plugin nonaktif sama dengan yang tampil
 * di dashboard dan tersimpan di driver pilihan (JSON / SQLite / MySQL).
 */
import bot from '../../../src/core/bot.js'
import { getGroup, getUser, findUser, isPremium as coreIsPremium } from '../../../src/core/models.js'

const num = (v) => String(v || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
const jidOf = (v) => (num(v) ? `${num(v)}@s.whatsapp.net` : '')

export async function initDatabase() {
  return databaseApi
}

export const databaseApi = {
  getSql: () => null,
  save: () => bot.db.save(),

  isPremium(jidOrNumber) {
    return num(jidOrNumber) ? coreIsPremium(jidOf(jidOrNumber)) : false
  },
  getPremiumUsers() {
    const users = bot.db.collection('users')
    return Object.keys(users).filter((id) => coreIsPremium(id)).map(num)
  },
  addPremium(jidOrNumber, durationMs = 0) {
    if (!num(jidOrNumber)) return false
    const u = getUser(jidOf(jidOrNumber))
    u.premium = true
    u.premiumTime = durationMs > 0 ? Date.now() + durationMs : 0
    bot.db.save()
    return true
  },
  delPremium(jidOrNumber) {
    const u = findUser(jidOf(jidOrNumber))
    if (!u) return false
    u.premium = false
    u.premiumTime = 0
    bot.db.save()
    return true
  },
  getUser(jidOrNumber) {
    if (!num(jidOrNumber)) return null
    const u = getUser(jidOf(jidOrNumber))
    return {
      id: num(jidOrNumber),
      name: u.name,
      limit_count: u.limit,
      exp: u.exp,
      level: u.level,
      role: u.role || 'Beginner',
      premium: u.premium ? 1 : 0,
      premium_time: u.premiumTime || 0,
      registered: u.registered ? 1 : 0,
      reg_time: u.regTime || 0,
      data: u.rubby || {}
    }
  },
  updateUser(jidOrNumber, fields = {}) {
    if (!num(jidOrNumber)) return false
    const u = getUser(jidOf(jidOrNumber))
    const map = { name: 'name', limit_count: 'limit', exp: 'exp', level: 'level', role: 'role', premium_time: 'premiumTime', reg_time: 'regTime' }
    for (const [k, v] of Object.entries(fields)) {
      if (map[k]) u[map[k]] = v
      else if (k === 'premium') u.premium = !!v
      else if (k === 'registered') u.registered = !!v
      else if (k === 'data' && v && typeof v === 'object') u.rubby = v
    }
    bot.db.save()
    return true
  },
  getGroup(groupId) {
    if (!groupId) return {}
    const g = getGroup(groupId)
    return {
      id: groupId,
      name: g.name,
      welcome: !!g.welcome,
      goodbye: !!g.goodbye,
      welcomeText: g.welcomeText,
      goodbyeText: g.goodbyeText,
      mute: !g.botEnabled,
      antilink: g.antilink !== 'off'
    }
  },
  setGroup(groupId, updates = {}) {
    if (!groupId) return false
    const g = getGroup(groupId)
    for (const [k, v] of Object.entries(updates)) {
      if (['welcome', 'goodbye'].includes(k)) g[k] = !!v
      else if (['welcomeText', 'goodbyeText', 'name'].includes(k)) g[k] = String(v ?? '')
      else if (k === 'mute') g.botEnabled = !v
      else if (k === 'antilink') g.antilink = v ? (g.antilink !== 'off' ? g.antilink : 'wa') : 'off'
    }
    bot.db.save()
    return true
  },
  getAllGroups() {
    return Object.keys(bot.db.collection('groups')).map((id) => databaseApi.getGroup(id))
  },
  getDisabledPlugins() {
    return [...(bot.settings.disabledCommands || [])]
  },
  setDisabledPlugins(list = []) {
    bot.saveSettings({ disabledCommands: [...new Set(list.map((x) => String(x).toLowerCase()))] })
    return true
  },
  togglePlugin(pluginName) {
    const name = String(pluginName || '').toLowerCase()
    const list = databaseApi.getDisabledPlugins()
    const idx = list.indexOf(name)
    if (idx === -1) list.push(name)
    else list.splice(idx, 1)
    databaseApi.setDisabledPlugins(list)
    return idx === -1 ? 'disabled' : 'enabled'
  }
}

export default databaseApi
