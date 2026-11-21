/**
 * Engine download berbasis yt-dlp (YouTube, Instagram, Facebook, X, TikTok, dan ratusan situs lain).
 * Binary dicari di: src/bin/yt-dlp → PATH → python -m yt_dlp. Bila belum ada dan downloader.autoInstall aktif,
 * diunduh otomatis dari rilis resmi GitHub yt-dlp. Memakai ffmpeg bawaan (ffmpeg-static) untuk MP3 & merge video.
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import bot from '../core/bot.js'
import logger from '../core/logger.js'
import { ffmpegPath } from './sticker.js'

const log = logger.child('ytdlp')
const binDir = () => path.join(bot.config?.paths?.src || process.cwd(), 'bin')
const tmpDir = () => bot.config?.paths?.tmp || path.join(process.cwd(), 'tmp')
const cookiesFile = () => path.join(binDir(), 'cookies.txt')
const proxyFile = () => path.join(binDir(), 'proxy.txt')
const readTrim = (f) => {
  try {
    return fs.readFileSync(f, 'utf8').trim()
  } catch {
    return ''
  }
}

export function cfg() {
  const d = bot.settings?.downloader || {}
  return {
    maxMB: Number(d.maxMB) || 100,
    maxMinutes: Number(d.maxMinutes) || 30,
    autoInstall: d.autoInstall !== false,
    cookies: fs.existsSync(cookiesFile()) ? cookiesFile() : '',
    proxy: readTrim(proxyFile())
  }
}

const isTermux = () => /com\.termux/.test(process.env.PREFIX || '')
let resolved = null
let installing = null
let jsArgs = null

function assetName() {
  if (isTermux()) return null
  if (process.platform === 'win32') return 'yt-dlp.exe'
  if (process.platform === 'darwin') return 'yt-dlp_macos'
  if (process.platform === 'linux') return process.arch === 'arm64' ? 'yt-dlp_linux_aarch64' : process.arch === 'x64' ? 'yt-dlp_linux' : null
  return null
}
const localBin = () => path.join(binDir(), process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp')

function works(cmd, pre = []) {
  const r = spawnSync(cmd, [...pre, '--version'], { timeout: 20000, encoding: 'utf8', windowsHide: true })
  return r.status === 0 ? String(r.stdout).trim() : null
}

export function find() {
  if (resolved) return resolved
  const list = []
  if (fs.existsSync(localBin())) list.push({ cmd: localBin(), pre: [] })
  list.push({ cmd: 'yt-dlp', pre: [] }, { cmd: 'python3', pre: ['-m', 'yt_dlp'] }, { cmd: 'python', pre: ['-m', 'yt_dlp'] })
  for (const c of list) {
    const v = works(c.cmd, c.pre)
    if (v) return (resolved = { ...c, version: v })
  }
  return null
}

export const installHelp = () =>
  isTermux()
    ? 'yt-dlp belum terpasang. Di Termux jalankan:\npkg install python ffmpeg && pip install -U "yt-dlp[default]"'
    : 'yt-dlp belum terpasang. Owner bisa memasangnya dengan *.ytdlp install* atau manual: https://github.com/yt-dlp/yt-dlp#installation'

export async function install() {
  const asset = assetName()
  if (!asset) throw new Error(installHelp())
  installing ??= (async () => {
    fs.mkdirSync(binDir(), { recursive: true })
    const tmp = `${localBin()}.download`
    log.info(`mengunduh yt-dlp (${asset}) dari GitHub resmi...`)
    const res = await fetch(`https://github.com/yt-dlp/yt-dlp/releases/latest/download/${asset}`, { redirect: 'follow', signal: AbortSignal.timeout(300000) })
    if (!res.ok) throw new Error(`gagal mengunduh yt-dlp (HTTP ${res.status})`)
    fs.writeFileSync(tmp, Buffer.from(await res.arrayBuffer()))
    fs.chmodSync(tmp, 0o755)
    fs.renameSync(tmp, localBin())
    resolved = null
    const found = find()
    if (!found) throw new Error('File yt-dlp terunduh tetapi tidak bisa dijalankan di sistem ini.')
    log.success(`yt-dlp ${found.version} terpasang`)
    return found
  })().finally(() => {
    installing = null
  })
  return installing
}

/** Pastikan yt-dlp siap (pasang otomatis bila diizinkan). */
export async function ensure() {
  const f = find()
  if (f) return f
  if (!cfg().autoInstall) throw new Error(installHelp())
  try {
    return await install()
  } catch (err) {
    log.warn('gagal memasang otomatis:', err.message)
    throw new Error(`${installHelp()}\n(Pemasangan otomatis gagal: ${err.message})`)
  }
}

