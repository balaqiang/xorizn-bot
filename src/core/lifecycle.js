/**
 * Shutdown & restart yang aman. Semua process.exit() (termasuk dari kode pack) diarahkan ke sini
 * supaya database selesai tersimpan dulu. Exit code 100 = minta launcher menyalakan ulang bot.
 */
import bot from './bot.js'
import logger from './logger.js'

const log = logger.child('main')
export const RESTART_CODE = 100
const realExit = process.exit.bind(process)
let shuttingDown = null

export function shutdown(code = 0) {
  if (!shuttingDown) {
    shuttingDown = (async () => {
      log.info(code === RESTART_CODE ? 'restart...' : 'mematikan bot, menyimpan data...')
      const timer = setTimeout(() => realExit(code), 8000)
      try {
        await bot.db?.close()
      } catch (err) {
        log.error('gagal menyimpan saat shutdown:', err)
      }
      clearTimeout(timer)
      realExit(code)
    })()
  }
  return shuttingDown
}

/** Restart penuh. Tanpa launcher (npm run start:raw) bot hanya berhenti. */
export function restart() {
  if (!process.env.BOT_LAUNCHER) log.warn('Bot tidak dijalankan lewat "npm start" (launcher), jadi restart = berhenti. Jalankan ulang manual.')
  return shutdown(RESTART_CODE)
}

export function installExitGuard() {
  process.exit = (code) => {
    shutdown(code ?? 0)
  }
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => shutdown(0))
  // perintah berhenti dari launcher (src/launcher.js)
  process.on('message', (msg) => {
    if (msg?.cmd === 'shutdown') shutdown(0)
  })
  process.on('unhandledRejection', (err) => log.error('unhandledRejection:', err))
  process.on('uncaughtException', (err) => log.error('uncaughtException:', err))
}

export { realExit }
