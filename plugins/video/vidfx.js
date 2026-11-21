// Editor video (reply/kirim video). Memakai ffmpeg. Hasil H.264 + AAC (siap kirim ke WhatsApp).
const fs = require('fs')
const os = require('os')
const path = require('path')
const kit = require('../../lib/kit')
const { panel, num } = require('../../lib/uitext')

const MAX_IN = 180 // detik maksimal yang diproses
const FONT = path.join(__dirname, '..', '..', 'assets', 'fonts', 'Outfit-Bold.ttf')
const ENC = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']
const AENC = ['-c:a', 'aac', '-b:a', '128k']
const EVEN = 'scale=trunc(iw/2)*2:trunc(ih/2)*2'

// ffmpeg pada video: pre = opsi sebelum -i, args = setelah -i
const run = (m, args, { pre = [], ext = 'mp4', timeout = 300000 } = {}) => kit.ffm.run(m.buffer, ext, (i, o) => ['-t', String(MAX_IN), ...pre, '-i', i, ...args, o], timeout)
const vid = (video, caption) => ({ video, caption: `✅ ${caption}` })
const hasAudio = async (m) => !!(await kit.probe(m.buffer))?.audio

const specs = {
  vreverse: { desc: 'Putar balik video (maks 30 detik)', needs: 'video', heavy: true, run: async (c, m) => {
    const a = await hasAudio(m)
    return vid(await run(m, ['-t', '30', '-vf', `reverse,${EVEN}`, ...(a ? ['-af', 'areverse'] : ['-an']), ...ENC, ...(a ? AENC : [])]), 'Video diputar balik')
  } },
  vmute: { desc: 'Hilangkan suara dari video', needs: 'video', heavy: true, run: async (c, m) => vid(await run(m, ['-an', '-c:v', 'copy', '-movflags', '+faststart']), 'Video tanpa suara') },
  vrotate: { desc: 'Putar video (90, 180, 270 derajat)', usage: '[90|180|270]', needs: 'video', heavy: true, run: async (c, m) => {
    const d = ((Math.round(kit.numArg(c.args[0], 90, -360, 360) / 90) * 90) % 360 + 360) % 360
    const vf = { 90: 'transpose=1', 180: 'hflip,vflip', 270: 'transpose=2', 0: 'null' }[d]
    return vid(await run(m, ['-vf', `${vf},${EVEN}`, ...ENC, '-c:a', 'copy']), `Diputar ${d}°`)
  } },
  vflip: { desc: 'Balik video atas-bawah', needs: 'video', heavy: true, run: async (c, m) => vid(await run(m, ['-vf', `vflip,${EVEN}`, ...ENC, '-c:a', 'copy']), 'Dibalik vertikal') },
  vmirror: { desc: 'Cerminkan video kiri-kanan', needs: 'video', heavy: true, run: async (c, m) => vid(await run(m, ['-vf', `hflip,${EVEN}`, ...ENC, '-c:a', 'copy']), 'Dibalik horizontal') },
  vbw: { desc: 'Video hitam putih', needs: 'video', heavy: true, run: async (c, m) => vid(await run(m, ['-vf', `hue=s=0,${EVEN}`, ...ENC, '-c:a', 'copy']), 'Hitam putih') },
  vloop: { desc: 'Ulang video beberapa kali (2-10x, total maks 5 menit)', usage: '[2-10]', needs: 'video', heavy: true, run: async (c, m) => {
    const p = await kit.probe(m.buffer)
    if (p && p.duration > 60) throw Object.assign(new Error('x'), { userMessage: 'Video untuk loop maksimal 60 detik.' })
    let n = Math.round(kit.numArg(c.args[0], 3, 2, 10))
    if (p?.duration) n = Math.min(n, Math.max(2, Math.floor(300 / p.duration)))
    return vid(await run(m, ['-vf', EVEN, ...ENC, ...AENC], { pre: ['-stream_loop', String(n - 1)] }), `Diulang ${n}x`)
  } },
  boomerang: { desc: 'Efek boomerang: maju lalu mundur (maks 6 detik)', needs: 'video', heavy: true, run: async (c, m) =>
    vid(await run(m, ['-t', '6', '-filter_complex', `[0:v]${EVEN},split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]`, '-map', '[v]', '-an', ...ENC]), 'Boomerang') },
  vtrim: { desc: 'Potong video dari waktu mulai sampai selesai', usage: '<mulai> [selesai]', example: '0:05 0:20', needs: 'video', heavy: true, run: async (c, m) => {
    const a = kit.parseTime(c.args[0])
    const b = c.args[1] ? kit.parseTime(c.args[1]) : null
    if (a === null || (c.args[1] && b === null) || (b !== null && b <= a)) throw Object.assign(new Error('waktu'), { userMessage: 'Format waktu: 5, 0:05, atau 1:02:03. Waktu selesai harus setelah waktu mulai.' })
    return vid(await kit.ffm.run(m.buffer, 'mp4', (i, o) => ['-ss', String(a), ...(b !== null ? ['-to', String(b)] : ['-t', String(MAX_IN)]), '-i', i, '-vf', EVEN, ...ENC, ...AENC, o], 300000), `Dipotong ${kit.fmtTime(a)}${b !== null ? ` – ${kit.fmtTime(b)}` : ' – akhir'}`)
  } },
  vframe: { desc: 'Ambil satu gambar (frame) dari video pada detik tertentu', usage: '[waktu]', example: '0:03', needs: 'video', heavy: true, run: async (c, m) => {
    const t = c.args[0] ? kit.parseTime(c.args[0]) : 1
    const img = await kit.ffm.run(m.buffer, 'jpg', (i, o) => ['-ss', String(t ?? 1), '-i', i, '-frames:v', '1', '-q:v', '2', o], 60000)
    if (!img.length) throw Object.assign(new Error('x'), { userMessage: 'Waktu di luar durasi video.' })
    return { image: img, caption: `🖼️ Frame pada ${kit.fmtTime(t ?? 1)}` }
  } },
  vgif: { desc: 'Ubah video jadi GIF (tanpa suara, maks 10 detik)', needs: 'video', heavy: true, run: async (c, m) =>
    ({ video: await run(m, ['-t', '10', '-an', '-vf', `fps=15,scale='min(480,iw)':-2`, ...ENC]), caption: '✅ GIF', gif: true }) },
  vstory: { desc: 'Muat video ke Story/Status 9:16 dengan latar blur', needs: 'video', heavy: true, run: async (c, m) => {
    const a = await hasAudio(m)
    const fc = '[0:v]scale=270:480:force_original_aspect_ratio=increase,crop=270:480,boxblur=6:2,scale=1080:1920[bg];[0:v]scale=1080:1920:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]'
    return vid(await run(m, ['-t', '90', '-filter_complex', fc, '-map', '[v]', ...(a ? ['-map', '0:a'] : []), ...ENC, ...(a ? AENC : [])], { timeout: 420000 }), 'Siap untuk Story/Status (1080×1920)')
  } },
  vsquare: { desc: 'Potong video jadi kotak 1:1 (tengah)', needs: 'video', heavy: true, run: async (c, m) =>
    vid(await run(m, ['-vf', "crop='min(iw,ih)':'min(iw,ih)',scale='min(720,iw)':-2", ...ENC, '-c:a', 'copy']), 'Video 1:1') },
  vresize: { desc: 'Ubah resolusi video (tinggi 144-1080 px)', usage: '<tinggi>', example: '480', needs: 'video', heavy: true, run: async (c, m) => {
    const h = Math.round(kit.numArg(c.args[0], 480, 144, 1080) / 2) * 2
    return vid(await run(m, ['-vf', `scale=-2:${h}`, ...ENC, ...AENC]), `Resolusi ${h}p`)
  } },
  vfade: { desc: 'Tambah fade in & fade out pada video', usage: '[detik]', needs: 'video', heavy: true, run: async (c, m) => {
    const p = await kit.probe(m.buffer)
    const d = kit.numArg(c.args[0], 1, 0.3, 5)
    const total = Math.min(p?.duration || 0, MAX_IN)
    const out = total > d * 2
    const a = !!p?.audio
    return vid(await run(m, ['-vf', `fade=t=in:d=${d}${out ? `,fade=t=out:st=${(total - d).toFixed(2)}:d=${d}` : ''},${EVEN}`, ...(a ? ['-af', `afade=t=in:d=${d}${out ? `,afade=t=out:st=${(total - d).toFixed(2)}:d=${d}` : ''}`] : []), ...ENC, ...(a ? AENC : [])]), 'Fade in/out')
  } },
  vcaption: { desc: 'Tulis teks di bagian bawah video', usage: '<teks>', example: 'Liburan seru!', needs: 'video', heavy: true, run: async (c, m) => {
    const raw = kit.rest(c.body).trim()
    if (!raw) throw Object.assign(new Error('x'), { userMessage: 'Tulis teksnya. Contoh: .vcaption Liburan seru!' })
    if (raw.length > 120) throw Object.assign(new Error('x'), { userMessage: 'Teks maksimal 120 karakter.' })
    const p = await kit.probe(m.buffer)
    const wide = p?.video?.width || 720
    const perLine = Math.max(14, Math.round(wide / 24))
    const lines = []
    let cur = ''
    for (const w of raw.split(/\s+/)) {
      if (cur && (cur + ' ' + w).length > perLine) { lines.push(cur); cur = w } else cur = cur ? `${cur} ${w}` : w
    }
    if (cur) lines.push(cur)
    const tf = path.join(os.tmpdir(), `vcap-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.txt`)
    fs.writeFileSync(tf, lines.join('\n'))
    try {
      const dt = `drawtext=fontfile='${FONT}':textfile='${tf}':fontcolor=white:fontsize=h/17:line_spacing=6:box=1:boxcolor=black@0.55:boxborderw=14:x=(w-text_w)/2:y=h-text_h-h*0.07:borderw=0`
      return vid(await run(m, ['-vf', `${EVEN},${dt}`, ...ENC, '-c:a', 'copy']), 'Teks ditambahkan')
    } finally {
      fs.rmSync(tf, { force: true })
    }
  } },
  vinfo: { desc: 'Info video: resolusi, durasi, fps, codec, bitrate', needs: 'video', run: async (c, m) => {
    const p = await kit.probe(m.buffer)
    if (!p?.video) throw Object.assign(new Error('x'), { userMessage: 'Tidak ada trek video pada file ini.' })
    return panel('INFO VIDEO', [
      { head: '🎬 *VIDEO*', lines: [`Resolusi : ${p.video.width} × ${p.video.height}`, `Durasi : ${kit.fmtTime(p.duration)}`, `FPS : ${p.video.fps}`, `Codec : ${p.video.codec}`, `Ukuran : ${kit.fmtSize(p.size)}`, p.bitrate ? `Bitrate total : ${num(p.bitrate / 1000, 0)} kbps` : ''].filter(Boolean) },
      { head: '🔊 *AUDIO*', lines: p.audio ? [`Codec : ${p.audio.codec}`, `Sample rate : ${p.audio.rate} Hz`, `Kanal : ${p.audio.channels}`] : ['Tidak ada suara'] }
    ])
  } }
}

module.exports = kit.multi({ name: 'vidfx', category: 'video', emoji: '🎬', desc: 'Editor video', specs })
