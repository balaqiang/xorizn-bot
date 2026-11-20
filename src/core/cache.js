/**
 * Cache metadata grup (dipakai Baileys lewat `cachedGroupMetadata` supaya tidak query tiap kirim pesan),
 * penyimpanan pesan terakhir (untuk `getMessage` / retry & anti-delete), dan cache counter retry.
 */
import { participantMatches, rememberLid } from './jid.js'

const GROUP_TTL = 5 * 60_000

export class GroupCache {
  constructor() {
    this.map = new Map()
    this.allFetchedAt = 0
  }

  peek(jid) {
    return this.map.get(jid)?.data
  }

  set(jid, data) {
    if (!data) return
    this.map.set(jid, { data, at: Date.now() })
    for (const p of data.participants || []) {
      if (p?.lid && p?.phoneNumber) rememberLid(p.lid, p.phoneNumber)
      else if (p?.id?.endsWith('@lid') && p?.phoneNumber) rememberLid(p.id, p.phoneNumber)
    }
  }

  delete(jid) {
    this.map.delete(jid)
  }

  async get(sock, jid, force = false) {
    if (!jid?.endsWith('@g.us')) return null
    const hit = this.map.get(jid)
    if (!force && hit && Date.now() - hit.at < GROUP_TTL) return hit.data
    try {
      const data = await sock.groupMetadata(jid)
      this.set(jid, data)
      return data
    } catch (err) {
      if (hit) return hit.data
      throw err
    }
  }

  /** Semua grup yang diikuti bot. */
  async all(sock, force = false) {
    if (!force && this.allFetchedAt && Date.now() - this.allFetchedAt < 60_000) {
      return [...this.map.values()].map((v) => v.data)
    }
    const res = await sock.groupFetchAllParticipating()
    const fresh = new Set(Object.keys(res))
    for (const [jid, meta] of Object.entries(res)) this.set(jid, meta)
    for (const jid of this.map.keys()) if (!fresh.has(jid)) this.map.delete(jid)
    this.allFetchedAt = Date.now()
    return Object.values(res)
  }

  /** Terapkan event group-participants.update ke cache tanpa query ulang. */
  applyParticipants({ id, participants = [], action }) {
    const meta = this.peek(id)
    if (!meta) return
    const list = meta.participants || (meta.participants = [])
    for (const p of participants) {
      const obj = typeof p === 'string' ? { id: p } : p
      const idx = list.findIndex((x) => participantMatches(x, [obj.id, obj.lid, obj.phoneNumber]))
      if (action === 'add' && idx === -1) list.push({ ...obj, admin: null })
      else if (action === 'remove' && idx !== -1) list.splice(idx, 1)
      else if ((action === 'promote' || action === 'demote') && idx !== -1) list[idx].admin = action === 'promote' ? 'admin' : null
    }
    meta.size = list.length
  }

  list() {
    return [...this.map.values()].map((v) => v.data)
  }
}

export class MessageStore {
  constructor(limit = 5000) {
    this.limit = limit
    this.map = new Map()
  }
  key(k) {
    return `${k.remoteJid}:${k.id}`
  }
  add(msg) {
    if (!msg?.key?.id || !msg.message) return
    this.map.set(this.key(msg.key), msg)
    if (this.map.size > this.limit) this.map.delete(this.map.keys().next().value)
  }
  get(key) {
    return this.map.get(this.key(key))
  }
  getMessage(key) {
    return this.get(key)?.message
  }
}

/** CacheStore minimal (get/set/del/flushAll) untuk msgRetryCounterCache Baileys. */
export class SimpleCache {
  constructor(ttlMs = 10 * 60_000) {
    this.ttl = ttlMs
    this.map = new Map()
  }
  get(key) {
    const hit = this.map.get(key)
    if (!hit) return undefined
    if (Date.now() > hit.exp) {
      this.map.delete(key)
      return undefined
    }
    return hit.value
  }
  set(key, value) {
    this.map.set(key, { value, exp: Date.now() + this.ttl })
    if (this.map.size > 10_000) this.map.delete(this.map.keys().next().value)
  }
  del(key) {
    this.map.delete(key)
  }
  flushAll() {
    this.map.clear()
  }
}
