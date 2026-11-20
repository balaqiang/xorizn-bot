// libsignal mencetak tumpukan error panjang setiap kali satu pesan gagal didekripsi. Ringkas jadi satu baris per menit.
const PATTERN = /Failed to decrypt message with any known session|Session error|Bad MAC|MessageCounterError|Closing open session|Closing session|No matching sessions found|Over 2000 messages into the future/i
let count = 0
let timer = null
let total = 0

function flush() {
  timer = null
  const n = count
  count = 0
  total += n
  if (!n) return
  console.log(`[SIGNAL] ${n} pesan gagal didekripsi dalam semenit (Bad MAC / sesi tidak sinkron). ${n >= 15 ? 'Terlalu banyak — pastikan HANYA SATU proses bot yang jalan, lalu jalankan: node clean-session.js' : 'Biasanya pulih sendiri.'}`)
}

function install() {
  for (const level of ['error', 'warn', 'info']) {
    const orig = console[level].bind(console)
    console[level] = (...args) => {
      const first = typeof args[0] === 'string' ? args[0] : args[0]?.message || ''
      if (PATTERN.test(first) || (args[0] instanceof Error && PATTERN.test(args[0].message))) {
        count++
        timer ||= setTimeout(flush, 60000).unref?.() || timer
        return
      }
      orig(...args)
    }
  }
}

module.exports = { install, PATTERN, _flush: flush, _stats: () => ({ count, total }) }
