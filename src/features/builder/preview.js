const credentialName = /^(?:(?:x-)?api[-_]?key|key|authorization|proxy-authorization|cookie|set-cookie|.*(?:token|password|secret|credential))$/i

/** One command run shares its redactor across request previews, replies, traces and errors. */
export function createRedactor() {
  const values = new Set()
  const remember = (value) => {
    if (typeof value !== 'string' || !value) return
    const encoded = encodeURIComponent(value.toWellFormed())
    const form = new URLSearchParams([['v', value]]).toString().slice(2)
    const bytes = Buffer.from(value)
    for (const variant of [value, value.toLowerCase(), value.toUpperCase(), encoded, form, bytes.toString('base64'), bytes.toString('base64url'), JSON.stringify(value).slice(1, -1)]) {
      values.add(variant)
      if (variant.includes('%')) values.add(variant.replace(/%[A-F\d]{2}/g, (part) => part.toLowerCase()))
    }
  }
  const rememberCredentials = (entries) => {
    for (const [key, value] of entries) {
      if (!credentialName.test(key)) continue
      remember(value)
      const match = /^(?:Bearer|Basic)\s+(.+)$/i.exec(value)
      if (match) remember(match[1])
    }
  }
  const mask = (text) => {
    // Replace longer matches first (e.g. a complete Authorization header and its token).
    for (const value of [...values].sort((a, b) => b.length - a.length)) text = text.replaceAll(value, '***')
    return text
  }
  return { remember, rememberCredentials, mask }
}

/** Bounded JSON for the dashboard. Keep arrays/objects navigable even when trimmed. */
export function responseSample(value, mask) {
  let remaining = 80
  let limited = false
  function clip(text, length) {
    const safe = mask(text)
    if (safe.length <= length) return safe
    limited = true
    return safe.slice(0, length) + '…'
  }
  function visit(node, depth) {
    remaining--
    if (typeof node === 'string') return clip(node, 300)
    if (typeof node === 'number' && mask(String(node)) !== String(node)) return '***'
    if (node === null || typeof node !== 'object') return node
    const array = Array.isArray(node)
    const sample = array ? [] : Object.create(null)
    let count = 0
    for (const key in node) {
      if (!Object.hasOwn(node, key)) continue
      if (depth >= 6 || remaining <= 0 || count++ >= (array ? 5 : 25)) {
        limited = true
        break
      }
      if (array) {
        sample.push(visit(node[key], depth + 1))
      } else if (credentialName.test(key)) {
        sample[clip(key, 100)] = '***'
        remaining--
      } else {
        const field = clip(key, 100)
        sample[field] = visit(node[key], depth + 1)
      }
    }
    return sample
  }
  const sample = visit(value, 0)
  return limited ? { sample, sampleLimited: true } : { sample }
}
