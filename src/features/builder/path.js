/**
 * Pembaca path & template untuk perintah kustom — TANPA eval.
 *
 *  Path   : res.result.images.random   res.data[0].url   args.1   res.list.length
 *  Modifier (dipakai seperti segmen): random, first, last, length/count, reverse, shuffle, keys, values
 *  Template: "Halo {{sender.name}}, judul: {{res.title | upper | default:-}}"
 *  Filter : upper, lower, trim, default:x, truncate:n, join:sep, urlencode, json, number, first, last, random, length
 *
 *  {{secret.NAMA}} hanya bisa dibaca bila opsi allowSecrets aktif (dipakai di langkah HTTP saja).
 */
export class TemplateError extends Error {}

const FORBIDDEN = new Set(['__proto__', 'prototype', 'constructor'])
const MAX_DEPTH = 40

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const asList = (v) => (Array.isArray(v) ? v : v && typeof v === 'object' ? Object.values(v) : null)

/** Modifier bawaan pada nilai saat ini. Mengembalikan { hit, value }. */
function modifier(cur, seg) {
  const list = asList(cur)
  switch (seg) {
    case 'random':
      if (list) return { hit: true, value: list.length ? list[Math.floor(Math.random() * list.length)] : undefined }
      break
    case 'first':
      if (list) return { hit: true, value: list[0] }
      if (typeof cur === 'string') return { hit: true, value: cur[0] }
      break
    case 'last':
      if (list) return { hit: true, value: list[list.length - 1] }
      if (typeof cur === 'string') return { hit: true, value: cur[cur.length - 1] }
      break
    case 'length':
    case 'count':
      if (list) return { hit: true, value: list.length }
      if (typeof cur === 'string') return { hit: true, value: cur.length }
      break
    case 'reverse':
      if (Array.isArray(cur)) return { hit: true, value: [...cur].reverse() }
      break
    case 'shuffle':
      if (list) return { hit: true, value: shuffle(list) }
      break
    case 'keys':
      if (cur && typeof cur === 'object') return { hit: true, value: Object.keys(cur) }
      break
    case 'values':
      if (cur && typeof cur === 'object') return { hit: true, value: Object.values(cur) }
      break
  }
  return { hit: false }
}

/** Pecah path: "a.b[0].c" → ["a","b","0","c"] */
export function splitPath(path) {
  const s = String(path || '').trim()
  if (!s) return []
  const out = []
  for (const part of s.split('.')) {
    const re = /([^[\]]+)|\[(\d+|-?\d+)\]/g
    let m
    let any = false
    while ((m = re.exec(part))) {
      out.push(m[1] ?? m[2])
      any = true
    }
    if (!any && part) out.push(part)
  }
  if (out.length > MAX_DEPTH) throw new TemplateError('Path terlalu panjang.')
  for (const seg of out) if (FORBIDDEN.has(seg)) throw new TemplateError(`Path tidak boleh memakai "${seg}".`)
  return out
}

/** Ambil nilai dari scope berdasarkan path. */
export function getPath(scope, path, { allowSecrets = false, literal = false } = {}) {
  const segs = splitPath(path)
  if (!segs.length) return undefined
  if (segs[0] === 'secret' && !allowSecrets) return '***'
  let cur = scope
  for (const seg of segs) {
    if (cur === undefined || cur === null) return undefined
    if (typeof cur === 'object' || typeof cur === 'string') {
      if (Array.isArray(cur) && /^-?\d+$/.test(seg)) {
        const i = Number(seg)
        cur = cur[i < 0 ? cur.length + i : i]
        continue
      }
      if (typeof cur === 'object' && !Array.isArray(cur) && Object.prototype.hasOwnProperty.call(cur, seg)) {
        cur = cur[seg]
        continue
      }
      if (literal) return undefined
      const mod = modifier(cur, seg)
      if (mod.hit) {
        cur = mod.value
        continue
      }
      if (typeof cur === 'string' && /^\d+$/.test(seg)) {
        cur = cur[Number(seg)]
        continue
      }
      return undefined
    }
    return undefined
  }
  return cur
}

