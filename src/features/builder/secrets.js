/**
 * Rahasia pengguna (API key penyedia lain) untuk perintah kustom.
 * Disimpan terenkripsi AES-256-GCM di database (koleksi "secrets"); kunci enkripsi acak di data/secret.key.
 * Nilai rahasia tidak pernah dikirim ke dashboard maupun chat — hanya dipakai di langkah HTTP lewat {{secret.NAMA}}.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import bot from '../../core/bot.js'

export const SECRET_NAME = /^[A-Z][A-Z0-9_]{0,39}$/
let key = null

function masterKey() {
  if (key) return key
  const file = path.join(bot.config.paths.data, 'secret.key')
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, crypto.randomBytes(32).toString('hex'), { mode: 0o600 })
  }
  key = Buffer.from(fs.readFileSync(file, 'utf8').trim(), 'hex')
  if (key.length !== 32) throw new Error('data/secret.key rusak (harus 64 karakter hex).')
  return key
}

export function listSecrets() {
  return Object.entries(bot.db.collection('secrets')).map(([name, s]) => ({ name, updatedAt: s.updatedAt || 0 })).sort((a, b) => a.name.localeCompare(b.name))
}

export function setSecret(name, value) {
  if (!SECRET_NAME.test(name)) throw new Error('Nama rahasia hanya huruf besar, angka, dan _ (mis. API_KEY_SAYA).')
  const v = String(value ?? '')
  if (!v || v.length > 4000) throw new Error('Nilai rahasia kosong atau terlalu panjang.')
  const iv = crypto.randomBytes(12)
  const c = crypto.createCipheriv('aes-256-gcm', masterKey(), iv)
  const data = Buffer.concat([c.update(v, 'utf8'), c.final()])
  bot.db.set('secrets', name, { iv: iv.toString('base64'), tag: c.getAuthTag().toString('base64'), data: data.toString('base64'), updatedAt: Date.now() })
}

export function deleteSecret(name) {
  const had = !!bot.db.get('secrets', name)
  if (had) bot.db.delete('secrets', name)
  return had
}

export function getSecret(name) {
  const s = bot.db.get('secrets', name)
  if (!s) return undefined
  try {
    const d = crypto.createDecipheriv('aes-256-gcm', masterKey(), Buffer.from(s.iv, 'base64'))
    d.setAuthTag(Buffer.from(s.tag, 'base64'))
    return Buffer.concat([d.update(Buffer.from(s.data, 'base64')), d.final()]).toString('utf8')
  } catch {
    return undefined
  }
}

/** Objek {NAMA: nilai} yang hanya mendekripsi saat dibaca. */
export function secretScope() {
  const out = {}
  for (const name of Object.keys(bot.db.collection('secrets'))) {
    Object.defineProperty(out, name, { enumerable: true, get: () => getSecret(name) })
  }
  return out
}
