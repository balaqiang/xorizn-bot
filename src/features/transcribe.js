/**
 * Transkripsi audio (voice note, audio, suara video) lewat 9router (endpoint OpenAI-compatible).
 * OpenCode v2 belum meneruskan lampiran audio ke model, jadi audio diubah ke teks dulu.
 *
 * Butuh API key 9router (dashboard 9router → API Keys) di dashboard bot → AI / OpenCode,
 * atau config/config.json → opencode.router.apiKey.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import bot from '../core/bot.js'
import { runFfmpeg } from './sticker.js'
import { ocConfig } from './opencode.js'

export const DEFAULT_ROUTER = { url: 'http://localhost:20128/v1', apiKey: '', audioModel: '' }

export function routerConfig() {
  return { ...DEFAULT_ROUTER, ...(ocConfig().router || {}) }
}

let modelCache = { at: 0, list: [] }
export async function routerModels() {
  const { url, apiKey } = routerConfig()
  if (Date.now() - modelCache.at < 5 * 60_000 && modelCache.list.length) return modelCache.list
  const res = await fetch(`${url.replace(/\/+$/, '')}/models`, { headers: apiKey ? { authorization: `Bearer ${apiKey}` } : {}, signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`9router /models ${res.status}`)
  const list = (await res.json()).data || []
  modelCache = { at: Date.now(), list }
  return list
}

async function pickAudioModel() {
  const cfg = routerConfig()
  if (cfg.audioModel) return cfg.audioModel
  const list = await routerModels()
  const audio = list.filter((m) => m.capabilities?.audioInput)
  // utamakan model ringan (flash/lite) supaya hemat kuota
  return (audio.find((m) => /lite/.test(m.id)) || audio.find((m) => /flash/.test(m.id)) || audio[0])?.id
}

async function toWav(buffer, ext) {
  const tmp = bot.config?.paths?.tmp || os.tmpdir()
  const id = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
  const input = path.join(tmp, `${id}.${ext || 'bin'}`)
  const out = path.join(tmp, `${id}.wav`)
  fs.writeFileSync(input, buffer)
  try {
    await runFfmpeg(['-i', input, '-vn', '-ac', '1', '-ar', '16000', '-t', '900', out])
    return fs.readFileSync(out)
  } finally {
    fs.rmSync(input, { force: true })
    fs.rmSync(out, { force: true })
  }
}

export class TranscribeUnavailable extends Error {}

/** @returns {Promise<string>} transkrip */
export async function transcribe(buffer, ext = 'ogg') {
  const cfg = routerConfig()
  if (!cfg.apiKey) throw new TranscribeUnavailable('Isi API key 9router di dashboard → AI / OpenCode agar voice note & audio bisa dibaca.')
  const model = await pickAudioModel()
  if (!model) throw new TranscribeUnavailable('Tidak ada model 9router yang mendukung input audio.')
  const wav = await toWav(buffer, ext)
  const res = await fetch(`${cfg.url.replace(/\/+$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${cfg.apiKey}` },
    signal: AbortSignal.timeout(120_000),
    body: JSON.stringify({
      model,
      temperature: 0,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: 'Transkripsikan audio ini kata demi kata dalam bahasa aslinya. Tulis hanya transkripnya. Jika tidak ada ucapan, jelaskan singkat suara yang terdengar dalam tanda kurung.' },
          { type: 'input_audio', input_audio: { data: wav.toString('base64'), format: 'wav' } }
        ]
      }]
    })
  })
  const body = await res.text()
  if (!res.ok) {
    let msg = body
    try { msg = JSON.parse(body).error?.message || body } catch {}
    throw new Error(`transkripsi 9router gagal (${res.status}): ${String(msg).slice(0, 200)}`)
  }
  const json = JSON.parse(body)
  return String(json.choices?.[0]?.message?.content || '').trim()
}
