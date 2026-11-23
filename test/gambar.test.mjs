import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { createServer } from 'node:http'
import { once } from 'node:events'
import sharp from 'sharp'
import bot from '../src/core/bot.js'
import logger from '../src/core/logger.js'
import { MessageStore } from '../src/core/cache.js'
import { Database } from '../src/core/database/index.js'
import { JsonDriver } from '../src/core/database/drivers/json.js'
import { onMessagesUpsert } from '../src/core/handler.js'
import { defaultSettings } from '../src/core/models.js'
import { CommandRegistry } from '../src/core/registry.js'
import * as builder from '../src/features/builder/index.js'
import { evalExpr } from '../src/features/builder/path.js'
import { setSecret } from '../src/features/builder/secrets.js'
import { startImageFixture } from './fixtures/gambar.mjs'

const chat = '6280000000001@s.whatsapp.net'
const sent = []
let fixture
let dir
before(async () => {
  fixture = await startImageFixture()
  dir = await fs.mkdtemp(path.join(os.tmpdir(), 'gambar-test-'))
  bot.config = { bot: {}, paths: { data: dir } }
  bot.db = await new Database(new JsonDriver({ file: 'db.json' }, dir)).init()
  bot.db.set('settings', 'bot', {
    ...defaultSettings(bot.config), cooldown: 0, autoTyping: false,
    builder: { allowHosts: [new URL(fixture.baseUrl).host] }
  })
  setSecret('GAMBAR', fixture.apiKey)
  bot.registry = new CommandRegistry()
  bot.messageStore = new MessageStore()
  bot.sock = { sendMessage: async (jid, content, options) => sent.push({ jid, content, options }) }
})
after(async () => {
  await fixture.close()
  await bot.db.close()
  for (const file of ['db.json', 'secret.key']) await fs.rm(path.join(dir, file), { force: true })
  await fs.rmdir(dir)
})

function recipe(endpoint, path, itemPath = '') {
  return { name: 'gambar', steps: [
    { type: 'http', url: fixture.baseUrl + endpoint, headers: { Authorization: 'Bearer {{secret.GAMBAR}}' } },
    { type: 'random', path, itemPath, save: 'img' },
    { type: 'reply', kind: 'image', url: '{{img}}' }
  ] }
}

async function sendGambar() {
  const id = randomUUID()
  const incoming = { key: { remoteJid: chat, id }, messageTimestamp: Date.now() / 1000, message: { conversation: '.gambar' } }
  const before = sent.length
  await onMessagesUpsert({ messages: [incoming], type: 'notify' })
  assert.equal(sent.length, before + 1, 'persis satu balasan pada socket simulasi')
  const reply = sent.at(-1)
  assert.equal(reply.jid, chat)
  assert.equal(reply.options.quoted.key.id, id)
  return reply.content
}

function assertMasked(value) {
  const output = JSON.stringify(value)
  assert.ok(!output.includes(fixture.apiKey))
  assert.ok(!output.includes(encodeURIComponent(fixture.apiKey)))
  assert.ok(!output.includes(Buffer.from(fixture.apiKey).toString('base64')))
}

test('bandingkan tiga cara memilih URL dari respons yang sama', async () => {
  for (const [endpoint, list, field] of [
    ['/first', 'res.result.images', ''], ['/second', 'res.data.items', 'url'],
    ['/literal', 'res.result.images.random', '']
  ]) {
    const response = await fetch(fixture.baseUrl + endpoint, { headers: { Authorization: 'Bearer ' + fixture.apiKey } })
    const scope = { res: await response.json() }
    const compact = evalExpr(list + '.random' + (field ? '.' + field : ''), scope)
    const filtered = evalExpr(list + ' | random', scope)
    assert.ok(compact.startsWith(fixture.baseUrl + '/image/'))
    assert.ok((field ? filtered[field] : filtered).startsWith(fixture.baseUrl + '/image/'))
    const explicit = await builder.test(recipe(endpoint, list, field))
    assert.equal(explicit.replies[0]?.kind, 'image')
  }
  const res = await fetch(fixture.baseUrl + '/object', { headers: { Authorization: 'Bearer ' + fixture.apiKey } })
  const scope = { res: await res.json() }
  assert.ok(evalExpr('res.result.images.random', scope).startsWith(fixture.baseUrl + '/image/'))
  assert.ok(evalExpr('res.result.images | random', scope).startsWith(fixture.baseUrl + '/image/'))
  const cmd = recipe('/object', 'res.result.images')
  assert.match((await builder.test(cmd)).error, /harus berupa daftar JSON/)
})

test('dua penyedia, dua posisi acak, satu perintah tersimpan membalas PNG ke chat asal', async t => {
  const random = t.mock.method(Math, 'random')
  for (const [endpoint, path, itemPath] of [['/first', 'res.result.images', ''], ['/second', 'res.data.items', 'url']]) {
    const command = recipe(endpoint, path, itemPath)
    const preview = await builder.test(command)
    assert.equal(preview.ok, true, preview.error)
    assert.equal(preview.replies[0].contentType, 'image/png')
    const maskedLink = await fetch(preview.replies[0].url)
    assert.equal(maskedLink.status, 401, 'URL media tersamarkan tidak bisa dipakai sebagai src gambar')
    const thumb = preview.replies[0].previewImage
    assert.ok(thumb.startsWith('data:image/jpeg;base64,'))
    const meta = await sharp(Buffer.from(thumb.split(',')[1], 'base64')).metadata()
    assert.deepEqual([meta.format, meta.width, meta.height], ['jpeg', 2, 2])
    assert.equal(preview.trace[0].sample.echo.nested.apiKey, '***')
    assertMasked(preview)
    builder.save(command, { previousName: 'gambar' })
    for (const position of [0, 1]) {
      random.mock.mockImplementation(() => position ? 0.9999 : 0)
      const actual = await sendGambar()
      assert.deepEqual(actual.image, fixture.images[position])
    }
  }
  assert.deepEqual(builder.list().map(command => command.name), ['gambar'])
  assert.equal(builder.get('gambar').uses, 4)
})

