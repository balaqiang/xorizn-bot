/**
 * Registri perintah gabungan. Setiap sumber ("native", "classic", "extra") mendaftarkan entri:
 *   { id, source, name, aliases[], category, description, usage, flags{}, hidden, file, exec(m, ctx) }
 * Bila nama perintah bentrok, pemenang ditentukan oleh settings.commandProviders (pilihan manual
 * dari dashboard) lalu settings.providerOrder.
 */
import bot from './bot.js'

const CATEGORY_ALIASES = {
  downloader: 'downloader', download: 'downloader', downloads: 'downloader',
  grup: 'group', group: 'group',
  islam: 'islamic', islamic: 'islamic', religi: 'islamic',
  sticker: 'sticker', stiker: 'sticker',
  'ai-image': 'ai-image', ai: 'ai',
  tools: 'tools', tool: 'tools',
  main: 'main', info: 'info',
  owner: 'owner', premium: 'premium',
  game: 'game', games: 'game', fun: 'fun',
  maker: 'maker', canvas: 'maker', ephoto: 'maker',
  nsfw: 'nsfw', search: 'search', stalker: 'stalker',
  convert: 'convert', audio: 'audio', rpg: 'rpg', anime: 'anime'
}

export const normalizeCategory = (c) => {
  const k = String(c || 'other').toLowerCase().trim()
  return CATEGORY_ALIASES[k] || k || 'other'
}

export class CommandRegistry {
  constructor() {
    /** source → Map(name → entry) */
    this.sources = new Map()
    this.entries = new Map() // id → entry
    this.version = 0
  }

  /** Ganti semua entri milik satu sumber. */
  register(source, entries) {
    for (const [id, e] of this.entries) if (e.source === source) this.entries.delete(id)
    const map = new Map()
    for (const e of entries) {
      e.source = source
      e.category = normalizeCategory(e.category)
      e.aliases = [...new Set([e.name, ...(e.aliases || [])].map((a) => String(a).toLowerCase().trim()).filter(Boolean))]
      e.id = e.id || `${source}:${e.name}`
      let n = 2
      while (this.entries.has(e.id)) e.id = `${source}:${e.name}#${n++}`
      this.entries.set(e.id, e)
      for (const alias of e.aliases) if (!map.has(alias)) map.set(alias, e)
    }
    this.sources.set(source, map)
    this.version++
  }

  /** Semua penyedia untuk satu nama perintah, urut prioritas. */
  providers(name) {
    const key = String(name || '').toLowerCase()
    const order = bot.settings?.providerOrder || ['native', 'classic', 'extra']
    const list = []
    for (const src of [...order, ...[...this.sources.keys()].filter((s) => !order.includes(s))]) {
      const e = this.sources.get(src)?.get(key)
      if (e) list.push(e)
    }
    return list
  }

  resolve(name) {
    const key = String(name || '').toLowerCase()
    const list = this.providers(key)
    if (!list.length) return null
    const preferred = bot.settings?.commandProviders?.[key]
    if (preferred) {
      const hit = list.find((e) => e.source === preferred || e.id === preferred)
      if (hit) return hit
    }
    return list[0]
  }

  has(name) {
    return !!this.resolve(name)
  }

  get(id) {
    return this.entries.get(id)
  }

  /** Daftar entri yang aktif (pemenang) — untuk menu. */
  active({ includeHidden = false } = {}) {
    const winners = new Set()
    for (const map of this.sources.values()) {
      for (const name of map.keys()) {
        const e = this.resolve(name)
        if (e) winners.add(e)
      }
    }
    return [...winners].filter((e) => includeHidden || !e.hidden)
  }

  /** Kelompokkan pemenang per kategori → { kategori: [entri] } */
  menu({ includeOwner = true } = {}) {
    const out = {}
    for (const e of this.active()) {
      if (!includeOwner && e.flags?.owner) continue
      ;(out[e.category] ||= []).push(e)
    }
    for (const list of Object.values(out)) list.sort((a, b) => a.name.localeCompare(b.name))
    return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)))
  }

  /** Nama-nama yang dipakai lebih dari satu sumber. */
  conflicts() {
    const names = new Map()
    for (const [src, map] of this.sources) for (const name of map.keys()) (names.get(name) || names.set(name, []).get(name)).push(src)
    return [...names].filter(([, srcs]) => srcs.length > 1).map(([name, sources]) => ({ name, sources }))
  }

  counts() {
    const out = { total: this.entries.size }
    for (const [src, map] of this.sources) {
      const unique = new Set(map.values())
      out[src] = unique.size
    }
    return out
  }
}
