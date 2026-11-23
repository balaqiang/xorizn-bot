/**
 * AI chat sederhana lewat penyedia OpenAI-compatible (9router, OpenRouter, Groq, Ollama, dll).
 * Konfigurasi: settings.ai = { baseUrl, apiKey, model, systemPrompt, memory }.
 * Riwayat percakapan disimpan di memori per pengguna per chat (hilang saat restart).
 */
import bot from '../core/bot.js'

const histories = new Map() // key → { at, messages: [] }
const TTL = 30 * 60 * 1000
let modelCache = { key: '', id: '' }

export function aiConfig() {
  const a = bot.settings?.ai || {}
  return {
    baseUrl: String(a.baseUrl || '').replace(/\/+$/, ''),
    apiKey: String(a.apiKey || ''),
    model: String(a.model || ''),
    systemPrompt: String(a.systemPrompt || ''),
    memory: Math.max(0, Math.min(30, Number(a.memory ?? 10)))
  }
}

/** Siap dipakai bila base URL & API key diisi (untuk server lokal tanpa key, isi key apa saja). */
export const aiReady = () => {
  const c = aiConfig()
  return Boolean(c.baseUrl && c.apiKey)
}

const defaultSystem = () => {
  const s = bot.settings || {}
  return `Kamu adalah ${s.botName || 'asisten'}, asisten AI di WhatsApp. Jawab dalam bahasa pengguna (utamakan bahasa Indonesia), ramah, ringkas, dan jelas. Gunakan format WhatsApp (*tebal*, _miring_) seperlunya, tanpa tabel Markdown.`
}

async function request(path, body) {
  const c = aiConfig()
  const res = await fetch(`${c.baseUrl}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${c.apiKey}` },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(120000)
  })
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {}
  if (!res.ok) {
    const msg = json?.error?.message || json?.message || text.slice(0, 200)
    if (res.status === 401 || res.status === 403) throw new Error('API key AI ditolak. Periksa pengaturan AI di dashboard.')
    if (res.status === 429) throw new Error('Kuota / rate limit model habis. Coba lagi nanti atau ganti model di dashboard.')
    throw new Error(`Penyedia AI error (HTTP ${res.status}): ${msg}`)
  }
  return json
}

/** Model aktif: dari pengaturan, atau model pertama yang tersedia di penyedia. */
export async function activeModel() {
  const c = aiConfig()
  if (c.model) return c.model
  const key = `${c.baseUrl}|${c.apiKey.slice(-6)}`
  if (modelCache.key === key && modelCache.id) return modelCache.id
  const list = await request('/models')
  const id = list?.data?.[0]?.id
  if (!id) throw new Error('Belum ada model AI. Isi nama model di dashboard → AI.')
  modelCache = { key, id }
  return id
}

export const historyKey = (m) => `${m.chat}|${m.sender}`
export function clearHistory(m) {
  return histories.delete(historyKey(m))
}

/**
 * Kirim pertanyaan. media = hasil readMessageMedia (opsional).
 * → { text, model }
 */
export async function chat(m, text, media = null) {
  const c = aiConfig()
  const key = historyKey(m)
  const now = Date.now()
  let h = histories.get(key)
  if (!h || now - h.at > TTL) h = { at: now, messages: [] }

  let prompt = text?.trim() || (media?.files?.length ? 'Jelaskan isi lampiran ini.' : '')
  for (const t of media?.texts || []) prompt += `\n\n<lampiran nama="${t.name}">\n${t.text}\n</lampiran>`
  const images = (media?.files || []).filter((f) => f.mime?.startsWith('image/'))
  const content = images.length ? [{ type: 'text', text: prompt }, ...images.map((f) => ({ type: 'image_url', image_url: { url: f.uri } }))] : prompt

  const model = await activeModel()
  const messages = [{ role: 'system', content: c.systemPrompt || defaultSystem() }, ...h.messages, { role: 'user', content }]
  const json = await request('/chat/completions', { model, messages, temperature: 0.7, stream: false })
  const answer = String(json?.choices?.[0]?.message?.content || '').trim()
  if (!answer) throw new Error('AI tidak memberi jawaban. Coba ulangi.')

  // riwayat disimpan sebagai teks saja (gambar tidak diulang ke model)
  h.messages.push({ role: 'user', content: prompt }, { role: 'assistant', content: answer })
  if (c.memory) h.messages = h.messages.slice(-c.memory * 2)
  else h.messages = []
  h.at = now
  histories.set(key, h)
  if (histories.size > 2000) histories.delete(histories.keys().next().value)
  return { text: answer, model }
}
