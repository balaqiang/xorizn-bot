// Pemasangan plugin dari WhatsApp (.addfitur). Kode diuji dulu di folder staging sebelum benar-benar dipasang.
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const ROOT = path.join(__dirname, '..')
const PDIR = path.join(ROOT, 'plugins')
const STAGE = path.join(PDIR, '.stage') // sedalam plugins/<kategori>/ agar require('../../lib/..') tetap benar
const BACKUP = path.join(ROOT, 'database', 'plugin-backup')
const MAX_BYTES = 200 * 1024
const PROTECTED = new Set(['addfitur', 'delfitur', 'getfitur', 'reloadfitur', 'menu', 'restart'])

let busy = false

const TEMPLATE = `module.exports = {
  name: 'contoh',
  command: ['contoh', 'cth'],
  category: 'tools',
  desc: 'Deskripsi singkat fitur',
  usage: '<teks>',
  // owner: true,   // hanya owner
  // group: true,   // hanya di grup
  // admin: true,   // hanya admin grup
  run: async ({ sock, msg, from, sender, args, text, prefix, reply }) => {
    if (!text) return reply(\`Contoh: \${prefix}contoh halo\`)
    await reply(\`Kamu menulis: \${text}\`)
  }
}`

const commandsOf = (p) => (Array.isArray(p.command) ? p.command : [p.command]).map((c) => String(c).toLowerCase())
const validName = (s) => /^[a-z0-9][a-z0-9_-]{0,38}$/i.test(s || '')
const categories = () => {
  const dirs = fs.existsSync(PDIR) ? fs.readdirSync(PDIR, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith('.') && !['core', 'extra'].includes(e.name)).map((e) => e.name) : []
  return [...new Set([...require('./categories').ORDER, ...dirs])].filter((c) => c !== 'system') // 'system' = hook tanpa perintah, bukan kategori menu
}

// Buang pagar kode ``` yang sering ikut tertempel dari chat
function cleanCode(raw) {
  let c = String(raw || '').replace(/\r\n/g, '\n').trim()
  const m = c.match(/^```[a-z]*\n([\s\S]*?)\n?```$/i)
  if (m) c = m[1]
  return c.replace(/^\u200b|\u200b$/g, '').trim() + '\n'
}

function diagnose(code) {
  if (/^\s*(import\s.+from\s|export\s+(default|const|function|async))/m.test(code)) {
    return 'Kode memakai import/export (ESM). Plugin harus CommonJS: pakai require(...) dan module.exports = { ... }.'
  }
  if (!/module\.exports|exports\./.test(code)) {
    return 'Ini skrip mandiri, bukan plugin. Bungkus dalam module.exports = { name, command, category, desc, run }. Lihat contoh: .addfitur template'
  }
  return null
}

function syntaxCheck(file) {
  const r = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8', timeout: 15000 })
  if (r.status === 0) return null
  const lines = String(r.stderr).split('\n').map((l) => l.trim()).filter(Boolean)
  const where = lines.find((l) => /:\d+$/.test(l)) || ''
  const msg = lines.find((l) => /Error/.test(l)) || lines[0] || 'kesalahan sintaks'
  return `${msg}${where ? ` (${path.basename(where).replace(/^[^:]*:/, 'baris ')})` : ''}`
}

