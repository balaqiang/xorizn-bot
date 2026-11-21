/**
 * Limit harian & pendaftaran pengguna.
 *  - Pengguna free mendapat `settings.limit.daily` limit per hari (reset otomatis tiap ganti tanggal).
 *  - Premium & owner bebas limit.
 *  - Fitur berat menandai biaya lewat `limit: n` di plugin; limit hanya dipotong bila plugin memanggil ctx.spendLimit().
 */
import bot from '../core/bot.js'

/** Tanggal hari ini (YYYY-MM-DD) di zona waktu bot. */
export function today(tz = bot.settings?.timezone || 'Asia/Jakarta') {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

export const dailyLimit = () => Math.max(0, Number(bot.settings?.limit?.daily ?? 20))
export const limitEnabled = () => bot.settings?.limit?.enabled !== false

/** Isi ulang limit bila sudah ganti hari. Mengembalikan sisa limit. */
export function refreshLimit(user) {
  const d = today()
  if (user.limitDay !== d) {
    user.limit = dailyLimit()
    user.limitDay = d
    bot.db.save()
  }
  return user.limit
}

export function spend(user, cost) {
  if (!cost) return
  refreshLimit(user)
  user.limit = Math.max(0, (user.limit || 0) - cost)
  bot.db.save()
}

/** Format: "Nama.Umur", "Nama Umur", atau "Nama|Umur". */
export function parseRegister(text) {
  const t = String(text || '').trim()
  const m = /^(.+?)[.|,\s]+(\d{1,3})$/.exec(t)
  if (!m) return null
  const name = m[1].replace(/\s+/g, ' ').trim().slice(0, 40)
  const age = Number(m[2])
  if (!name) return null
  return { name, age }
}

export function register(user, { name, age }) {
  user.registered = true
  user.regName = name
  user.regAge = age
  user.regTime = Date.now()
  bot.db.save()
}

export function unregister(user) {
  if (!user.registered) return false
  user.registered = false
  user.regName = ''
  user.regAge = 0
  user.regTime = 0
  bot.db.save()
  return true
}
