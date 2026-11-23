// Run against a named disposable instance created by up.mjs. All services bind only to loopback.
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { encryptedStream } from 'baileys'
import sharp from 'sharp'
import { FIXTURE, http, login, parseArgs, readInstance } from './lib.mjs'

const inst = readInstance(String(parseArgs().name || 'v1'))
const cookie = await login(inst)
const api = async (method, route, body) => {
  const response = await http(method, inst.dashboardUrl + route, { cookie, body })
  assert.equal(response.status, 200, method + ' ' + route)
  return response.json
}
async function chat(text, options = {}) {
  const response = await http('POST', inst.controlUrl + '/chat', {
    body: { text, from: FIXTURE.owner, noPace: true, idleMs: 250, ...options }
  })
  assert.equal(response.status, 200)
  return response.json
}
function hasReply(result, value) {
  return result.replies.some((call) => call.jid === result.input.chat && call.args[1]?.text === value)
}

const png = await sharp({ create: { width: 8, height: 6, channels: 3, background: '#15764a' } }).png().toBuffer()
const attachment = await encryptedStream(png, 'image')
const encryptedImage = await fs.readFile(attachment.encFilePath)
await fs.unlink(attachment.encFilePath)
const hookSecret = 'local-fixture-webhook-secret'
const aiKey = 'local-fixture-ai-key'
const webhookEvents = []
const server = createServer(async (req, res) => {
  if (req.url === '/photo') return res.end(encryptedImage)
  let raw = ''
  for await (const chunk of req) raw += chunk
  const body = raw ? JSON.parse(raw) : {}
  res.setHeader('content-type', 'application/json')
  if (req.url === '/hook') {
    const signature = 'sha256=' + createHmac('sha256', hookSecret).update(raw).digest('hex')
    if (req.headers['x-xorizn-signature'] !== signature) return res.writeHead(401).end('{}')
    webhookEvents.push(body)
    return res.end(JSON.stringify({ reply: 'n8n/' + body.event }))
  }
  if (req.headers.authorization !== 'Bearer ' + aiKey) return res.writeHead(401).end('{}')
  if (req.url === '/router/v1/models') return res.end(JSON.stringify({ data: [{ id: 'router-test' }] }))
  const model = { '/router/v1/chat/completions': 'router-test', '/other/v1/chat/completions': 'other-test' }[req.url]
  if (model && req.method === 'POST' && body.model === model && body.stream === false && body.messages.at(-1)?.content === 'uji') {
    return res.end(JSON.stringify({ choices: [{ message: { content: 'balasan ' + model } }] }))
  }
  return res.writeHead(404).end('{}')
})
server.listen(0, '127.0.0.1')
await once(server, 'listening')
const base = 'http://127.0.0.1:' + server.address().port
try {
  await api('PUT', '/api/integrations/webhooks', { webhooks: [] })
  await api('PATCH', '/api/settings', { prefixes: ['!'], cooldown: 0 })
  assert.equal((await chat('.ping')).command, null)
  assert.ok(hasReply(await chat('!ping'), '🏓 Pong!'))
  await api('PATCH', '/api/commands/ping', { disabled: true })
  assert.ok(hasReply(await chat('!ping', { from: FIXTURE.user }), '⛔ Perintah ini sedang dinonaktifkan.'))
  await api('PATCH', '/api/commands/ping', { disabled: false })
  assert.ok(hasReply(await chat('!ping', { from: FIXTURE.user }), '🏓 Pong!'))
  if (inst.packs.extra) {
    await api('PATCH', '/api/commands/ping', { provider: 'extra' })
    const { commands } = await api('GET', '/api/commands')
    assert.equal(commands.find((c) => c.name === 'ping' && c.active)?.source, 'extra')
    await api('PATCH', '/api/commands/ping', { provider: 'native' })
    assert.equal((await chat('!ping')).command?.source, 'native')
    console.log('Sumber ping berpindah ke extra dan kembali ke native.')
  }
  if (inst.packs.classic) {
    const lookup = await chat('!unsur Fe')
    assert.equal(lookup.command?.source, 'classic')
    assert.ok(lookup.replies.some((c) => /BESI/i.test(c.args[1]?.text) && /26/.test(c.args[1]?.text)))
    console.log('Plugin classic menemukan Fe (besi), nomor atom 26.')
  }
  await api('PATCH', '/api/users/' + FIXTURE.user, { limit: 37 })
  const users = await api('GET', '/api/users?q=' + FIXTURE.user)
  assert.equal(users.users[0].limit, 37)
  console.log('Prefix ! aktif, ping bisa dinonaktifkan dan diaktifkan kembali, limit pengguna 37.')

  const sticker = await chat('!sticker', { message: {
    imageMessage: { caption: '!sticker', mimetype: 'image/png', url: base + '/photo', mediaKey: attachment.mediaKey.toString('base64') }
  } })
  const sent = sticker.replies.find((c) => c.jid === sticker.input.chat && c.args[1]?.sticker)?.args[1].sticker
  assert.ok(sent?.$media, 'chat harus mengirim stiker dari lampiran PNG lokal')
  const metadata = await sharp(path.join(inst.evidence, sent.$media)).metadata()
  assert.deepEqual([metadata.format, metadata.width, metadata.height], ['webp', 512, 512])
  console.log('Stiker WebP 512×512 dari PNG lokal: ' + path.join(inst.evidence, sent.$media))

  for (const [provider, model] of [['router', ''], ['other', 'other-test']]) {
    const saved = await api('PATCH', '/api/settings', { ai: { baseUrl: base + '/' + provider + '/v1', apiKey: aiKey, model } })
    assert.equal(saved.settings.ai.apiKeySet, true)
    assert.equal(JSON.stringify(saved).includes(aiKey), false)
    const reply = 'balasan ' + (model || 'router-test')
    assert.ok(hasReply(await chat('!ai uji'), reply))
    console.log('AI lokal mengirim ke chat asal: ' + reply)
  }

  for (const event of ['message', 'command']) {
    await api('PUT', '/api/integrations/webhooks', { webhooks: [{ events: [event], url: base + '/hook', secret: hookSecret, reply: true }] })
    const result = await chat(event === 'message' ? 'uji webhook' : '!ping', { group: true })
    assert.equal(webhookEvents.at(-1)?.data.chat, FIXTURE.group)
    assert.equal(webhookEvents.at(-1)?.event, event)
    assert.ok(hasReply(result, 'n8n/' + event), 'Balasan webhook ' + event + ' harus sampai ke chat asal.')
    console.log('Webhook lokal bertanda tangan membalas n8n/' + event + ' ke ' + result.input.chat)
  }
  const { token } = await api('PATCH', '/api/integrations/api', { enabled: true, regenerate: true })
  const sentByApi = await http('POST', inst.dashboardUrl + '/api/v1/send', {
    headers: { authorization: 'Bearer ' + token }, body: { to: FIXTURE.user, text: 'uji API masuk' }
  })
  assert.equal(sentByApi.status, 200)
  const calls = await http('GET', inst.controlUrl + '/calls')
  assert.ok(calls.json.some((call) => call.jid === FIXTURE.user + '@s.whatsapp.net' && call.args[1]?.text === 'uji API masuk'))
  console.log('API masuk /api/v1/send mengirim "uji API masuk" ke pengguna simulasi.')
  const { settings } = await api('GET', '/api/settings')
  assert.equal(settings.api.enabled, true)
  assert.equal(settings.webhooks[0].secretSet, true)
  const publicSettings = JSON.stringify(settings)
  assert.equal(publicSettings.includes(hookSecret), false, 'Webhook secret muncul di respons pengaturan umum.')
  assert.equal(publicSettings.includes(token), false, 'Token API muncul di respons pengaturan umum.')
  assert.equal(publicSettings.includes(aiKey), false)
  console.log('Pengaturan umum menyembunyikan API key AI, secret webhook, dan token API.')
} finally {
  server.close()
  server.closeAllConnections()
}
