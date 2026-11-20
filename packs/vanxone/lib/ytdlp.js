// Engine download berbasis yt-dlp (YouTube, Instagram, dll) tanpa server pihak ketiga.
// Binary dicari di: config.downloader.ytdlp.path -> ./bin/yt-dlp -> PATH -> python -m yt_dlp.
// Kalau belum ada, otomatis diunduh dari GitHub resmi yt-dlp ke folder ./bin (Linux x64/arm64, Windows, macOS).
const fs = require('fs')
const os = require('os')
const path = require('path')
const axios = require('axios')
const { spawn, spawnSync } = require('child_process')
const config = require('../config')

const BIN_DIR = path.join(__dirname, '..', 'bin')
const COOKIES_FILE = path.join(BIN_DIR, 'cookies.txt')
const PROXY_FILE = path.join(BIN_DIR, 'proxy.txt')
const readTrim = (f) => { try { return fs.readFileSync(f, 'utf8').trim() } catch { return '' } }
const cfg = () => {
  const c = { path: '', cookies: '', proxy: '', autoInstall: true, maxMinutes: 30, ...(config.downloader?.ytdlp || {}) }
  if (!c.cookies && fs.existsSync(COOKIES_FILE)) c.cookies = COOKIES_FILE // diunggah owner lewat .ytcookies
  if (!c.proxy) c.proxy = readTrim(PROXY_FILE) // diatur owner lewat .ytdlp proxy
  return c
}
const maxMB = () => config.downloader?.maxMB || 80
const isTermux = () => /com\.termux/.test(process.env.PREFIX || '')

let resolved // { cmd, pre }
let installing = null
let ffmpegOk
let jsArgs

const hasFfmpeg = () => (ffmpegOk ??= spawnSync('ffmpeg', ['-version']).status === 0)

function assetName() {
  if (isTermux()) return null
  if (process.platform === 'win32') return 'yt-dlp.exe'
  if (process.platform === 'darwin') return 'yt-dlp_macos'
  if (process.platform === 'linux') return process.arch === 'arm64' ? 'yt-dlp_linux_aarch64' : process.arch === 'x64' ? 'yt-dlp_linux' : null
  return null
}

