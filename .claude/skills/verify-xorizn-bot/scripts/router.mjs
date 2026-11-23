import { createServer } from 'node:http'
import { randomBytes } from 'node:crypto'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import assert from 'node:assert/strict'
import { FIXTURE, http, freePort, login, parseArgs, readInstance, sleep } from './lib.mjs'

const args = parseArgs()
if (!args.app || !args.name) throw Error('Gunakan --app <folder 9router/app> --name <instance up.mjs>')
const app = path.resolve(args.app)
const inst = readInstance(args.name)
const password = randomBytes(20).toString('hex')
const dir = await fs.mkdtemp(path.join(os.tmpdir(), '9router-verify-'))
const port = await freePort()
const base = 'http://127.0.0.1:' + port
const answer = 'balasan melalui 9router'
let received = false
const upstream = createServer(async (req, res) => {
  let raw = ''
  for await (const chunk of req) raw += chunk
  const b = raw ? JSON.parse(raw) : {}
  if (req.url === '/v1/models') return res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ data: [{ id: 'test' }] }))
  if (req.url !== '/v1/chat/completions' || req.headers.authorization !== 'Bearer uji-lokal' || b.model !== 'test' || b.messages.at(-1)?.content !== 'uji-router') return res.writeHead(400).end('{}')
  received = true
  const meta = { id: 'chatcmpl-uji', created: Math.floor(Date.now() / 1000), model: 'test' }
  if (b.stream) {
    res.writeHead(200, { 'content-type': 'text/event-stream' })
    for (const [delta, reason] of [[{ role: 'assistant', content: answer }, null], [{}, 'stop']]) {
      const event = { ...meta, object: 'chat.completion.chunk', choices: [{ index: 0, delta, finish_reason: reason }] }
      res.write('data: ' + JSON.stringify(event) + '\n\n')
    }
    return res.end('data: [DONE]\n\n')
  }
  return res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({
    ...meta, object: 'chat.completion', choices: [{ index: 0, message: { role: 'assistant', content: answer }, finish_reason: 'stop' }]
  }))
})
upstream.listen(0, '127.0.0.1')
await once(upstream, 'listening')
const env = {}
for (const key of ['Path', 'PATH', 'SystemRoot', 'SystemDrive', 'ComSpec', 'WINDIR']) {
  if (process.env[key]) env[key] = process.env[key]
}
Object.assign(env, {
  DATA_DIR: dir, USERPROFILE: dir, HOME: dir, APPDATA: dir, LOCALAPPDATA: dir, TEMP: dir, TMP: dir, TMPDIR: dir,
  INITIAL_PASSWORD: password, JWT_SECRET: randomBytes(32).toString('hex'), API_KEY_SECRET: randomBytes(32).toString('hex'),
  MODEL_CATALOG_SYNC: 'off', DISABLE_BACKGROUND_TOKEN_REFRESH: 'true', NEXT_TELEMETRY_DISABLED: '1',
  PORT: String(port), HOSTNAME: '127.0.0.1'
})
const child = spawn(process.execPath, [path.join(app, 'custom-server.js')], { env, cwd: dir, windowsHide: true, stdio: 'ignore' })
try {
  let ready = false
  for (let i = 0; i < 70 && child.exitCode === null; i++) {
    try {
      const status = await http('GET', base + '/api/auth/status', { timeoutMs: 2000 })
      if (status.status === 200) { ready = true; break }
    } catch {}
    await sleep(300)
  }
  assert.ok(ready, '9router gagal start, exit=' + child.exitCode)
  const auth = await http('POST', base + '/api/auth/login', { body: { password } })
  assert.equal(auth.status, 200, 'login router baru')
  const cookie = auth.headers['set-cookie'].map((c) => c.split(';')[0]).join('; ')
  async function create(route, body) {
    const r = await http('POST', base + route, { cookie, body })
    assert.equal(r.status, 201, route + ': ' + r.json?.error)
    return r.json
  }
  const { node } = await create('/api/provider-nodes', { name: 'Tes lokal', prefix: 'uji', apiType: 'chat', baseUrl: 'http://127.0.0.1:' + upstream.address().port + '/v1' })
  await create('/api/providers', { name: 'Uji', provider: node.id, apiKey: 'uji-lokal' })
  const { key } = await create('/api/keys', { name: 'tes-bot' })
  for (const options of [{}, { stream: false }]) {
    const preview = await http('POST', base + '/v1/chat/completions', { headers: { authorization: 'Bearer ' + key }, body: { model: 'uji/test', messages: [{ role: 'user', content: 'uji-router' }], ...options } })
    console.log('9router ' + JSON.stringify(options) + ': ' + preview.status + ' ' + preview.headers['content-type'])
  }
  received = false
  const saved = await http('PATCH', inst.dashboardUrl + '/api/settings', { cookie: await login(inst), body: { prefixes: ['!'], ai: { baseUrl: base + '/v1', model: 'uji/test', apiKey: key } } })
  assert.equal(saved.status, 200)
  const chat = await http('POST', inst.controlUrl + '/chat', { body: { from: FIXTURE.owner, text: '!ai uji-router', noPace: true } })
  assert.equal(chat.status, 200)
  assert.ok(received, 'permintaan bot sampai ke upstream uji')
  assert.ok(chat.json.replies.some((c) => c.jid === chat.json.input.chat && c.args[1]?.text === answer), 'balasan 9router ke chat asal')
  console.log('9router ' + JSON.parse(await fs.readFile(path.join(app, '..', 'package.json'), 'utf8')).version + ' -> uji/test -> ' + chat.json.input.chat + ': ' + answer)
} finally {
  if (child.exitCode === null && child.signalCode === null) {
    const exit = once(child, 'exit')
    child.kill()
    await exit
  }
  upstream.close()
  upstream.closeAllConnections()
  if (path.dirname(dir) !== os.tmpdir() || !path.basename(dir).startsWith('9router-verify-')) throw Error('Unexpected temporary path')
  await fs.rm(dir, { recursive: true, force: true, maxRetries: 4 })
}