test('kolom random literal, ekspresi lama, dan pilihan teks manual tetap dapat dipakai', async () => {
  const literal = recipe('/literal', 'res.result.images.random')
  assert.equal((await builder.test(literal)).ok, true)
  const old = recipe('/first', '')
  old.steps[1] = { type: 'pick', path: 'res.result.images.random', save: 'img' }
  assert.equal((await builder.test(old)).ok, true)
  const manual = { name: 'manual', steps: [
    { type: 'random', items: ['Halo {{sender.name}}'], save: 'pilihan' },
    { type: 'reply', text: '{{pilihan}}' }
  ] }
  assert.equal((await builder.test(manual)).replies[0].text, 'Halo Penguji')
})

test('sample dibatasi, jalur kosong/salah dan kolom yang hilang menjelaskan langkah gagal', async () => {
  const preview = await builder.test(recipe('/large', 'res.result.images'))
  assert.equal(preview.trace[0].sampleLimited, true)
  assert.equal(preview.trace[0].sample.result.images.length, 5)
  const switched = recipe('/second', 'res.result.images')
  assert.equal((await builder.test(switched)).errorStep, 2)
  const probe = await builder.test({ ...switched, steps: [switched.steps[0], { type: 'stop' }] })
  assert.ok(probe.ok)
  assert.ok(Array.isArray(probe.trace[0].sample.data.items))
  for (const [endpoint, path, itemPath, reason] of [
    ['/empty', 'res.result.images', '', /kosong/],
    ['/literal', 'res.result.images', '', /harus berupa daftar/],
    ['/first', 'res.result.images.random', '', /harus berupa daftar/],
    ['/second', 'res.data.items', 'random', /kolom yang diminta/]
  ]) {
    const failed = await builder.test(recipe(endpoint, path, itemPath))
    assert.equal(failed.errorStep, 2)
    assert.match(failed.error, reason)
    assert.deepEqual(failed.replies, [])
  }
})

test('rahasia disamarkan sebelum pemotongan trace, balasan, log dan error yang tersimpan', async () => {
  const command = recipe('/first', 'res.result.images')
  command.steps.splice(1, 2,
    { type: 'pick', path: 'res.echo.padded', save: 'picked' },
    { type: 'pick', path: 'res.missing', save: 'missing', failText: '{{picked}}' },
    { type: 'stop' })
  const preview = await builder.test(command)
  assert.equal(preview.trace[1].info, 'picked = ' + 'x'.repeat(75) + '***')
  const error = 'x'.repeat(75) + '***'
  assert.equal(preview.error, error)
  builder.save(command, { previousName: 'gambar' })
  assert.equal((await sendGambar()).text, '❌ ' + error)
  assert.equal(builder.get('gambar').lastError.message, error)
  assert.ok(logger.recent().some(log => log.message.endsWith(error)))
  assertMasked(logger.recent())
  assertMasked(preview)
})

test('Any mendeteksi isi URL atau respons biner yang berubah pada perintah yang sama', async () => {
  const cases = [
    { bytes: fixture.images[0], header: 'video/mp4', kind: 'image', mime: 'image/png' },
    { bytes: await fs.readFile(new URL('./fixtures/frame.mp4', import.meta.url)), kind: 'video', mime: 'video/mp4' },
    { bytes: Buffer.from([0, 1, 2, 3]), header: 'application/octet-stream', kind: 'document', mime: 'application/octet-stream' }
  ]
  let current = cases[0]
  let calls = 0
  const server = createServer((_req, res) => {
    calls++
    if (current.header) res.setHeader('content-type', current.header)
    res.end(current.bytes)
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  try {
    const host = '127.0.0.1:' + server.address().port
    bot.settings.builder.allowHosts.push(host)
    const url = 'http://' + host + '/media'
    for (const direct of [true, false]) {
      const reply = { type: 'reply', kind: 'any', url: direct ? url : '{{res}}', text: 'Media pilihan' }
      const cmd = { name: 'gambar', steps: direct ? [reply] : [{ type: 'http', url, save: 'res' }, reply] }
      builder.save(cmd, { previousName: 'gambar' })
      for (current of cases) {
        const preview = await builder.test(cmd)
        assert.equal(preview.ok, true, preview.error)
        assert.equal(preview.replies[0].kind, current.kind)
        assert.equal(preview.replies[0].contentType, current.mime)
        const actual = await sendGambar()
        assert.deepEqual(actual[current.kind], current.bytes)
        assert.equal(actual.mimetype, current.mime)
        assert.equal(actual.caption, 'Media pilihan')
      }
    }
    assert.equal(calls, 12)
  } finally {
    const closed = once(server, 'close')
    server.close()
    server.closeAllConnections()
    await closed
  }
})
