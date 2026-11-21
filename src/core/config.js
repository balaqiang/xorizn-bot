/**
 * Konfigurasi "boot" bot: dibaca sekali saat start dari config/config.json.
 * File ini dibuat otomatis dari config/config.example.json pada start pertama.
 * Pengaturan yang bisa diubah saat bot berjalan (nama bot, owner, prefix, mode, dll.)
 * disimpan di database (lihat src/core/settings.js) dan bisa diatur lewat dashboard.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

// file ini ada di src/core → root project dua tingkat di atas
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
export const SRC = path.join(ROOT, 'src')
export const CONFIG_DIR = path.join(ROOT, 'config')
export const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json')
const EXAMPLE_FILE = path.join(CONFIG_DIR, 'config.example.json')

const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v)

/** Gabung dalam: nilai dari `over` menimpa `base`, key baru di example tetap ikut. */
export function deepMerge(base, over) {
  if (!isObject(base) || !isObject(over)) return over === undefined ? base : over
  const out = { ...base }
  for (const [k, v] of Object.entries(over)) out[k] = isObject(v) && isObject(base[k]) ? deepMerge(base[k], v) : v
  return out
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const tmp = `${file}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n')
  fs.renameSync(tmp, file)
}

export function loadConfig() {
  const example = readJson(EXAMPLE_FILE)
  let created = false
  let user = {}
  if (fs.existsSync(CONFIG_FILE)) {
    user = readJson(CONFIG_FILE)
  } else {
    created = true
  }
  const config = deepMerge(example, user)

  // Password dashboard dibuat acak bila kosong, lalu disimpan supaya tetap sama setelah restart.
  let generatedPassword = null
  if (!config.dashboard.password) {
    generatedPassword = crypto.randomBytes(9).toString('base64url')
    config.dashboard.password = generatedPassword
  }

  // Override lewat environment (berguna untuk panel/hosting)
  const env = process.env
  if (env.DB_DRIVER) config.database.driver = env.DB_DRIVER
  if (env.DASHBOARD_PORT) config.dashboard.port = Number(env.DASHBOARD_PORT)
  if (env.DASHBOARD_HOST) config.dashboard.host = env.DASHBOARD_HOST
  if (env.PAIRING_NUMBER) config.bot.pairingNumber = env.PAIRING_NUMBER

  if (created || generatedPassword) writeJson(CONFIG_FILE, config)

  config.paths = {
    root: ROOT,
    data: path.join(ROOT, 'data'),
    tmp: path.join(ROOT, 'data', 'tmp'),
    session: path.resolve(ROOT, config.bot.sessionDir),
    src: SRC,
    plugins: path.join(SRC, 'plugins', 'core'),
    classicPlugins: path.join(SRC, 'plugins'),
    extraPlugins: path.join(SRC, 'plugins', 'extra'),
    lib: path.join(SRC, 'lib'),
    media: path.join(SRC, 'media'),
    assets: path.join(SRC, 'assets')
  }
  for (const dir of [config.paths.data, config.paths.tmp]) fs.mkdirSync(dir, { recursive: true })

  return { config, created, generatedPassword }
}

/** Simpan sebagian config ke config/config.json (dipakai dashboard). Butuh restart untuk berlaku. */
export function saveConfigPatch(patch) {
  const current = fs.existsSync(CONFIG_FILE) ? readJson(CONFIG_FILE) : readJson(EXAMPLE_FILE)
  const next = deepMerge(current, patch)
  writeJson(CONFIG_FILE, next)
  return next
}
