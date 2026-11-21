// lib/bootstrap.js — dijalankan paling awal oleh bot.js.
// Kalau dependency belum terpasang (kasus umum di panel: user cuma upload script lalu klik Start),
// bot memasang sendiri lewat `npm install`, lalu lanjut jalan. User tidak perlu mengetik apa pun.
'use strict'
const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const root = path.join(__dirname, '..')
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const installed = (name) => fs.existsSync(path.join(root, 'node_modules', ...name.split('/'), 'package.json'))
const missing = () => Object.keys(pkg.dependencies || {}).filter((n) => !installed(n))

function npm(args) {
  const r = cp.spawnSync('npm', args, {
    cwd: root,
    stdio: 'ignore', // senyap: tidak menampilkan log npm di console panel
    shell: process.platform === 'win32',
    env: { ...process.env, npm_config_cache: path.join(root, '.npm-cache'), npm_config_loglevel: 'silent', npm_config_legacy_peer_deps: 'true', npm_config_update_notifier: 'false' }
  })
  return r.status === 0
}

function ensure() {
  let miss = missing()
  if (!miss.length) return
  console.log('[xorizn-bot] Menyiapkan bot, tunggu sebentar...')
  const base = ['install', '--no-audit', '--no-fund', '--legacy-peer-deps']
  // 1) pasang lengkap (termasuk paket opsional); 2) kalau gagal, pasang yang wajib saja
  if (!npm(base)) {
    npm([...base, '--omit=optional'])
  }
  // 3) satu paket bermasalah tidak boleh menggagalkan semuanya: pasang sisanya satu per satu
  miss = missing()
  if (miss.length) {
    for (const n of miss) npm(['install', `${n}@${pkg.dependencies[n]}`, '--no-audit', '--no-fund', '--legacy-peer-deps', '--no-save'])
    miss = missing()
  }
  const CRITICAL = ['@whiskeysockets/baileys', '@hapi/boom', 'pino', 'axios']
  const lackCritical = miss.filter((n) => CRITICAL.includes(n))
  if (lackCritical.length) {
    console.log('\n[xorizn-bot] Paket inti belum terpasang: ' + lackCritical.join(', '))
    console.log('[xorizn-bot] Biasanya karena RAM/disk panel penuh atau koneksi putus. Pastikan RAM panel minimal 1GB dan disk cukup, lalu klik Start lagi.')
    process.exit(1)
  }
  // paket opsional yang gagal cukup dicatat pelan; fitur terkait saja yang tidak jalan
}

try {
  ensure()
} catch (err) {
  console.log('[xorizn-bot] Gagal memeriksa dependency:', err.message)
}
