/**
 * MySQL / MariaDB (misalnya XAMPP). Database dibuat otomatis bila belum ada.
 * Default XAMPP: host 127.0.0.1, port 3306, user root, password kosong.
 */
const CHUNK = 200

export class MysqlDriver {
  constructor(options = {}) {
    this.name = 'mysql'
    this.options = {
      host: options.host || '127.0.0.1',
      port: Number(options.port) || 3306,
      user: options.user || 'root',
      password: options.password || '',
      database: options.database || 'bitch_bot'
    }
    if (!/^[A-Za-z0-9_]+$/.test(this.options.database)) {
      throw new Error('Nama database MySQL hanya boleh huruf, angka, dan underscore.')
    }
    this.pool = null
  }

  describe() {
    const { host, port, user, database } = this.options
    return { host, port, user, database }
  }

  async connect() {
    if (this.pool) return
    const mysql = (await import('mysql2/promise')).default
    const { database, ...server } = this.options
    let conn
    try {
      conn = await mysql.createConnection({ ...server, connectTimeout: 8000 })
    } catch (err) {
      throw new Error(`Tidak bisa terhubung ke MySQL ${server.host}:${server.port} (${err.code || err.message}). Pastikan MySQL di XAMPP sudah di-Start.`)
    }
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    await conn.end()

    this.pool = mysql.createPool({ ...this.options, charset: 'utf8mb4', connectionLimit: 5, waitForConnections: true })
    await this.pool.query(`CREATE TABLE IF NOT EXISTS bot_store (
      collection VARCHAR(64) NOT NULL,
      id VARCHAR(191) NOT NULL,
      data LONGTEXT NOT NULL,
      updated_at BIGINT NOT NULL,
      PRIMARY KEY (collection, id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
  }

  async load() {
    const [rows] = await this.pool.query('SELECT collection, id, data FROM bot_store')
    return rows
  }

  async save({ upserts, deletes, replace }) {
    const conn = await this.pool.getConnection()
    try {
      await conn.beginTransaction()
      if (replace) await conn.query('DELETE FROM bot_store')
      const now = Date.now()
      for (let i = 0; i < upserts.length; i += CHUNK) {
        const part = upserts.slice(i, i + CHUNK)
        await conn.query(
          'INSERT INTO bot_store (collection, id, data, updated_at) VALUES ? ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = VALUES(updated_at)',
          [part.map((u) => [u.collection, String(u.id).slice(0, 191), u.data, now])]
        )
      }
      for (const d of deletes) {
        await conn.query('DELETE FROM bot_store WHERE collection = ? AND id = ?', [d.collection, d.id])
      }
      await conn.commit()
    } catch (err) {
      await conn.rollback().catch(() => {})
      throw err
    } finally {
      conn.release()
    }
  }

  async close() {
    await this.pool?.end().catch(() => {})
    this.pool = null
  }
}
