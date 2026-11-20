/**
 * Launcher: menjalankan src/index.js sebagai proses anak dan menyalakannya ulang bila
 * bot meminta restart (exit code 100, mis. dari dashboard atau perintah .restart)
 * atau bila crash. Dipakai oleh `npm start`.
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const entry = path.join(path.dirname(fileURLToPath(import.meta.url)), 'index.js')
const RESTART_CODE = 100
let crashes = []
let child = null

function start() {
  child = spawn(process.execPath, [...process.execArgv, entry, ...process.argv.slice(2)], {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    env: { ...process.env, BOT_LAUNCHER: '1' }
  })
  child.on('exit', (code, signal) => {
    child = null
    if (stopping) return process.exit(code ?? 0)
    if (signal === 'SIGINT' || signal === 'SIGTERM' || code === 0) return process.exit(0)
    if (code === RESTART_CODE) {
      console.log('\n[launcher] restart diminta, menyalakan ulang bot...\n')
      return start()
    }
    crashes = crashes.filter((t) => Date.now() - t < 60_000)
    crashes.push(Date.now())
    if (crashes.length >= 5) {
      console.error('[launcher] bot crash 5x dalam 1 menit, berhenti. Periksa log di atas.')
      return process.exit(code || 1)
    }
    console.log(`\n[launcher] bot berhenti (kode ${code}), menyalakan ulang dalam 3 detik...\n`)
    setTimeout(start, 3000)
  })
}

// Minta bot berhenti dengan rapi (menyimpan database dulu) lewat IPC. child.kill() di Windows
// langsung mematikan proses, jadi hanya dipakai sebagai cadangan bila bot tidak berhenti dalam 10 detik.
let stopping = false
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    if (!child) return process.exit(0)
    if (stopping) return
    stopping = true
    try {
      child.send({ cmd: 'shutdown' })
    } catch {}
    setTimeout(() => child?.kill('SIGKILL'), 10_000).unref()
  })
}

start()
