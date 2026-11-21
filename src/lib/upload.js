// lib/upload.js — unggah buffer ke hosting sementara -> link publik ('' kalau semua gagal)
'use strict'

async function post(url, field, buffer, name, extra = {}) {
  const form = new FormData()
  for (const [k, v] of Object.entries(extra)) form.append(k, v)
  form.append(field, new Blob([buffer]), name)
  const res = await fetch(url, { method: 'POST', body: form, signal: AbortSignal.timeout(90000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

async function uploadBuffer(buffer, name = `xorizn-bot-${Date.now()}.bin`) {
  try {
    const out = (await post('https://catbox.moe/user/api.php', 'fileToUpload', buffer, name, { reqtype: 'fileupload' })).trim()
    if (/^https?:\/\//.test(out)) return out
  } catch {}
  try {
    const json = JSON.parse(await post('https://uguu.se/upload', 'files[]', buffer, name))
    const u = json?.files?.[0]?.url
    if (u) return u
  } catch {}
  return ''
}

module.exports = { uploadBuffer }
