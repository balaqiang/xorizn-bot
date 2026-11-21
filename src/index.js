/**
 * Titik masuk bot. Urutan start:
 *   config → database → pengaturan → plugin native → fitur classic & extra → dashboard → WhatsApp
 */
import fs from 'node:fs'
import path from 'node:path'
import { loadConfig } from './core/config.js'
import logger, { installConsoleBridge } from './core/logger.js'
import bot from './core/bot.js'
import { Database, createDriver } from './core/database/index.js'
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
  log.info(`xorizn-bot v2 — Node ${process.version}`)
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

  // ---------- Fitur classic & extra ----------
  // Banyak file plugin classic/extra memakai path relatif terhadap direktori kerja ('./database/...',
  // './engine/...', './tmp', './package.json'), jadi direktori kerja bot selalu folder src/.
  process.chdir(config.paths.src)
  fs.mkdirSync(path.join(config.paths.src, 'tmp'), { recursive: true })
  if (config.packs.classic) {
    try {
      const { loadClassic } = await import('./compat/classic.js')
      bot.packs.classic = await loadClassic()
    } catch (err) {
      log.error('fitur classic gagal dimuat:', err)
    }
  }
  if (config.packs.extra) {
    try {
      const { loadExtra } = await import('./compat/extra.js')
      bot.packs.extra = await loadExtra()
    } catch (err) {
      log.error('fitur extra gagal dimuat:', err)
    }
  }
  reassertGlobals()
  syncGlobals()
  const counts = bot.registry.counts()
  log.success(`total ${bot.registry.active().length} perintah aktif (native ${counts.native || 0}, classic ${counts.classic || 0}, extra ${counts.extra || 0})`)

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
