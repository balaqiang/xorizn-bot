/**
 * Jembatan penyimpanan untuk pack lama. Modul penyimpanan plugin classic (lib/store.js, lib/jstore.js,
 * lib/db.js, lib/groups.js) memanggil global.__coreStore.open(...) sehingga datanya ikut tersimpan
 * di database pilihan (JSON / SQLite / MySQL). File JSON lama dimigrasikan otomatis sekali.
 */
import fs from 'node:fs'
import bot from '../core/bot.js'
import logger from '../core/logger.js'

const log = logger.child('store')

export function installStoreBridge() {
  global.__coreStore = {
    /**
     * @param {string} name      nama unik, mis. "classic:bans"
     * @param {object} defaults  nilai awal
     * @param {string} [legacyFile] file JSON lama untuk dimigrasikan
     */
    open(name, defaults = {}, legacyFile) {
      const existed = !!bot.db.get('_blobs', name)
      const store = bot.db.blob(name, defaults)
      if (!existed && legacyFile && fs.existsSync(legacyFile)) {
        try {
          const raw = fs.readFileSync(legacyFile, 'utf8').trim()
          if (raw) {
            Object.assign(store.data, JSON.parse(raw))
            store.save()
            log.info(`migrasi ${name} dari ${legacyFile}`)
          }
        } catch (err) {
          log.warn(`gagal migrasi ${legacyFile}: ${err.message}`)
        }
      }
      return store
    }
  }
}
