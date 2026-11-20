/**
 * Logger ringan: warna di console, buffer 1000 baris terakhir, dan event untuk
 * stream log ke dashboard (Server-Sent Events).
 */
import { EventEmitter } from 'node:events'
import util from 'node:util'
import pino from 'pino'

const COLORS = {
  info: '\x1b[36m',
  success: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  debug: '\x1b[90m',
  chat: '\x1b[35m',
  cmd: '\x1b[34m'
}
const RESET = '\x1b[0m'
const DIM = '\x1b[2m'
const MAX_BUFFER = 1000

class Logger extends EventEmitter {
  constructor() {
    super()
    this.setMaxListeners(100)
    this.buffer = []
    this.debugEnabled = process.env.DEBUG === '1'
    /** scope yang tetap masuk buffer/dashboard tapi tidak dicetak ke terminal */
    this.silentScopes = new Set()
  }

  log(level, scope, ...args) {
    if (level === 'debug' && !this.debugEnabled) return
    const message = args
      .map((a) => (a instanceof Error ? a.stack || a.message : typeof a === 'string' ? a : util.inspect(a, { depth: 3, breakLength: 120 })))
      .join(' ')
    const entry = { time: Date.now(), level, scope, message }
    this.buffer.push(entry)
    if (this.buffer.length > MAX_BUFFER) this.buffer.splice(0, this.buffer.length - MAX_BUFFER)
    this.emit('entry', entry)

    if (this.silentScopes.has(scope)) return
    const t = new Date(entry.time).toLocaleTimeString('id-ID', { hour12: false })
    const color = COLORS[level] || ''
    const line = `${DIM}${t}${RESET} ${color}${level.toUpperCase().padEnd(7)}${RESET} ${DIM}[${scope}]${RESET} ${message}\n`
    ;(level === 'error' ? process.stderr : process.stdout).write(line)
  }

  child(scope) {
    const self = this
    return {
      info: (...a) => self.log('info', scope, ...a),
      success: (...a) => self.log('success', scope, ...a),
      warn: (...a) => self.log('warn', scope, ...a),
      error: (...a) => self.log('error', scope, ...a),
      debug: (...a) => self.log('debug', scope, ...a),
      chat: (...a) => self.log('chat', scope, ...a),
      cmd: (...a) => self.log('cmd', scope, ...a)
    }
  }

  recent(limit = 200, level) {
    const list = level ? this.buffer.filter((e) => e.level === level) : this.buffer
    return list.slice(-limit)
  }
}

export const logger = new Logger()
export default logger

/** Logger pino untuk Baileys: hanya warn/error yang diteruskan ke logger kita. */
export function baileysLogger() {
  const level = process.env.BAILEYS_LOG || 'silent'
  return pino({ level })
}

// Pesan berisik dari pustaka pihak ketiga / pack yang tidak perlu ditampilkan
const NOISY = [
  /Bad MAC/i, /No session found to decrypt/i, /Failed to decrypt message/i, /Closing open session/i,
  /SessionEntry/, /Closing session/i, /^\[PLUGIN\] (dimuat|hook dimuat)/
]

/**
 * Semua console.* dari plugin/pack diteruskan ke logger (scope "pack") supaya ikut tampil di
 * halaman Log dashboard. Logger sendiri menulis lewat process.stdout, jadi tidak terjadi loop.
 */
export function installConsoleBridge() {
  const map = { log: 'info', info: 'info', warn: 'warn', error: 'error', debug: 'debug' }
  for (const [method, level] of Object.entries(map)) {
    console[method] = (...args) => {
      const first = typeof args[0] === 'string' ? args[0] : args[0]?.message || ''
      if (NOISY.some((re) => re.test(first))) return
      logger.log(level, 'pack', ...args)
    }
  }
}
