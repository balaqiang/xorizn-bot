/**
 * Hapus sesi login WhatsApp (dipindah ke data/session-backup, bukan dihapus permanen).
 * Pakai bila bot error "Bad MAC" terus-menerus atau ingin ganti nomor bot.
 *   npm run reset-session
 */
import fs from 'node:fs'
import path from 'node:path'
import { loadConfig } from '../core/config.js'

const { config } = loadConfig()
const dir = config.paths.session
if (!fs.existsSync(dir)) {
  console.log('Tidak ada sesi tersimpan:', dir)
  process.exit(0)
}
const dest = path.join(config.paths.data, 'session-backup', `session-${Date.now()}`)
fs.mkdirSync(path.dirname(dest), { recursive: true })
fs.renameSync(dir, dest)
console.log(`Sesi dipindah ke ${dest}. Jalankan "npm start" untuk login ulang.`)
