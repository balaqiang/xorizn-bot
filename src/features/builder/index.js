/**
 * Perintah kustom (no-code): disimpan di database (koleksi "customCommands"), didaftarkan ke registri
 * sebagai sumber "custom". Error di perintah kustom tidak pernah menjatuhkan bot — hanya dibalas ke pengguna
 * dan dicatat (lastError) untuk ditampilkan di dashboard.
 */
import bot from '../../core/bot.js'
import logger from '../../core/logger.js'
import { validate, run, StepError } from './runner.js'

const log = logger.child('custom')
export const COLLECTION = 'customCommands'
export const SOURCE = 'custom'

export const list = () => Object.values(bot.db.collection(COLLECTION)).sort((a, b) => a.name.localeCompare(b.name))
export const get = (name) => bot.db.get(COLLECTION, String(name || '').toLowerCase())

/** Nama yang dipakai sumber lain (bawaan / paket). */
function takenByOthers(name) {
  return (bot.registry?.providers(name) || []).filter((e) => e.source !== SOURCE)
}

function toEntry(def) {
  return {
    name: def.name,
    aliases: [def.name, ...(def.aliases || [])],
    category: def.category || 'custom',
    description: def.description || 'Perintah kustom',
    usage: def.usage || '',
    hidden: false,
    cooldown: def.cooldown || undefined,
    file: `custom:${def.name}`,
    flags: { ...def.flags },
    custom: true,
    exec: async (m, ctx) => {
      const current = get(def.name) || def
      const res = await run(current, m, ctx)
      const doc = get(def.name)
      if (doc) {
        doc.uses = (doc.uses || 0) + 1
        doc.lastUsed = Date.now()
        if (!res.ok) doc.lastError = { at: Date.now(), message: res.error, step: res.errorStep }
        bot.db.save()
      }
      if (!res.ok) {
        log.warn(`.${def.name} gagal di langkah ${res.errorStep}: ${res.error}`)
        await m.reply(`❌ ${res.error}`).catch(() => {})
        return
      }
      if (res.replies.length) ctx.spendLimit?.()
    }
  }
}

/** Daftarkan ulang semua perintah kustom yang aktif ke registri. */
export function registerAll() {
  if (!bot.registry) return 0
  const entries = []
  for (const def of list()) {
    if (def.enabled === false) continue
    try {
      entries.push(toEntry(def))
    } catch (err) {
      log.warn(`perintah kustom ${def.name} dilewati: ${err.message}`)
    }
  }
  bot.registry.register(SOURCE, entries)
  return entries.length
}

/**
 * Simpan (baru / ubah). opts.override = true → menang atas perintah bawaan bernama sama.
 * Melempar Error dengan pesan yang ramah.
 */
export function save(input, { override = false, previousName = null } = {}) {
  const def = validate(input)
  const prev = previousName ? get(previousName) : null
  const clash = [def.name, ...def.aliases].flatMap((n) => takenByOthers(n).map((e) => ({ name: n, source: e.source })))
  if (clash.length && !override) {
    const names = [...new Set(clash.map((c) => c.name))].join(', ')
    throw new StepError(`Nama ${names} sudah dipakai fitur bawaan. Ganti nama, atau centang "Timpa perintah bawaan".`)
  }
  for (const other of list()) {
    if (other.name === def.name || other.name === previousName) continue
    const theirs = new Set([other.name, ...(other.aliases || [])])
    const dup = [def.name, ...def.aliases].find((n) => theirs.has(n))
    if (dup) throw new StepError(`"${dup}" sudah dipakai perintah kustom .${other.name}.`)
  }
  if (previousName && previousName !== def.name) remove(previousName)
  const now = Date.now()
  const doc = { ...def, override: !!override, createdAt: prev?.createdAt || now, updatedAt: now, uses: prev?.uses || 0, lastUsed: prev?.lastUsed || 0, lastError: null }
  bot.db.set(COLLECTION, def.name, doc)
  const providers = { ...(bot.settings.commandProviders || {}) }
  for (const n of [def.name, ...def.aliases]) {
    if (override && takenByOthers(n).length) providers[n] = SOURCE
    else if (providers[n] === SOURCE) delete providers[n]
  }
  bot.saveSettings({ commandProviders: providers })
  registerAll()
  return doc
}

export function remove(name) {
  const doc = get(name)
  if (!doc) return false
  bot.db.delete(COLLECTION, doc.name)
  const providers = { ...(bot.settings.commandProviders || {}) }
  for (const n of [doc.name, ...(doc.aliases || [])]) if (providers[n] === SOURCE) delete providers[n]
  bot.saveSettings({ commandProviders: providers })
  registerAll()
  return true
}

export function setEnabled(name, enabled) {
  const doc = get(name)
  if (!doc) return null
  doc.enabled = !!enabled
  doc.updatedAt = Date.now()
  bot.db.save()
  registerAll()
  return doc
}

/** Uji coba tanpa mengirim ke WhatsApp (untuk dashboard). */
export async function test(input, { text = '', sender = '6280000000000', name = 'Penguji', isGroup = false } = {}) {
  const def = validate(input)
  const args = text.trim() ? text.trim().split(/\s+/) : []
  const m = {
    chat: isGroup ? '120363000000000000@g.us' : `${sender}@s.whatsapp.net`,
    sender: `${sender}@s.whatsapp.net`,
    pushName: name,
    isGroup,
    quoted: null,
    reply: async () => {},
    react: async () => {}
  }
  const ctx = { text, args, command: def.name, prefix: bot.settings?.prefixes?.[0] || '.', settings: bot.settings, spendLimit: () => {} }
  return run(def, m, ctx, { dryRun: true })
}

export { validate }