// opts: { code, category?, name, force?, current: [plugin...], reload: () => hasil }
function install({ code, category, name, force = false, current, reload }) {
  if (busy) return { error: 'Sedang ada proses pemasangan lain. Coba sebentar lagi.' }
  if (!validName(name)) return { error: 'Nama file tidak valid. Pakai huruf/angka/_/- saja (maks 39 karakter).' }
  if (Buffer.byteLength(code) > MAX_BYTES) return { error: `Kode terlalu besar (maks ${MAX_BYTES / 1024} KB).` }
  const hint = diagnose(code)
  if (hint) return { error: hint }

  busy = true
  fs.mkdirSync(STAGE, { recursive: true })
  const staged = path.join(STAGE, `${Date.now()}-${name}.js`)
  let target
  try {
    fs.writeFileSync(staged, code)

    const syn = syntaxCheck(staged)
    if (syn) return { error: `Kesalahan sintaks: ${syn}` }

    // muat sekali untuk memeriksa bentuknya
    let plugin
    try {
      delete require.cache[require.resolve(staged)]
      plugin = require(staged)
    } catch (e) {
      const mod = String(e.message).match(/Cannot find module '([^'./][^']*)'/)
      return { error: mod ? `Modul "${mod[1]}" belum terpasang. Jalankan di server: npm install ${mod[1]}` : `Gagal memuat kode: ${String(e.message).slice(0, 160)}` }
    } finally {
      delete require.cache[staged]
    }
    if (!plugin || typeof plugin.run !== 'function' || !plugin.command) return { error: 'Format plugin salah: wajib ada run (fungsi) dan command. Lihat contoh: .addfitur template' }
    const cmds = commandsOf(plugin)

    const cat = category || (categories().includes(require('./categories').canon(plugin.category)) ? require('./categories').canon(plugin.category) : 'custom')
    if (!validName(cat)) return { error: 'Nama kategori/folder tidak valid.' }
    target = path.join(PDIR, cat, `${name}.js`)
    if (!target.startsWith(PDIR + path.sep)) return { error: 'Lokasi tidak diizinkan.' }
    if (PROTECTED.has(name) || cmds.some((c) => PROTECTED.has(c))) return { error: 'Nama/perintah itu dilindungi dan tidak boleh ditimpa.' }

    // bentrok perintah dengan plugin lain
    const clash = []
    for (const c of cmds) {
      const owner = current.find((p) => commandsOf(p).includes(c) && p.__file !== target)
      if (owner) clash.push(`.${c} (${path.relative(PDIR, owner.__file || '?')})`)
    }
    if (clash.length) return { error: `Perintah sudah dipakai plugin lain: ${clash.join(', ')}. Ganti command-nya.` }

    const existed = fs.existsSync(target)
    if (existed && !force) return { error: `Plugin ${cat}/${name}.js sudah ada. Tambahkan -f untuk menimpa (yang lama dicadangkan).` }
    let backup = null
    if (existed) {
      fs.mkdirSync(BACKUP, { recursive: true })
      backup = path.join(BACKUP, `${cat}-${name}-${Date.now()}.js`)
      fs.copyFileSync(target, backup)
    }

    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.renameSync(staged, target)
    const res = reload()
    const bad = (res.failed || []).find((f) => path.join(PDIR, f.file) === target)
    if (bad) {
      // gagal setelah dipasang: kembalikan keadaan semula
      if (backup) fs.copyFileSync(backup, target)
      else fs.rmSync(target, { force: true })
      reload()
      return { error: `Gagal dimuat setelah dipasang (${String(bad.error).slice(0, 120)}). Dikembalikan seperti semula.` }
    }
    return { ok: true, cat, name, cmds, overwritten: existed, backup: backup && path.basename(backup), plugin }
  } finally {
    fs.rmSync(staged, { force: true })
    busy = false
  }
}

function remove({ plugin, reload }) {
  const file = plugin.__file
  if (!file || !file.startsWith(PDIR + path.sep)) return { error: 'Lokasi plugin tidak dikenali.' }
  const base = path.basename(file, '.js')
  if (PROTECTED.has(base) || commandsOf(plugin).some((c) => PROTECTED.has(c))) return { error: 'Plugin inti dilindungi dan tidak boleh dihapus.' }
  fs.mkdirSync(BACKUP, { recursive: true })
  const backup = path.join(BACKUP, `${path.basename(path.dirname(file))}-${base}-${Date.now()}.js`)
  fs.copyFileSync(file, backup)
  fs.rmSync(file, { force: true })
  reload()
  return { ok: true, file: path.relative(PDIR, file), backup: path.basename(backup) }
}

module.exports = { install, remove, cleanCode, TEMPLATE, commandsOf, categories, validName, PDIR, BACKUP, PROTECTED }
