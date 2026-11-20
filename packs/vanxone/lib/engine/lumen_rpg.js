// lib/anya_rpg.js — inti sistem RPG (status, item, cooldown, katalog) — terhubung ke uang di lib/db.js
'use strict'
const { open } = require('../jstore')
const { getUser, save: saveUsers } = require('../db')
const { userOf } = require('../utils')

const st = open('rpg', { users: {}, guilds: {} })

const EMO = {
  health: '❤️', stamina: '🔋', exp: '✨', money: '💰', bank: '🏦', potion: '🥤', diamond: '💎', emerald: '❇️', gold: '🪙', iron: '⛓️',
  wood: '🪵', rock: '🪨', string: '🕸️', trash: '🗑️', common: '📦', uncommon: '🛍️', mythic: '🎁', legendary: '🗃️',
  pickaxe: '⛏️', sword: '⚔️', axe: '🪓', fishingrod: '🎣', armor: '🥼', ikan: '🐟', lele: '🐟', nila: '🐠', bawal: '🐡', udang: '🦐', kepiting: '🦀', paus: '🐋',
  ayam: '🐓', kambing: '🐐', sapi: '🐄', babi: '🐖', banteng: '🐃', bait: '🪱', pupuk: '🌱',
  apel: '🍎', mangga: '🥭', jeruk: '🍊', pisang: '🍌', anggur: '🍇', ayamgoreng: '🍗', ayambakar: '🍗', rendang: '🍛', steak: '🥩', ikanbakar: '🐟'
}
const emo = (k) => EMO[k] || '▫️'

// harga beli (shop) & jual (sell)
const BUY = { potion: 5000, sword: 15000, pickaxe: 10000, axe: 9000, fishingrod: 12000, armor: 20000, bait: 1000, pupuk: 2500, common: 10000, uncommon: 25000, mythic: 75000, legendary: 200000 }
const SELL = { trash: 50, wood: 120, rock: 150, string: 100, iron: 600, gold: 2500, ikan: 1500, lele: 2000, nila: 2000, bawal: 2500, udang: 3000, kepiting: 3500, paus: 10000, ayam: 5000, kambing: 8000, sapi: 12000, babi: 10000, banteng: 15000, diamond: 9000, emerald: 7000, apel: 800, mangga: 900, jeruk: 700, pisang: 600, anggur: 1000 }
const TOOLS = { pickaxe: 40, sword: 40, axe: 40, fishingrod: 40, armor: 50 }
const FOOD = { ayamgoreng: 20, ayambakar: 20, rendang: 40, steak: 35, ikanbakar: 25 }
const RECIPE = {
  pickaxe: { wood: 10, rock: 5, iron: 5, string: 20 }, sword: { wood: 10, iron: 15 }, axe: { wood: 5, iron: 10 },
  fishingrod: { wood: 10, iron: 2, string: 20 }, armor: { iron: 30, emerald: 1, diamond: 5 }
}
const COOK = { ayamgoreng: { ayam: 1 }, ayambakar: { ayam: 1 }, rendang: { sapi: 1 }, steak: { sapi: 1 }, ikanbakar: { ikan: 1 }}
const CRATE_LOOT = {
  common: { money: [5000, 20000], items: { wood: [1, 8], rock: [1, 6], iron: [0, 3], potion: [0, 1] } },
  uncommon: { money: [15000, 50000], items: { iron: [1, 8], gold: [0, 2], emerald: [0, 2], potion: [0, 2] } },
  mythic: { money: [40000, 120000], items: { gold: [1, 4], emerald: [1, 3], diamond: [0, 3], potion: [1, 3] } },
  legendary: { money: [120000, 400000], items: { diamond: [2, 6], emerald: [2, 6], gold: [3, 8], potion: [2, 5] } }
}

const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
const pick = (l) => l[Math.floor(Math.random() * l.length)]
const rp = (n) => `Rp${Math.round(n).toLocaleString('id-ID')}`
const fmtN = (n) => Math.round(n).toLocaleString('id-ID')

function P(jid) {
  const id = userOf(jid)
  let p = st.data.users[id]
  if (!p) p = st.data.users[id] = { health: 100, stamina: 100, items: {}, dur: {}, cd: {}, atm: 0, rpgExp: 0, quest: null, guild: null, farm: null }
  return p
}
const amt = (p, k) => p.items[k] || 0
function give(p, k, n) { p.items[k] = (p.items[k] || 0) + n; if (p.items[k] <= 0) delete p.items[k] }
const bankCap = (p) => 5_000_000 * (1 + p.atm) * (1 + p.atm) // kapasitas bank naik per level ATM

// cooldown: kembalikan sisa ms (0 = siap) lalu pasang bila siap
function cool(p, key, ms) {
  const left = (p.cd[key] || 0) + ms - Date.now()
  if (left > 0) return left
  p.cd[key] = Date.now()
  return 0
}
const dur = (ms) => { const s = Math.ceil(ms / 1000); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); return `${h ? `${h}j ` : ''}${m ? `${m}m ` : ''}${s % 60}d` }
const bad = (m) => Object.assign(new Error('rpg'), { userMessage: m })

function bar(v, max = 100, n = 10) { const f = Math.max(0, Math.min(n, Math.round((v / max) * n))); return '█'.repeat(f) + '░'.repeat(n - f) }

function addMoney(jid, n) { const u = getUser(jid); u.money += n; if (u.money < 0) u.money = 0; saveUsers(); return u.money }
function addExp(jid, n) { const u = getUser(jid); u.exp += n; saveUsers() }
const wallet = (jid) => getUser(jid)

// pakai alat: berkurang durabilitas, pecah bila 0
function useTool(p, tool, wear = 5) {
  if (!amt(p, tool)) throw bad(`Kamu belum punya ${tool}. Beli di .shop atau buat dengan .craft ${tool}`)
  p.dur[tool] = (p.dur[tool] ?? TOOLS[tool]) - wear
  if (p.dur[tool] <= 0) { give(p, tool, -1); delete p.dur[tool]; return `\n💥 ${tool} kamu rusak!` }
  return `\n🔧 Durabilitas ${tool}: ${p.dur[tool]}/${TOOLS[tool]}`
}
function needStamina(p, n) { if (p.stamina < n) throw bad(`Stamina kurang (${p.stamina}/${n}). Makan (.makan) atau istirahat dulu.`) ; p.stamina -= n }
function needHealth(p, n) { if (p.health < n) throw bad(`Health terlalu rendah (${p.health}). Gunakan .heal`) }
function hurt(p, d) {
  const armor = amt(p, 'armor') ? Math.floor(d * 0.7) : d
  p.health -= armor
  if (p.health <= 0) { p.health = 20; return { dead: true, dmg: armor } }
  return { dead: false, dmg: armor }
}

// pemulihan alami stamina (1/menit) saat dibaca
function regen(p) {
  const now = Date.now()
  const last = p.regenAt || now
  const gain = Math.floor((now - last) / 60000)
  if (gain > 0) { p.stamina = Math.min(100, p.stamina + gain); p.regenAt = last + gain * 60000 } else if (!p.regenAt) p.regenAt = now
}

module.exports = { st, P, amt, give, bankCap, cool, dur, bad, bar, emo, EMO, BUY, SELL, TOOLS, FOOD, RECIPE, COOK, CRATE_LOOT, rnd, pick, rp, fmtN, addMoney, addExp, wallet, useTool, needStamina, needHealth, hurt, regen }
