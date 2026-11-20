/**
 * Titik masuk bot. Urutan start:
 *   config → database → pengaturan → plugin native → pack (vanXone, Rubby) → dashboard → WhatsApp
 */
import fs from 'node:fs'
import path from 'node:path'
import { loadConfig } from './config.js'
import logger, { installConsoleBridge } from './logger.js'
import bot from './core/bot.js'
import { Database, createDriver } from './database/index.js'
import { defaultSettings } from './core/models.js'
import { CommandRegistry } from './core/registry.js'
import { GroupCache, MessageStore } from './core/cache.js'
import { loadNativePlugins } from './core/loader.js'
import { installGlobals, syncGlobals, reassertGlobals } from './compat/globals.js'
import { installStoreBridge } from './compat/store-bridge.js'
import { installExitGuard, realExit } from './core/lifecycle.js'

const log = logger.child('main')
installExitGuard()

async function initDatabase(config) {
  const name = config.database.driver
  try {
    const driver = await createDriver(name, config.database[name] || {}, config.paths.root)
    return await new Database(driver).init()
  } catch (err) {
    if (name === 'json') throw err
    log.error(`database "${name}" gagal: ${err.message}`)
    log.warn('memakai database JSON sementara. Perbaiki pengaturan database di dashboard lalu restart.')
    bot.dbError = err.message
    const driver = await createDriver('json', config.database.json, config.paths.root)
    return new Database(driver).init()
  }
}

async function main() {
  const { config, created, generatedPassword } = loadConfig()
  bot.config = config
  installConsoleBridge()
  log.info(`Bitch Bot v2 — Node ${process.version}`)
  if (created) log.success('config/config.json dibuat dari config.example.json')

  bot.db = await initDatabase(config)
  const settings = bot.db.ensure('settings', 'bot', defaultSettings(config))
  if (!settings.owners?.length) log.warn('Belum ada nomor owner. Isi lewat dashboard → Pengaturan Bot, atau config/config.json → bot.owners.')

  bot.registry = new CommandRegistry()
  bot.groupCache = new GroupCache()
  bot.messageStore = new MessageStore()
  bot.sentIds = new Set()

  installStoreBridge()
  installGlobals()

  // ---------- Plugin native ----------
  const native = await loadNativePlugins(config.paths.plugins)
  bot.registry.register('native', native.entries)
  bot.nativeHooks = native.hooks
  log.success(`${native.entries.length} perintah native dimuat${native.failed.length ? ` (${native.failed.length} gagal)` : ''}`)

  // ---------- Pack ----------
  // Banyak file vanXone memakai path relatif ('./database/...', './engine/...') karena dulu dijalankan
  // dari foldernya sendiri. Core selalu memakai path absolut, jadi direktori kerja dipindah ke pack vanXone.
  if (config.packs.vanxone) {
    const dir = path.join(config.paths.packs, 'vanxone')
    fs.mkdirSync(path.join(dir, 'tmp'), { recursive: true })
    process.chdir(dir)
  }
  if (config.packs.vanxone) {
    try {
      const { loadVanxone } = await import('./compat/vanxone.js')
      bot.packs.vanxone = await loadVanxone()
    } catch (err) {
      log.error('pack vanXone gagal dimuat:', err)
    }
  }
  if (config.packs.rubby) {
    try {
      const { loadRubby } = await import('./compat/rubby.js')
      bot.packs.rubby = await loadRubby()
    } catch (err) {
      log.error('pack Rubby gagal dimuat:', err)
    }
  }
  reassertGlobals()
  syncGlobals()
  const counts = bot.registry.counts()
  log.success(`total ${bot.registry.active().length} perintah aktif (native ${counts.native || 0}, vanxone ${counts.vanxone || 0}, rubby ${counts.rubby || 0})`)

  // ---------- Dashboard ----------
  if (config.dashboard.enabled) {
    const { startDashboard } = await import('./dashboard/server.js')
    await startDashboard()
    if (generatedPassword) log.warn(`Password dashboard dibuat otomatis: ${generatedPassword} (tersimpan di config/config.json)`)
  }

  // ---------- WhatsApp ----------
  if (process.argv.includes('--no-connect')) {
    log.warn('--no-connect: WhatsApp tidak disambungkan (mode uji)')
    return
  }
  const { connect } = await import('./core/connection.js')
  await connect()
}

main().catch((err) => {
  log.error('gagal start:', err)
  realExit(1)
})