function jsRuntimeArgs() {
  if (jsArgs) return jsArgs
  if (spawnSync('deno', ['--version'], { windowsHide: true }).status === 0) return (jsArgs = [])
  const major = Number(process.versions.node.split('.')[0])
  return (jsArgs = major >= 22 ? ['--js-runtimes', `node:${process.execPath}`] : [])
}

// antrian: maksimal 2 proses sekaligus
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
    const p = spawn(bin.cmd, [...bin.pre, ...args], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })
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

/** Terjemahkan error yt-dlp menjadi pesan yang bisa dipahami pengguna. */
export function explain(e) {
  const s = `${e.stderr || ''}\n${e.stdout || ''}\n${e.message || ''}`
  const c = cfg()
  if (e.code === 'TIMEOUT') return 'Proses terlalu lama (lebih dari 5 menit). Coba video yang lebih pendek.'
  if (/not a bot|confirm you.?re not a bot|Sign in to confirm/i.test(s)) return 'YouTube meminta verifikasi login untuk IP server ini. Owner bisa menaruh cookies YouTube di src/bin/cookies.txt atau proxy di src/bin/proxy.txt.'
  if (/does not pass filter/i.test(s)) return `Durasi video melebihi batas ${c.maxMinutes} menit.`
  if (/larger than max-filesize|File is larger/i.test(s)) return `Ukuran file melebihi batas ${c.maxMB} MB.`
  if (/Private video|Video unavailable|has been removed|not available|members-only|Join this channel/i.test(s)) return 'Video tidak tersedia (privat, dihapus, atau dibatasi).'
  if (/confirm your age/i.test(s)) return 'Video dibatasi umur, butuh cookies akun untuk mengunduhnya.'
  if (/login required|rate-limit reached|Requested content is not available|empty media response/i.test(s)) return 'Situs meminta login. Owner perlu menaruh cookies akun di src/bin/cookies.txt.'
  if (/HTTP Error 429|Too Many Requests/i.test(s)) return 'Terlalu banyak permintaan ke server. Coba lagi beberapa menit lagi.'
  if (/No video could be found|no video in this|There's no video|No media found|does not contain (any )?video/i.test(s)) return 'Postingan ini tidak berisi video yang bisa diunduh.'
  if (/Unsupported URL/i.test(s)) return 'Link tidak didukung.'
  if (e.code === 'ENOENT') return installHelp()
  log.warn('error tak dikenal:', s.slice(-500))
  return 'Gagal mengunduh. Coba lagi nanti, atau perbarui yt-dlp dengan *.ytdlp update*.'
}

const EXT = { audio: ['mp3', 'm4a', 'opus', 'ogg', 'webm', 'aac'], video: ['mp4', 'mkv', 'webm', 'mov'], image: ['jpg', 'jpeg', 'png', 'webp'] }
const kindOfFile = (f) => {
  const ext = path.extname(f).slice(1).toLowerCase()
  return Object.keys(EXT).find((k) => EXT[k].includes(ext)) || 'video'
}

function cleanupBase(id) {
  try {
    for (const f of fs.readdirSync(tmpDir())) if (f.startsWith(id)) fs.rmSync(path.join(tmpDir(), f), { force: true })
  } catch {}
}

/**
 * Unduh URL. opts: { audio, playlist, max }
 * → { title, files: [{ file, kind, ext }], cleanup() }  (pemanggil WAJIB memanggil cleanup()).
 */
export async function download(url, opts = {}) {
  const bin = await ensure()
  const c = cfg()
  fs.mkdirSync(tmpDir(), { recursive: true })
  const id = `ytdl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const base = path.join(tmpDir(), id)
  const ff = ffmpegPath()
  const format = opts.audio
    ? ['-f', 'bestaudio/best', '-x', '--audio-format', 'mp3', '--audio-quality', '128K']
    : ['-f', 'bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720][ext=mp4]/b[ext=mp4]/b', '--merge-output-format', 'mp4']

  const common = [
    opts.playlist ? '--yes-playlist' : '--no-playlist',
    ...(opts.playlist ? ['--playlist-end', String(opts.max || 10)] : []),
    '--no-warnings', '--no-mtime', '--socket-timeout', '20', '--retries', '2',
    '--max-filesize', `${c.maxMB}M`,
    '--match-filter', `duration<=?${c.maxMinutes * 60}`,
    '--print', 'after_move:%(title)s',
    ...(ff && ff !== 'ffmpeg' ? ['--ffmpeg-location', ff] : []),
    ...format,
    ...(c.cookies ? ['--cookies', c.cookies] : []),
    ...(c.proxy ? ['--proxy', c.proxy] : []),
    '-o', `${base}-%(autonumber)s.%(ext)s`,
    '--', url
  ]

  // YouTube kadang menolak (bot-check): coba beberapa identitas klien sebelum menyerah
  const isYt = /(^|\/\/|\.)(youtube\.com|youtu\.be)(\/|$)/i.test(url)
  const strategies = !isYt
    ? [[]]
    : c.cookies
      ? [[], ['--extractor-args', 'youtube:player_client=web_safari,mweb']]
      : [[], ['--extractor-args', 'youtube:player_client=tv,web_safari'], ['--extractor-args', 'youtube:player_client=default,-visionos'], ['--extractor-args', 'youtube:player_client=android_vr,tv']]
  const botCheck = /not a bot|confirm you.?re not a bot|Sign in to confirm/i

  const run = async (extra) => {
    const args = [...(isYt ? ['--force-ipv4'] : []), ...extra, ...common]
    try {
      return await exec(bin, [...jsRuntimeArgs(), ...args], 300000)
    } catch (e) {
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
        break
      } catch (e) {
        lastErr = e
        cleanupBase(id)
        if (!botCheck.test(`${e.stderr || ''}${e.stdout || ''}`) || i === strategies.length - 1) break
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
    .readdirSync(tmpDir())
    .filter((f) => f.startsWith(id) && !/\.(part|ytdl|temp)$/i.test(f))
    .sort()
    .map((f) => path.join(tmpDir(), f))
    .filter((f) => fs.statSync(f).size > 0)
  if (!files.length) {
    cleanupBase(id)
    const logText = `${out.out}\n${out.err}`
    if (/does not pass filter/i.test(logText)) throw new Error(`Durasi video melebihi batas ${c.maxMinutes} menit.`)
    if (/larger than max-filesize|File is larger/i.test(logText)) throw new Error(`Ukuran file melebihi batas ${c.maxMB} MB.`)
    throw new Error('Tidak ada file yang dihasilkan. Coba lagi, atau perbarui yt-dlp dengan *.ytdlp update*.')
  }
  const title = String(out.out).split('\n').map((s) => s.trim()).find(Boolean) || ''
  return { title, files: files.map((file) => ({ file, kind: kindOfFile(file), ext: path.extname(file).slice(1).toLowerCase() })), cleanup: () => cleanupBase(id) }
}

export function status() {
  const f = find()
  const c = cfg()
  return { installed: !!f, version: f?.version || null, canInstall: c.autoInstall && !!assetName(), cookies: !!c.cookies, proxy: !!c.proxy, maxMB: c.maxMB, maxMinutes: c.maxMinutes }
}

export async function update() {
  resolved = null
  await install()
  return find()
}