const localBin = () => path.join(BIN_DIR, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp')

function works(cmd, pre = []) {
  const r = spawnSync(cmd, [...pre, '--version'], { timeout: 20000, encoding: 'utf8' })
  return r.status === 0 ? String(r.stdout).trim() : null
}

function find() {
  if (resolved) return resolved
  const list = []
  if (cfg().path) list.push({ cmd: cfg().path, pre: [] })
  if (fs.existsSync(localBin())) list.push({ cmd: localBin(), pre: [] })
  list.push({ cmd: 'yt-dlp', pre: [] }, { cmd: 'python3', pre: ['-m', 'yt_dlp'] }, { cmd: 'python', pre: ['-m', 'yt_dlp'] })
  for (const c of list) {
    const v = works(c.cmd, c.pre)
    if (v) return (resolved = { ...c, version: v })
  }
  return null
}

const installHelp = () =>
  isTermux()
    ? 'yt-dlp belum terpasang. Di Termux jalankan:\npkg install python ffmpeg && pip install -U "yt-dlp[default]"'
    : 'yt-dlp belum terpasang dan tidak bisa dipasang otomatis di sistem ini. Pasang manual: https://github.com/yt-dlp/yt-dlp#installation'

async function install() {
  const asset = assetName()
  if (!asset) throw new Error(installHelp())
  installing ??= (async () => {
    fs.mkdirSync(BIN_DIR, { recursive: true })
    const tmp = `${localBin()}.download`
    const res = await axios.get(`https://github.com/yt-dlp/yt-dlp/releases/latest/download/${asset}`, {
      responseType: 'arraybuffer',
      timeout: 300000,
      maxRedirects: 8
    })
    fs.writeFileSync(tmp, Buffer.from(res.data))
    fs.chmodSync(tmp, 0o755)
    fs.renameSync(tmp, localBin())
    resolved = null
    const found = find()
    if (!found) throw new Error('File yt-dlp terunduh tetapi tidak bisa dijalankan di sistem ini.')
    return found
  })().finally(() => {
    installing = null
  })
  return installing
}

// Pastikan yt-dlp siap. Pesan error sudah ramah pengguna.
async function ensure() {
  const f = find()
  if (f) return f
  if (!cfg().autoInstall) throw new Error(installHelp())
  try {
    return await install()
  } catch (err) {
    console.log('[YTDLP] gagal memasang otomatis:', err.message)
    throw new Error(err.message.startsWith('yt-dlp') ? err.message : `${installHelp()}\n(Pemasangan otomatis gagal: ${err.code || err.message})`)
  }
}

function jsRuntimeArgs() {
  if (jsArgs) return jsArgs
  if (spawnSync('deno', ['--version']).status === 0) return (jsArgs = [])
  const major = Number(process.versions.node.split('.')[0])
  return (jsArgs = major >= 22 ? ['--js-runtimes', `node:${process.execPath}`] : [])
}

// ---------- antrian: maksimal 2 proses sekaligus ----------
let active = 0
const waiters = []
async function slot() {
  if (active >= 2) await new Promise((r) => waiters.push(r))
  active++
  return () => {
    active--
    waiters.shift()?.()
  }
}

function exec(bin, args, timeoutMs) {
  return new Promise((resolve, reject) => {
    const p = spawn(bin.cmd, [...bin.pre, ...args], { stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    let err = ''
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    const timer = setTimeout(() => {
      p.kill('SIGKILL')
      reject(Object.assign(new Error('timeout'), { code: 'TIMEOUT', stderr: err }))
    }, timeoutMs)
    p.on('error', (e) => {
      clearTimeout(timer)
      reject(e)
    })
    p.on('close', (code) => {
      clearTimeout(timer)
      code === 0 ? resolve({ out, err }) : reject(Object.assign(new Error(`yt-dlp keluar dengan kode ${code}`), { code, stderr: err, stdout: out }))
    })
  })
}

// Terjemahkan error yt-dlp menjadi pesan yang bisa dipahami pengguna
function explain(e) {
  const s = `${e.stderr || ''}\n${e.stdout || ''}\n${e.message || ''}`
  if (e.code === 'TIMEOUT') return 'Proses terlalu lama (lebih dari 5 menit). Coba video yang lebih pendek.'
  if (/not a bot|confirm you.?re not a bot|Sign in to confirm/i.test(s))
    return 'YouTube meminta verifikasi login untuk IP server ini. Owner bisa mengirim cookies lewat .ytcookies atau memasang proxy lewat .ytdlp proxy.'
  if (/does not pass filter|duration/i.test(s) && /filter/i.test(s)) return `Durasi video melebihi batas ${cfg().maxMinutes} menit.`
  if (/larger than max-filesize|File is larger/i.test(s)) return `Ukuran file melebihi batas ${maxMB()} MB.`
  if (/Private video|Video unavailable|has been removed|not available|members-only|Join this channel/i.test(s)) return 'Video tidak tersedia (privat, dihapus, atau dibatasi).'
  if (/age|Sign in to confirm your age/i.test(s) && /confirm your age/i.test(s)) return 'Video dibatasi umur, butuh cookies akun untuk mengunduhnya.'
  if (/login required|rate-limit reached|Requested content is not available|empty media response/i.test(s))
    return 'Instagram meminta login. Owner perlu mengisi cookies: config.downloader.ytdlp.cookies (cookies.txt akun Instagram).'
  if (/HTTP Error 429|Too Many Requests/i.test(s)) return 'Terlalu banyak permintaan ke server. Coba lagi beberapa menit lagi.'
  if (/ffmpeg|ffprobe/i.test(s) && /not found|not installed|Postprocessing/i.test(s)) return 'ffmpeg belum terpasang di server (sudo apt install ffmpeg).'
  if (/Unsupported URL/i.test(s)) return 'Link tidak didukung.'
  if (e.code === 'ENOENT') return installHelp()
  console.log('[YTDLP] error tak dikenal:', s.slice(-600))
  return 'Gagal mengunduh. Coba lagi nanti, atau pastikan yt-dlp sudah versi terbaru (.ytdlp update).'
}

const EXT = { audio: ['mp3', 'm4a', 'opus', 'ogg', 'webm', 'aac'], video: ['mp4', 'mkv', 'webm', 'mov'], image: ['jpg', 'jpeg', 'png', 'webp'] }
const kindOfFile = (f) => {
  const ext = path.extname(f).slice(1).toLowerCase()
  return Object.keys(EXT).find((k) => EXT[k].includes(ext)) || 'video'
}

// opts: { audio, playlist, max }  -> { title, files: [{ file, kind, ext }] }  (pemanggil wajib memanggil cleanup())
async function download(url, opts = {}) {
  const bin = await ensure()
  const c = cfg()
  const id = `ytdl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const base = path.join(os.tmpdir(), id)
  const ff = hasFfmpeg()

  const format = opts.audio
    ? ff ? ['-f', 'bestaudio/best', '-x', '--audio-format', 'mp3', '--audio-quality', '128K'] : ['-f', 'bestaudio[ext=m4a]/bestaudio']
    : ff
      ? ['-f', 'bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720][ext=mp4]/b[ext=mp4]/b', '--merge-output-format', 'mp4']
      : ['-f', 'b[height<=720][ext=mp4]/b[ext=mp4]/b']

  const common = [
    opts.playlist ? '--yes-playlist' : '--no-playlist',
    ...(opts.playlist ? ['--playlist-end', String(opts.max || 10)] : []),
    '--no-warnings', '--no-mtime', '--socket-timeout', '20', '--retries', '2',
    '--max-filesize', `${maxMB()}M`,
    '--match-filter', `duration<=?${c.maxMinutes * 60}`,
    '--print', 'after_move:%(title)s',
    ...format,
    ...(c.cookies ? ['--cookies', c.cookies] : []),
    ...(c.proxy ? ['--proxy', c.proxy] : []),
    '-o', `${base}-%(autonumber)s.%(ext)s`,
    '--', url
  ]

  // Saat YouTube menolak (bot-check), coba beberapa identitas klien & paksa IPv4 sebelum menyerah
  const isYt = /(^|\/\/|\.)(youtube\.com|youtu\.be)(\/|$)/i.test(url)
  const hasCookies = !!c.cookies && fs.existsSync(c.cookies)
  const strategies = !isYt
    ? [[]]
    : hasCookies
      ? [[], ['--extractor-args', 'youtube:player_client=web_safari,mweb']]
      : [[], ['--extractor-args', 'youtube:player_client=tv,web_safari'], ['--extractor-args', 'youtube:player_client=default,-visionos'], ['--extractor-args', 'youtube:player_client=android_vr,tv']]
  const botCheck = /not a bot|confirm you.?re not a bot|Sign in to confirm/i

  const run = async (extra) => {
    const args = [...(isYt ? ['--force-ipv4'] : []), ...extra, ...common]
    try {
      return await exec(bin, [...jsRuntimeArgs(), ...args], 300000)
    } catch (e) {
      // yt-dlp lama tidak mengenal --js-runtimes: ulangi tanpa opsi itu
      if (jsRuntimeArgs().length && /no such option|unrecognized arguments|--js-runtimes/i.test(e.stderr || '')) return exec(bin, args, 300000)
      throw e
    }
  }

  const release = await slot()
  let out
  try {
    let lastErr
    for (let i = 0; i < strategies.length; i++) {
      try {
        out = await run(strategies[i])
        lastErr = null
        if (i > 0) console.log(`[YTDLP] berhasil dengan strategi #${i + 1}: ${strategies[i].join(' ') || 'default'}`)
        break
      } catch (e) {
        lastErr = e
        cleanupBase(id)
        if (!botCheck.test(`${e.stderr || ''}${e.stdout || ''}`) || i === strategies.length - 1) break
        console.log(`[YTDLP] bot-check pada strategi #${i + 1}, mencoba strategi berikutnya...`)
      }
    }
    if (lastErr) throw lastErr
  } catch (e) {
    cleanupBase(id)
    throw new Error(explain(e))
  } finally {
    release()
  }

  const files = fs
    .readdirSync(os.tmpdir())
    .filter((f) => f.startsWith(id) && !/\.(part|ytdl|temp)$/i.test(f))
    .sort()
    .map((f) => path.join(os.tmpdir(), f))
    .filter((f) => fs.statSync(f).size > 0)
  if (!files.length) {
    cleanupBase(id)
    const log = `${out.out}\n${out.err}`
    if (/does not pass filter/i.test(log)) throw new Error(`Durasi video melebihi batas ${c.maxMinutes} menit.`)
    if (/larger than max-filesize|File is larger/i.test(log)) throw new Error(`Ukuran file melebihi batas ${maxMB()} MB.`)
    console.log('[YTDLP] selesai tanpa file. Log:', log.slice(-400))
    throw new Error('Tidak ada file yang dihasilkan. Coba lagi, atau perbarui yt-dlp dengan .ytdlp update.')
  }
  const title = String(out.out).split('\n').map((s) => s.trim()).find(Boolean) || ''
  return { title, files: files.map((file) => ({ file, kind: kindOfFile(file), ext: path.extname(file).slice(1).toLowerCase() })), cleanup: () => cleanupBase(id) }
}

