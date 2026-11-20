/**
 * Konteks bersama seluruh aplikasi. Modul lain mengimpor `bot` lalu membaca
 * bot.sock / bot.db / bot.settings / bot.registry yang diisi saat start (src/index.js).
 *
 * Event yang dipancarkan (dipakai dashboard via SSE):
 *  - 'status'      perubahan status koneksi
 *  - 'command'     perintah dijalankan
 *  - 'groups'      daftar grup berubah
 */
import { EventEmitter } from 'node:events'

class Bot extends EventEmitter {
  constructor() {
    super()
    this.setMaxListeners(100)
    this.config = null
    this.db = null
    this.sock = null
    this.registry = null
    this.packs = {}
    this.startedAt = Date.now()
    this.status = {
      connection: 'idle', // idle | connecting | qr | pairing | open | close | logged_out
      qr: null,
      pairingCode: null,
      me: null,
      lastDisconnect: null,
      since: Date.now()
    }
    this.runtime = { messages: 0, commands: 0, errors: 0 }
  }

  setStatus(patch) {
    Object.assign(this.status, patch, { since: Date.now() })
    this.emit('status', this.status)
  }

  /** Pengaturan bot (tersimpan di database, bisa diubah lewat dashboard & perintah owner). */
  get settings() {
    return this.db.get('settings', 'bot')
  }

  saveSettings(patch = {}) {
    Object.assign(this.settings, patch)
    this.db.save()
    this.emit('settings', this.settings)
    return this.settings
  }

  get isConnected() {
    return this.status.connection === 'open'
  }
}

export const bot = new Bot()
export default bot