// ---------- filter ----------
function applyFilter(value, name, arg) {
  switch (name) {
    case 'upper':
      return toText(value).toUpperCase()
    case 'lower':
      return toText(value).toLowerCase()
    case 'trim':
      return toText(value).trim()
    case 'default':
      return value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length) ? arg ?? '' : value
    case 'truncate': {
      const n = Math.max(1, Math.min(10000, Number(arg) || 100))
      const t = toText(value)
      return t.length > n ? `${t.slice(0, n)}…` : t
    }
    case 'join':
      return Array.isArray(value) ? value.map(toText).join(arg ?? ', ') : toText(value)
    case 'urlencode':
      return encodeURIComponent(toText(value))
    case 'json':
      return JSON.stringify(value ?? null)
    case 'number': {
      const n = Number(value)
      return Number.isFinite(n) ? n.toLocaleString('id-ID') : toText(value)
    }
    case 'first':
    case 'last':
    case 'random':
    case 'length':
    case 'count':
    case 'reverse':
    case 'shuffle':
    case 'keys':
    case 'values': {
      const mod = modifier(value, name)
      return mod.hit ? mod.value : value
    }
    default:
      throw new TemplateError(`Filter tidak dikenal: ${name}`)
  }
}

/** Nilai → teks untuk ditampilkan. */
export function toText(v) {
  if (v === undefined || v === null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (Array.isArray(v)) return v.map((x) => (typeof x === 'object' ? JSON.stringify(x) : toText(x))).join(', ')
  try {
    return JSON.stringify(v)
  } catch {
    return String(v)
  }
}

/** Evaluasi satu ekspresi "path | filter:arg | filter". */
export function evalExpr(expr, scope, opts = {}) {
  const parts = String(expr).split('|')
  let value = getPath(scope, parts[0].trim(), opts)
  for (const raw of parts.slice(1)) {
    const f = raw.trim()
    if (!f) continue
    const i = f.indexOf(':')
    const name = (i < 0 ? f : f.slice(0, i)).trim().toLowerCase()
    const arg = i < 0 ? undefined : f.slice(i + 1)
    value = applyFilter(value, name, arg)
  }
  return value
}

const TAG = /\{\{\s*([^{}]+?)\s*\}\}/g

/**
 * Render template. Bila seluruh string hanya satu {{ekspresi}}, kembalikan nilai mentahnya
 * (bisa array/objek) — dipakai langkah pick/set. Selain itu kembalikan teks.
 */
export function render(tpl, scope, opts = {}) {
  if (tpl === undefined || tpl === null) return tpl
  if (typeof tpl !== 'string') return tpl
  const whole = /^\s*\{\{\s*([^{}]+?)\s*\}\}\s*$/.exec(tpl)
  if (whole && opts.raw) return evalExpr(whole[1], scope, opts)
  return tpl.replace(TAG, (_, expr) => toText(evalExpr(expr, scope, opts)))
}

/** Render semua string di dalam objek/array (untuk header, query, body JSON). */
export function renderDeep(value, scope, opts = {}, depth = 0) {
  if (depth > 10) throw new TemplateError('Struktur terlalu dalam.')
  if (typeof value === 'string') return render(value, scope, opts)
  if (Array.isArray(value)) return value.map((v) => renderDeep(v, scope, opts, depth + 1))
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) if (!FORBIDDEN.has(k)) out[k] = renderDeep(v, scope, opts, depth + 1)
    return out
  }
  return value
}

/** Cek sintaks template (untuk validasi saat menyimpan). */
export function checkTemplate(tpl) {
  if (typeof tpl !== 'string') return
  for (const m of tpl.matchAll(TAG)) {
    const parts = m[1].split('|')
    splitPath(parts[0].trim())
    for (const raw of parts.slice(1)) {
      const name = raw.split(':')[0].trim().toLowerCase()
      if (name && !['upper', 'lower', 'trim', 'default', 'truncate', 'join', 'urlencode', 'json', 'number', 'first', 'last', 'random', 'length', 'count', 'reverse', 'shuffle', 'keys', 'values'].includes(name)) throw new TemplateError(`Filter tidak dikenal: ${name}`)
    }
  }
}