function cleanupBase(id) {
  try {
    for (const f of fs.readdirSync(os.tmpdir())) if (f.startsWith(id)) fs.rmSync(path.join(os.tmpdir(), f), { force: true })
  } catch {}
}

// Ringkasan status untuk .ytdlp dan kartu .play
function status() {
  const f = find()
  return {
    installed: !!f,
    version: f?.version || null,
    canInstall: cfg().autoInstall && !!assetName(),
    ffmpeg: hasFfmpeg(),
    js: jsRuntimeArgs().length ? 'node' : spawnSync('deno', ['--version']).status === 0 ? 'deno' : 'tidak ada',
    cookies: !!cfg().cookies && fs.existsSync(cfg().cookies),
    proxy: !!cfg().proxy
  }
}

async function update() {
  resolved = null
  await install()
  return find()
}

// Uji cepat tanpa mengunduh: apakah yt-dlp bisa membaca info video (mengembalikan judul)?
async function probe(url) {
  const bin = await ensure()
  const c = cfg()
  const base = ['--no-warnings', '--no-playlist', '--skip-download', '--print', '%(title)s', '--force-ipv4', ...(c.cookies ? ['--cookies', c.cookies] : []), ...(c.proxy ? ['--proxy', c.proxy] : []), '--', url]
  const tries = [[], ['--extractor-args', 'youtube:player_client=tv,web_safari'], ['--extractor-args', 'youtube:player_client=default,-visionos'], ['--extractor-args', 'youtube:player_client=android_vr,tv']]
  const lines = []
  for (const t of tries) {
    try {
      const r = await exec(bin, [...jsRuntimeArgs(), ...t, ...base], 60000)
      lines.push(`${t.join(' ') || 'default'}: OK → ${String(r.out).trim().slice(0, 60)}`)
      return { ok: true, lines }
    } catch (e) {
      lines.push(`${t.join(' ') || 'default'}: ${explain(e).slice(0, 90)}`)
    }
  }
  return { ok: false, lines }
}

const paths = { COOKIES_FILE, PROXY_FILE, BIN_DIR }

module.exports = { probe, paths, download, ensure, install, update, status, find, hasFfmpeg, installHelp }
