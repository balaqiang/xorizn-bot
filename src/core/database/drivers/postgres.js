/**
 * PostgreSQL / Supabase.
 *
 * Supabase: Project Settings → Database → Connection string → URI (pakai "Session pooler", port 5432).
 *   postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
 * SSL otomatis aktif untuk host di luar komputer ini (ssl: "auto").
 * Tabel dibuat otomatis: bot_store (collection, id, data JSONB, updated_at).
 */
import logger from '../../logger.js'

const log = logger.child('postgres')
const CHUNK = 200
const IDENT = /^[A-Za-z_][A-Za-z0-9_]{0,62}$/
const isLocal = (h) => /^(localhost|127\.|::1$|\[::1\])/.test(String(h || ''))

export class PostgresDriver {
  constructor(options = {}) {
    this.name = 'postgres'
    this.options = {
      connectionString: String(options.connectionString || '').trim(),
      host: options.host || '127.0.0.1',
      port: Number(options.port) || 5432,
      user: options.user || 'postgres',
      password: options.password || '',
      database: options.database || 'postgres',
      ssl: options.ssl ?? 'auto',
      schema: options.schema || 'public',
      table: options.table || 'bot_store'
    }
    if (!IDENT.test(this.options.schema) || !IDENT.test(this.options.table)) throw new Error('Nama schema/tabel Postgres hanya huruf, angka, dan underscore.')
    this.pool = null
    this.tbl = `"${this.options.schema}"."${this.options.table}"`
  }

  target() {
    if (this.options.connectionString) {
      try {
        const u = new URL(this.options.connectionString)
        return { host: u.hostname, port: Number(u.port) || 5432, user: decodeURIComponent(u.username), database: u.pathname.replace(/^\//, '') || 'postgres' }
      } catch {
        throw new Error('Connection string Postgres tidak valid (harus diawali postgresql:// atau postgres://).')
      }
    }
    const { host, port, user, database } = this.options
    return { host, port, user, database }
  }

  describe() {
    return { ...this.target(), schema: this.options.schema, table: this.options.table }
  }

  ssl(host) {
    const s = this.options.ssl
    if (s === false || s === 'off' || s === 'false') return false
    if (s === true || s === 'on' || s === 'true' || (s === 'auto' && !isLocal(host))) return { rejectUnauthorized: false }
    return false
  }

  async connect() {
    if (this.pool) return
    const pg = (await import('pg')).default
    const t = this.target()
    const base = this.options.connectionString
      ? { connectionString: this.options.connectionString.replace(/[?&]sslmode=[^&]*/g, '') }
      : { host: t.host, port: t.port, user: t.user, password: this.options.password, database: t.database }
    this.pool = new pg.Pool({ ...base, ssl: this.ssl(t.host), max: 5, idleTimeoutMillis: 30000, connectionTimeoutMillis: 8000, application_name: 'xorizn-bot' })
    // tanpa handler ini, koneksi idle yang putus akan menjatuhkan proses
    this.pool.on('error', (err) => log.warn('koneksi idle Postgres error:', err.message))
    try {
      await this.pool.query('SELECT 1')
    } catch (err) {
      await this.pool.end().catch(() => {})
      this.pool = null
      const hint = /password authentication/i.test(err.message) ? 'Password salah.' : /does not exist/i.test(err.message) ? 'Database tidak ada.' : /ENOTFOUND|ECONNREFUSED|ETIMEDOUT|timeout/i.test(`${err.code} ${err.message}`) ? 'Server tidak bisa dihubungi.' : ''
      throw new Error(`Tidak bisa terhubung ke Postgres ${t.host}:${t.port} (${err.code || err.message}). ${hint}`.trim())
    }
    await this.ensureTable()
  }

  async ensureTable() {
    await this.pool.query(`CREATE TABLE IF NOT EXISTS ${this.tbl} (
      collection TEXT NOT NULL,
      id TEXT NOT NULL,
      data JSONB NOT NULL,
      updated_at BIGINT NOT NULL,
      PRIMARY KEY (collection, id)
    )`)
  }

  async load() {
    const { rows } = await this.pool.query(`SELECT collection, id, data::text AS data FROM ${this.tbl}`)
    return rows
  }

  async save({ upserts, deletes, replace }) {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      if (replace) await client.query(`DELETE FROM ${this.tbl}`)
      const now = Date.now()
      for (let i = 0; i < upserts.length; i += CHUNK) {
        const part = upserts.slice(i, i + CHUNK)
        const values = []
        const params = []
        part.forEach((u, j) => {
          const b = j * 4
          values.push(`($${b + 1}, $${b + 2}, $${b + 3}::jsonb, $${b + 4})`)
          // JSONB menolak karakter NUL (\u0000) — dibuang dari teks
          params.push(u.collection, String(u.id), String(u.data).replace(/\\u0000/g, ''), now)
        })
        await client.query(
          `INSERT INTO ${this.tbl} (collection, id, data, updated_at) VALUES ${values.join(', ')}
           ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at`,
          params
        )
      }
      for (const d of deletes) await client.query(`DELETE FROM ${this.tbl} WHERE collection = $1 AND id = $2`, [d.collection, String(d.id)])
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {})
      throw err
    } finally {
      client.release()
    }
  }

  async close() {
    await this.pool?.end().catch(() => {})
    this.pool = null
  }
}
