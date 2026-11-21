import config from '../../config.js'
import { getDatabase } from '../../src/lib/ourin-database.js'

const pluginConfig = {
  name: 'premshop',
  alias: ['premiumshop', 'buypremium', 'belipremium', 'buyprem'],
  category: 'user',
  description: 'Beli premium memakai koin',
  usage: '.premshop | .buypremium monthly/lifetime',
  example: '.buypremium monthly',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 0,
  energi: 0,
  isEnabled: true,
}

const number = v => String(v || '').replace(/[^0-9]/g, '')
const format = v => Number(v).toLocaleString('id-ID')

function findPremium(db, id) {
  const list = Array.isArray(db.data.premium) ? db.data.premium : []
  return list.findIndex(entry => number(typeof entry === 'string' ? entry : (entry?.id || entry?.jid)) === id)
}

async function handler(m) {
  const db = getDatabase()
  const jid = m.sender
  const cleanId = number(jid)
  const user = db.getUser(jid) || db.setUser(jid)

  if (config.isOwner?.(jid) || user.koin === -1 || user.energi === -1) {
    return m.reply('👑 Owner memiliki koin dan energi unlimited. Premium tidak perlu dibeli.')
  }

  const arg = String(m.args?.[0] || '').toLowerCase()
  const monthly = config.premiumPlans?.monthly || { price: 500000, durationMs: 30 * 24 * 60 * 60 * 1000 }
  const lifetime = config.premiumPlans?.lifetime || { price: 10000000, durationMs: 0 }

  if (!['monthly', 'bulan', '1bulan', 'lifetime', 'permanent', 'permanen', 'selamanya'].includes(arg)) {
    const index = findPremium(db, cleanId)
    const activeRecord = index >= 0 ? db.data.premium[index] : null
    const expiresAt = activeRecord && typeof activeRecord === 'object' ? Number(activeRecord.expired || 0) : 0
    const isActive = Boolean(activeRecord && (typeof activeRecord === 'string' || !expiresAt || expiresAt > Date.now()))
    const isLifetime = Boolean(activeRecord && (typeof activeRecord === 'string' || (typeof activeRecord === 'object' && !expiresAt)))
    const currentBalance = user.koin === -1 ? '∞' : format(user.koin || 0)
    return m.reply(
      `💎 *DENIA PREMIUM SHOP*\n\n` +
      `1. *Monthly — 30 hari*\n` +
      `   Harga: *${format(monthly.price)} koin*\n` +
      `   Command: *.buypremium monthly*\n\n` +
      `2. *Lifetime — selamanya*\n` +
      `   Harga: *${format(lifetime.price)} koin*\n` +
      `   Command: *.buypremium lifetime*\n\n` +
      `Saldo koin: *${currentBalance}*\n` +
      `Status: *${isActive ? (isLifetime ? 'Premium Lifetime' : 'Premium aktif') : (activeRecord ? 'Premium kedaluwarsa' : 'Free')}*\n\n` +
      `_Premium bulanan berlaku 30 hari. Lifetime tidak memiliki tanggal kedaluwarsa._`
    )
  }

  const isLifetimePlan = ['lifetime', 'permanent', 'permanen', 'selamanya'].includes(arg)
  const plan = isLifetimePlan ? lifetime : monthly
  const premiumIndex = findPremium(db, cleanId)
  const existing = premiumIndex >= 0 ? db.data.premium[premiumIndex] : null
  const existingIsLifetime = existing != null && (typeof existing === 'string' || (typeof existing === 'object' && Number(existing.expired || 0) === 0));
  if (existingIsLifetime) {
    return m.reply('💎 Akun kamu sudah memiliki Premium Lifetime. Pembelian tambahan tidak diperlukan.')
  }

  const balance = Number(user.koin || 0)
  if (balance < plan.price) {
    return m.reply(`❌ Koin tidak cukup.\nHarga: *${format(plan.price)} koin*\nSaldo kamu: *${format(balance)} koin*\nKurang: *${format(plan.price - balance)} koin*.`)
  }

  db.updateKoin(jid, -plan.price)
  const now = Date.now()
  let expired = 0
  if (!isLifetimePlan) {
    const oldExpired = existing && typeof existing === 'object' ? Number(existing.expired || 0) : 0
    const base = oldExpired > now ? oldExpired : now
    expired = base + Number(plan.durationMs || 30 * 24 * 60 * 60 * 1000)
  }
  const record = { id: cleanId, expired, name: user.regName || m.pushName || cleanId, addedAt: existing?.addedAt || now, plan: isLifetimePlan ? 'lifetime' : 'monthly' }
  if (premiumIndex >= 0) db.data.premium[premiumIndex] = record
  else db.data.premium.push(record)
  db.setUser(jid, { ...user, isPremium: true, energi: config.energi?.premium ?? 3000 })
  await db.save()

  return m.reply(
    `✅ *Pembelian Premium berhasil!*\n\n` +
    `Plan: *${isLifetimePlan ? 'Lifetime / Selamanya' : 'Monthly / 30 hari'}*\n` +
    `Harga: *${format(plan.price)} koin*\n` +
    `Sisa koin: *${format(db.getUser(jid)?.koin || 0)}*\n` +
    `Energi sekarang: *${format(db.getUser(jid)?.energi || 0)}*\n` +
    (isLifetimePlan ? `Masa aktif: *Selamanya*` : `Masa aktif hingga: *${new Date(expired).toLocaleString('id-ID')}*`)
  )
}

export { pluginConfig as config, handler }
