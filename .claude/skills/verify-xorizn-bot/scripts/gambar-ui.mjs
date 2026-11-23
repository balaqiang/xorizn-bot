// Jalankan sesudah up.mjs pada instans uji kosong. Chrome mengakses dashboard produksi.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer-core'
import { startImageFixture } from '../../../../test/fixtures/gambar.mjs'
import { FIXTURE, http, login, nextEvidencePath, parseArgs, readInstance } from './lib.mjs'

const inst = readInstance(String(parseArgs().name || 'v1'))
const cookie = await login(inst)
const commands = async () => (await http('GET', inst.dashboardUrl + '/api/custom', { cookie })).json.commands
assert.ok(!(await commands()).some(c => c.name === 'gambar'), 'Gunakan instans uji baru.')
const executablePath = [
  process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/chromium',
  '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(p => p && fs.existsSync(p))
assert.ok(executablePath, 'Isi CHROME_PATH dengan lokasi Chrome atau Chromium.')
const browser = await puppeteer.launch({ executablePath, headless: true, defaultViewport: { width: 1440, height: 960 } })
try {
  const fixture = await startImageFixture()
  try {
    const page = await browser.newPage()
    const uiErrors = []
    const mediaRequests = []
    page.on('pageerror', err => uiErrors.push(err.message))
    page.on('request', req => {
      if (new URL(req.url()).origin === fixture.baseUrl) mediaRequests.push(req.resourceType())
    })
    await browser.setCookie({ name: 'sid', value: cookie.slice(4), url: inst.dashboardUrl })
    await page.goto(inst.dashboardUrl + '/custom/')
    const clickButton = async name => {
      const selector = `::-p-xpath(//button[normalize-space()="${name}"])`
      const el = await page.waitForSelector(selector, { visible: true })
      await el.evaluate(btn => btn.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await el.click()
    }
    const input = name => page.locator(`[aria-label="${name}"]`)
    const waitText = text => page.waitForFunction(t => document.body.innerText.includes(t), {}, text)
    const select = async (label, val) => {
      const selector = `select[aria-label="${label}"]`
      await page.waitForFunction((s, v) => [...document.querySelector(s)?.options ?? []].some(o => o.value === v), {}, selector, val)
      await page.select(selector, val)
    }
    const safe = output => {
      for (const key of [fixture.apiKey, encodeURIComponent(fixture.apiKey)]) {
        assert.ok(!output.includes(key), 'Nilai rahasia muncul pada hasil uji.')
      }
    }
    await clickButton('Perintah baru')
    await page.waitForSelector('select[aria-label="Jenis balasan"]')
    assert.equal(await page.$eval('select[aria-label="Jenis balasan"]', el => el.value), 'any')
    await clickButton('Batal')
    await input('Nama rahasia').fill('GAMBAR_KEY')
    await input('Nilai API key').fill(fixture.apiKey)
    await clickButton('Simpan rahasia')
    await waitText('GAMBAR_KEY')
    await page.locator('input[placeholder="localhost:5678"]').fill(new URL(fixture.baseUrl).host)
    await clickButton('Tambah')
    await waitText(new URL(fixture.baseUrl).host)
    await clickButton('Gambar dari API saya')
    let createdAt
    for (const [provider, listPath, field] of [['first', 'res.result.images', ''], ['second', 'res.data.items', 'url']]) {
      if (createdAt) await clickButton('Ubah')
      await input('URL endpoint').fill(fixture.baseUrl + '/' + provider)
      await select('API key untuk Authorization Bearer', 'GAMBAR_KEY')
      await clickButton('Coba permintaan')
      await waitText('Contoh respons')
      safe(await page.$eval('pre', e => e.textContent))
      await select('Pilih daftar dari contoh', listPath)
      if (field) await select('Pilih kolom dari contoh', field)
      const tested = page.waitForResponse(r => r.url().endsWith('/api/custom/test'))
      await clickButton('▶ Coba')
      const result = await (await tested).json()
      safe(JSON.stringify(result))
      assert.ok(result.ok)
      assert.equal(result.replies[0].kind, 'image')
      await page.waitForFunction(() => document.querySelector('img[alt="Pratinjau gambar balasan"]')?.naturalWidth > 0)
      safe(await page.$eval('body', e => e.innerText))
      const shot = nextEvidencePath(inst.name, 'gambar-' + provider, 'png')
      await page.screenshot({ path: shot, fullPage: true })
      console.log(provider + ': pratinjau gambar berhasil, menyimpan perintah.')
      const saved = page.waitForResponse(r => r.url().endsWith('/api/custom') && r.request().method() === 'POST')
      await clickButton('Simpan')
      const response = await saved
      if (!createdAt && response.status() === 400) {
        assert.match((await response.json()).error, /sudah dipakai fitur bawaan/)
        console.log('Alias classic terdeteksi. Memilih pengganti untuk .gambar.')
        await page.locator('::-p-xpath(//label[contains(., "Timpa perintah bawaan")]/input)').click()
        await clickButton('Simpan')
      } else assert.ok(response.ok(), 'Simpan .gambar harus berhasil.')
      await waitText('Daftar perintah')
      const rows = (await commands()).filter(c => c.name === 'gambar')
      assert.equal(rows.length, 1)
      safe(JSON.stringify(rows))
      assert.equal(rows[0].steps[1].path, listPath)
      assert.equal(rows[0].steps[1].itemPath, field)
      assert.equal(rows[0].steps[2].kind, 'any')
      if (createdAt) assert.equal(rows[0].createdAt, createdAt)
      createdAt = rows[0].createdAt
      const chat = (await http('POST', inst.controlUrl + '/chat', { body: { from: FIXTURE.user, text: '.gambar' } })).json
      safe(JSON.stringify(chat))
      const sent = chat.replies.find(c => c.jid === chat.input.chat && c.args[1]?.image)
      assert.ok(sent, 'Chat asal harus menerima panggilan sendMessage bergambar.')
      const recorded = fs.readFileSync(path.join(inst.evidence, sent.args[1].image.$media))
      assert.ok(fixture.images.some(img => img.equals(recorded)))
      console.log(`${provider}: .gambar → ${listPath}${field ? ' → ' + field : ''}; PNG ${recorded.length} byte di socket simulasi. ${shot}`)
    }
    await clickButton('Ubah')
    await clickButton('Mode JSON')
    const jsonField = 'textarea[rows="22"]'
    const draft = JSON.parse(await page.$eval(jsonField, el => el.value))
    draft.steps = [
      { type: 'reply', kind: 'text', text: 'Uji di dashboard' },
      ...Array.from({ length: 23 }, () => ({ type: 'set', save: 'temp', value: 'uji' })),
      draft.steps[0],
    ]
    await page.locator(jsonField).fill(JSON.stringify(draft))
    await clickButton('Mode form')
    await clickButton('Coba permintaan')
    await waitText('Contoh respons')
    assert.ok(await page.$eval('pre', el => JSON.parse(el.textContent).data.items.length))
    console.log('Permintaan pada langkah ke-25 menghasilkan contoh respons.')
    assert.deepEqual(mediaRequests, [], 'Browser harus menggunakan gambar yang dipratinjau server.')
    assert.deepEqual(uiErrors, [])
  } finally {
    await fixture.close()
  }
} finally {
  await browser.close()
}
