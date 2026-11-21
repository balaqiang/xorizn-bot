import fs from 'node:fs'
import path from 'node:path'

/**
 * SQLite memakai modul bawaan Node (`node:sqlite`, Node >= 22.5) — tanpa kompilasi native.
 * Satu tabel `store(collection, id, data, updated_at)`.
 */
export class SqliteDriver {
  constructor(options = {}, root = process.cwd()) {
    this.name = 'sqlite'
    this.file = path.resolve(root, options.file || 'data/database.sqlite')
    this.db = null
  }

  describe() {
    return { file: this.file }
  }

  async connect() {
    if (this.db) return
    let DatabaseSync
    try {
      ;({ DatabaseSync } = await import('node:sqlite'))
    } catch {
      throw new Error('Driver SQLite butuh Node.js >= 22.5 (modul bawaan node:sqlite). Perbarui Node atau pakai driver "json"/"mysql".')
    }
    fs.mkdirSync(path.dirname(this.file), { recursive: true })
    this.db = new DatabaseSync(this.file)
    this.db.exec('PRAGMA journal_mode = WAL')
    this.db.exec('PRAGMA synchronous = NORMAL')
    this.db.exec(`CREATE TABLE IF NOT EXISTS store (
      collection TEXT NOT NULL,
      id TEXT NOT NULL,
      data TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (collection, id)
    )`)
    this.upsertStmt = this.db.prepare(`INSERT INTO store (collection, id, data, updated_at) VALUES (?, ?, ?, ?)
      ON CONFLICT(collection, id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`)
    this.deleteStmt = this.db.prepare('DELETE FROM store WHERE collection = ? AND id = ?')
  }

  async load() {
    return this.db.prepare('SELECT collection, id, data FROM store').all()
  }

  async save({ upserts, deletes, replace }) {
    const now = Date.now()
    this.db.exec('BEGIN')
    try {
      if (replace) this.db.exec('DELETE FROM store')
      for (const u of upserts) this.upsertStmt.run(u.collection, u.id, u.data, now)
      for (const d of deletes) this.deleteStmt.run(d.collection, d.id)
      this.db.exec('COMMIT')
    } catch (err) {
      this.db.exec('ROLLBACK')
      throw err
    }
  }

  async close() {
    try {
      this.db?.close()
    } catch {}
    this.db = null
  }
}
