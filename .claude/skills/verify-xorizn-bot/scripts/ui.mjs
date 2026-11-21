// Drive the dashboard in a real (headless) Chrome via puppeteer-core, logging in through the login page.
//   node .claude/skills/verify-xorizn-bot/scripts/ui.mjs --name v1 --step goto:/commands --step "waitText:Perintah" --step shot:commands
// Steps run in order:
//   goto:<path>              open dashboard path (e.g. /, /custom, /groups/detail?id=...)
//   click:<selector>         CSS or puppeteer selector, e.g. click:::-p-text(Simpan)  click:#pw
//   type:<selector>|<text>   clear the field and type text
//   select:<selector>|<val>  choose an <option> by value
//   wait:<selector>          wait for an element
//   waitText:<text>          wait until the page body contains text
//   expectText:<text>        fail unless the page body contains text
//   text:<selector>          print the element's text (also saved in the log as "text") — e.g. a token shown once
//   sleep:<ms>
//   shot:<label>             full-page screenshot into the evidence folder
// Flags: --no-login, --headful, --width 1366 --height 900, --dark
// Writes <evidence>/NNN-ui-....json with every step, console errors and failed /api responses. Exit 1 on any failed step.
import fs from 'node:fs'
import { parseArgs, readInstance, nextEvidencePath } from './lib.mjs'

const args = parseArgs(['headful', 'dark', 'no-login'])
const inst = readInstance(String(args.name || 'v1'))
const steps = [].concat(args.step || [])

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
].filter(Boolean)
const executablePath = candidates.find((p) => fs.existsSync(p))
if (!executablePath) {
  console.error('No Chrome/Edge found. Set CHROME_PATH to a Chromium-based browser executable.')
  process.exit(1)
}

const { default: puppeteer } = await import('puppeteer-core')
const browser = await puppeteer.launch({
  executablePath,
  headless: !args.headful,
  args: ['--no-first-run', '--no-default-browser-check'],
  defaultViewport: { width: Number(args.width || 1366), height: Number(args.height || 900) }
})
const log = { instance: inst.name, steps: [], consoleErrors: [], apiFailures: [], screenshots: [] }
let failed = false
try {
  const page = await browser.newPage()
  if (args.dark) await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
  page.on('console', (m) => m.type() === 'error' && log.consoleErrors.push(m.text()))
  page.on('pageerror', (e) => log.consoleErrors.push(String(e)))
  page.on('response', (r) => {
    const u = new URL(r.url())
    if (u.pathname.startsWith('/api/') && r.status() >= 400 && u.pathname !== '/api/session') log.apiFailures.push(`${r.request().method()} ${u.pathname} → ${r.status()}`)
  })
  const bodyText = () => page.evaluate(() => document.body.innerText)
  // The dashboard keeps an SSE stream (/api/events) open, so "network idle" must tolerate open connections.
  const settle = () => page.waitForNetworkIdle({ idleTime: 500, concurrency: 2, timeout: 15_000 }).catch(() => {})
  const go = async (p) => {
    await page.goto(new URL(p, inst.dashboardUrl).href, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    await settle()
  }

  if (!args['no-login']) {
    await go('/login')
    await page.waitForSelector('#pw', { timeout: 15_000 })
    await page.type('#pw', inst.password)
    await Promise.all([page.waitForFunction(() => !location.pathname.startsWith('/login'), { timeout: 15_000 }), page.click('button[type=submit]')])
    await settle()
    log.steps.push({ step: 'login', ok: true, url: page.url() })
  }

  for (const raw of steps) {
    const i = raw.indexOf(':')
    const op = raw.slice(0, i)
    const arg = raw.slice(i + 1)
    const [sel, val] = arg.includes('|') ? [arg.slice(0, arg.indexOf('|')), arg.slice(arg.indexOf('|') + 1)] : [arg, '']
    const rec = { step: raw, ok: true }
    try {
      if (op === 'goto') await go(arg)
      else if (op === 'click') {
        await page.waitForSelector(arg, { visible: true, timeout: 15_000 })
        await page.click(arg)
        await settle()
      } else if (op === 'type') {
        await page.waitForSelector(sel, { visible: true, timeout: 15_000 })
        await page.click(sel, { clickCount: 3 })
        await page.keyboard.press('Backspace')
        await page.type(sel, val)
      } else if (op === 'select') await page.select(sel, val)
      else if (op === 'wait') await page.waitForSelector(arg, { timeout: 15_000 })
      else if (op === 'waitText') await page.waitForFunction((t) => document.body.innerText.includes(t), { timeout: 15_000 }, arg)
      else if (op === 'expectText') {
        if (!(await bodyText()).includes(arg)) throw new Error(`text not on page: ${arg}`)
      } else if (op === 'text') {
        const el = await page.waitForSelector(arg, { timeout: 15_000 })
        rec.text = (await el.evaluate((e) => e.innerText ?? e.textContent)).trim()
        console.log(`TEXT ${rec.text}`)
      } else if (op === 'sleep') await new Promise((r) => setTimeout(r, Number(arg)))
      else if (op === 'shot') {
        const file = nextEvidencePath(inst.name, `ui ${arg}`, 'png')
        await page.screenshot({ path: file, fullPage: true })
        log.screenshots.push(file)
        rec.file = file
      } else throw new Error(`unknown step "${op}"`)
      rec.url = page.url()
    } catch (err) {
      rec.ok = false
      rec.error = err.message
      failed = true
      const file = nextEvidencePath(inst.name, `ui failed ${op}`, 'png')
      await page.screenshot({ path: file, fullPage: true }).catch(() => {})
      rec.file = file
    }
    log.steps.push(rec)
    console.log(`${rec.ok ? 'OK  ' : 'FAIL'} ${raw}${rec.error ? ` — ${rec.error}` : ''}${rec.file ? ` → ${rec.file}` : ''}`)
    if (!rec.ok) break
  }
} finally {
  await browser.close()
}
for (const e of log.consoleErrors) console.log(`  console error: ${e.slice(0, 200)}`)
for (const e of log.apiFailures) console.log(`  api failure: ${e}`)
const file = nextEvidencePath(inst.name, 'ui log', 'json')
fs.writeFileSync(file, JSON.stringify(log, null, 2))
console.log(`  evidence: ${file}`)
process.exit(failed ? 1 : 0)
