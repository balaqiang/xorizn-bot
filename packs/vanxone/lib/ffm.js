const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawn } = require('child_process')

// Jalankan ffmpeg pada buffer masukan -> buffer keluaran. buildArgs(inFile, outFile) -> array argumen
async function run(buffer, outExt, buildArgs, timeoutMs = 90000) {
  const id = `ffm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const input = path.join(os.tmpdir(), `${id}.in`)
  const output = path.join(os.tmpdir(), `${id}.${outExt}`)
  try {
    fs.writeFileSync(input, buffer)
    await new Promise((resolve, reject) => {
      const p = spawn('ffmpeg', ['-y', ...buildArgs(input, output)], { stdio: ['ignore', 'ignore', 'pipe'] })
      let err = ''
      p.stderr.on('data', (d) => { err = (err + d).slice(-600) })
      const t = setTimeout(() => { p.kill('SIGKILL'); reject(new Error('timeout')) }, timeoutMs)
      p.on('error', (e) => { clearTimeout(t); reject(e.code === 'ENOENT' ? new Error('nff') : e) })
      p.on('close', (c) => { clearTimeout(t); c === 0 ? resolve() : reject(new Error(`ffmpeg ${c}: ${err.trim().split('\n').slice(-3).join(' | ')}`)) })
    })
    return fs.readFileSync(output)
  } finally {
    for (const f of [input, output]) fs.rmSync(f, { force: true })
  }
}
const explain = (e) => (e.message === 'nff' ? 'ffmpeg belum terpasang di server (sudo apt install ffmpeg).' : e.message === 'timeout' ? 'Proses terlalu lama.' : 'Gagal memproses media.')

// Beberapa buffer masukan -> satu keluaran. buildArgs(inputs[], out) -> argumen ffmpeg
async function runMulti(buffers, outExt, buildArgs, timeoutMs = 120000) {
  const id = `ffm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const inputs = buffers.map((_, i) => path.join(os.tmpdir(), `${id}.in${i}`))
  const output = path.join(os.tmpdir(), `${id}.${outExt}`)
  try {
    buffers.forEach((b, i) => fs.writeFileSync(inputs[i], b))
    await new Promise((resolve, reject) => {
      const p = spawn('ffmpeg', ['-y', ...buildArgs(inputs, output)], { stdio: ['ignore', 'ignore', 'pipe'] })
      let err = ''
      p.stderr.on('data', (d) => { err = (err + d).slice(-600) })
      const t = setTimeout(() => { p.kill('SIGKILL'); reject(new Error('timeout')) }, timeoutMs)
      p.on('error', (e) => { clearTimeout(t); reject(e.code === 'ENOENT' ? new Error('nff') : e) })
      p.on('close', (c) => { clearTimeout(t); c === 0 ? resolve() : reject(new Error(`ffmpeg ${c}: ${err.trim().split('\n').slice(-3).join(' | ')}`)) })
    })
    return fs.readFileSync(output)
  } finally {
    for (const f of [...inputs, output]) fs.rmSync(f, { force: true })
  }
}

// Durasi media (detik, dibulatkan) lewat ffprobe. 0 kalau gagal.
async function duration(buffer) {
  const f = path.join(os.tmpdir(), `ffp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.in`)
  try {
    fs.writeFileSync(f, buffer)
    return await new Promise((resolve) => {
      const p = spawn('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', f])
      let out = ''
      p.stdout.on('data', (d) => (out += d))
      p.on('error', () => resolve(0))
      p.on('close', () => resolve(Math.round(parseFloat(out)) || 0))
    })
  } finally {
    fs.rmSync(f, { force: true })
  }
}

module.exports = { run, runMulti, explain, duration }
