const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawn } = require('child_process')
const { getMedia } = require('../../lib/utils')

function ffmpeg(input, output) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', ['-y', '-i', input, '-vn', '-acodec', 'libmp3lame', '-b:a', '128k', output])
    const timer = setTimeout(() => { p.kill('SIGKILL'); reject(new Error('timeout')) }, 90000)
    p.on('error', (e) => { clearTimeout(timer); reject(e.code === 'ENOENT' ? new Error('nff') : e) })
    p.on('close', (code) => { clearTimeout(timer); code === 0 ? resolve() : reject(new Error(`ffmpeg ${code}`)) })
  })
}

module.exports = {
  name: 'tomp3',
  command: ['tomp3', 'toaudio'],
  category: 'tools',
  desc: 'Ubah video/voice jadi MP3 (kirim/reply)',
  run: async ({ sock, msg, from, prefix, reply }) => {
    const media = await getMedia(sock, msg, ['videoMessage', 'audioMessage'])
    if (!media) return reply(`Kirim atau reply video/audio dengan caption ${prefix}tomp3`)

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const input = path.join(os.tmpdir(), `${id}.in`)
    const output = path.join(os.tmpdir(), `${id}.mp3`)
    try {
      fs.writeFileSync(input, media.buffer)
      await ffmpeg(input, output)
      await sock.sendMessage(from, { audio: fs.readFileSync(output), mimetype: 'audio/mpeg' }, { quoted: msg })
    } catch (err) {
      await reply(err.message === 'nff' ? 'ffmpeg belum terpasang di server (sudo apt install ffmpeg).' : 'Gagal mengonversi media.')
    } finally {
      for (const f of [input, output]) fs.rmSync(f, { force: true })
    }
  }
}
