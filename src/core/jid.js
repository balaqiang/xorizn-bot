/**
 * Helper JID untuk Baileys v7. Sejak v7 WhatsApp memakai LID (…@lid) di banyak tempat;
 * nomor telepon (PN, …@s.whatsapp.net) tersedia di field *Alt atau lewat lidMapping.
 */
import { jidNormalizedUser, isLidUser, isPnUser, jidDecode } from 'baileys'

export { isLidUser, isPnUser, jidNormalizedUser }

/** "6281234:12@s.whatsapp.net" → "6281234" (bagian user tanpa device). */
export function userPart(jid) {
  if (!jid || typeof jid !== 'string') return ''
  const decoded = jidDecode(jid)
  if (decoded?.user) return decoded.user
  return jid.split('@')[0].split(':')[0]
}

/** Ambil angka saja dari nomor / jid. */
export const digits = (v) => String(v ?? '').replace(/\D/g, '')

/** Nomor apa pun → jid PN normal. */
export function toPnJid(numberOrJid) {
  if (!numberOrJid) return ''
  const s = String(numberOrJid)
  if (s.includes('@')) return jidNormalizedUser(s)
  const d = digits(s)
  return d ? `${d}@s.whatsapp.net` : ''
}

const lidCache = new Map()

/**
 * Ubah LID ke jid PN bila memungkinkan. Mengembalikan jid asli bila tidak ditemukan.
 * Urutan: cache → lidMapping Baileys (hanya pasangan yang pernah terlihat).
 */
export async function resolvePn(sock, jid) {
  if (!jid) return ''
  const norm = jidNormalizedUser(jid) || jid
  if (!isLidUser(norm)) return norm
  if (lidCache.has(norm)) return lidCache.get(norm)
  try {
    const pn = await sock?.signalRepository?.lidMapping?.getPNForLID(norm)
    if (pn) {
      const out = jidNormalizedUser(pn)
      rememberLid(norm, out)
      return out
    }
  } catch {}
  return norm
}

export function rememberLid(lid, pn) {
  if (!lid || !pn || !isLidUser(lid) || !isPnUser(pn)) return
  lidCache.set(jidNormalizedUser(lid), jidNormalizedUser(pn))
  if (lidCache.size > 20_000) lidCache.delete(lidCache.keys().next().value)
}

export function cachedPn(lid) {
  return lidCache.get(jidNormalizedUser(lid))
}

/** Semua identitas (id/lid/phoneNumber) milik participant grup, dinormalisasi. */
export function participantIds(p) {
  if (!p) return []
  if (typeof p === 'string') return [jidNormalizedUser(p)]
  return [p.id, p.lid, p.phoneNumber, p.jid].filter(Boolean).map((j) => jidNormalizedUser(j))
}

/** Apakah participant cocok dengan salah satu jid target (membandingkan PN maupun LID). */
export function participantMatches(p, targets) {
  const ids = participantIds(p)
  const users = new Set(ids.map(userPart))
  for (const t of targets.filter(Boolean)) {
    const n = jidNormalizedUser(t) || t
    if (ids.includes(n) || users.has(userPart(n))) return true
  }
  return false
}

/** Jid terbaik (PN bila ada) untuk participant grup. */
export function participantPn(p) {
  if (!p) return ''
  if (typeof p === 'string') return jidNormalizedUser(p)
  if (p.phoneNumber) return jidNormalizedUser(p.phoneNumber)
  if (p.id && isPnUser(p.id)) return jidNormalizedUser(p.id)
  return jidNormalizedUser(p.id || p.lid || '')
}
