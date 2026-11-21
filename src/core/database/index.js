/**
 * Database dokumen sederhana dengan 4 pilihan penyimpanan: JSON, SQLite, MySQL (XAMPP), Postgres (termasuk Supabase).
 *
 * Semua data dimuat ke memori saat start (akses sinkron & cepat untuk bot), lalu perubahan
 * disimpan berkala ke driver yang dipilih. Struktur data: `data[collection][id] = value`.
 * Setiap driver menyimpan baris (collection, id, json) sehingga data bisa dipindah antar driver.
 */
import logger from '../logger.js'

const log = logger.child('db')
const KEY_SEP = '\u0000'

export const DRIVERS = ['json', 'sqlite', 'mysql', 'postgres']

export async function createDriver(name, options, root) {
  switch (name) {
    case 'json': {
      const { JsonDriver } = await import('./drivers/json.js')
      return new JsonDriver(options, root)
    }
    case 'sqlite': {
      const { SqliteDriver } = await import('./drivers/sqlite.js')
      return new SqliteDriver(options, root)
    }
    case 'mysql': {
      const { MysqlDriver } = await import('./drivers/mysql.js')
      return new MysqlDriver(options)
    }
    case 'postgres': {
      const { PostgresDriver } = await import('./drivers/postgres.js')
      return new PostgresDriver(options)
    }
    default:
      throw new Error(`Driver database tidak dikenal: "${name}". Pilihan: ${DRIVERS.join(', ')}`)
  }
}

export class Database {
  constructor(driver, { flushInterval = 10_000 } = {}) {
    this.driver = driver
    this.flushInterval = flushInterval
    this.data = {}
    this.snapshot = new Map()
    this.timer = null
    this.debounce = null
    this.flushing = null
    this.pending = false
    this.lastFlush = 0
  }

  get driverName() {
    return this.driver.name
  }

  async init() {
    await this.driver.connect()
    const rows = await this.driver.load()
    for (const { collection, id, data } of rows) {
      try {
        ;(this.data[collection] ??= {})[id] = JSON.parse(data)
        this.snapshot.set(collection + KEY_SEP + id, data)
      } catch (err) {
        log.warn(`baris rusak dilewati: ${collection}/${id} (${err.message})`)
      }
    }
    this.timer = setInterval(() => this.flush().catch((e) => log.error('gagal menyimpan:', e)), this.flushInterval)
    this.timer.unref?.()
    log.success(`database "${this.driver.name}" siap (${rows.length} baris dimuat)`)
    return this
  }

  // ---------- Akses dasar ----------
  collection(name) {
    return (this.data[name] ??= {})
  }

  get(collection, id) {
    return this.data[collection]?.[id]
  }

  set(collection, id, value) {
    this.collection(collection)[id] = value
    this.save()
    return value
  }

  delete(collection, id) {
    if (this.data[collection]) delete this.data[collection][id]
    this.save()
  }

  /** Ambil dokumen; bila belum ada dibuat dari `defaults`. Key default yang baru ditambahkan otomatis. */
  ensure(collection, id, defaults = {}) {
    const col = this.collection(collection)
    if (!col[id] || typeof col[id] !== 'object') {
      col[id] = structuredClone(defaults)
      this.save()
    } else {
      for (const [k, v] of Object.entries(defaults)) {
        if (!(k in col[id])) col[id][k] = structuredClone(v)
      }
    }
    return col[id]
  }

  /**
   * Penyimpanan satu objek utuh (dipakai pack lama yang dulu menyimpan file JSON sendiri).
   * Mengembalikan { data, save, flush } dan `data` boleh dimutasi langsung.
   */
  blob(name, defaults = {}) {
    const col = this.collection('_blobs')
    if (!col[name] || typeof col[name] !== 'object') col[name] = structuredClone(defaults)
    else for (const [k, v] of Object.entries(defaults)) if (!(k in col[name])) col[name][k] = structuredClone(v)
    return {
      get data() {
        return col[name]
      },
      save: () => this.save(),
      flush: () => this.flush()
    }
  }

  /** Tandai ada perubahan → disimpan ±2 detik kemudian. */
  save() {
    clearTimeout(this.debounce)
    this.debounce = setTimeout(() => this.flush().catch((e) => log.error('gagal menyimpan:', e)), 2000)
    this.debounce.unref?.()
  }

  // ---------- Persistensi ----------
  diff() {
    const upserts = []
    const seen = new Set()
    for (const [collection, docs] of Object.entries(this.data)) {
      if (!docs || typeof docs !== 'object') continue
      for (const [id, value] of Object.entries(docs)) {
        if (value === undefined) continue
        const key = collection + KEY_SEP + id
        seen.add(key)
        let json
        try {
          json = JSON.stringify(value)
        } catch (err) {
          log.warn(`tidak bisa disimpan (${collection}/${id}): ${err.message}`)
          continue
        }
        if (this.snapshot.get(key) !== json) upserts.push({ collection, id, data: json })
      }
    }
    const deletes = []
    for (const key of this.snapshot.keys()) {
      if (!seen.has(key)) {
        const [collection, id] = key.split(KEY_SEP)
        deletes.push({ collection, id })
      }
    }
    return { upserts, deletes }
  }

  async flush() {
    if (this.flushing) {
      // Penyimpanan yang sedang jalan memakai data lama: tunggu selesai, lalu simpan lagi supaya
      // pemanggil (mis. close() saat shutdown) baru selesai setelah perubahan terbarunya tersimpan.
      this.pending = true
      await this.flushing.catch(() => {})
      return this.flush()
    }
    const { upserts, deletes } = this.diff()
    if (!upserts.length && !deletes.length) return
    this.flushing = (async () => {
      try {
        await this.driver.save({ upserts, deletes, data: this.data })
        for (const u of upserts) this.snapshot.set(u.collection + KEY_SEP + u.id, u.data)
        for (const d of deletes) this.snapshot.delete(d.collection + KEY_SEP + d.id)
        this.lastFlush = Date.now()
      } finally {
        this.flushing = null
      }
    })()
    await this.flushing
    if (this.pending) {
      this.pending = false
      await this.flush()
    }
  }

  /** Salin seluruh data ke driver lain (untuk pindah JSON ⇄ SQLite ⇄ MySQL). */
  async exportTo(target) {
    await target.connect()
    const rows = []
    for (const [collection, docs] of Object.entries(this.data)) {
      for (const [id, value] of Object.entries(docs || {})) {
        if (value !== undefined) rows.push({ collection, id, data: JSON.stringify(value) })
      }
    }
    await target.save({ upserts: rows, deletes: [], data: this.data, replace: true })
    await target.close?.()
    return rows.length
  }

  stats() {
    const collections = {}
    for (const [name, docs] of Object.entries(this.data)) collections[name] = Object.keys(docs || {}).length
    return { driver: this.driver.name, collections, lastFlush: this.lastFlush, info: this.driver.describe?.() }
  }

  async close() {
    clearInterval(this.timer)
    clearTimeout(this.debounce)
    await this.flush().catch((e) => log.error('flush terakhir gagal:', e))
    await this.driver.close?.()
  }
}
