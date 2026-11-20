// Video lanjutan: potong jadi beberapa bagian (cocok untuk Status 30 detik) dan watermark teks
const fs = require('fs')
const os = require('os')
const path = require('path')
const kit = require('../../lib/kit')
const du = require('../../lib/docutil')
const ffm = require('../../lib/ffm')

const FONT = path.join(__dirname, '..', '..', 'assets', 'fonts', 'Outfit-Bold.ttf')
const fail = (m) => Object.assign(new Error(m), { userMessage: m })
const ENC = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']

const specs = {
  vsplit: { desc: 'Potong video jadi beberapa bagian sama panjang (mis. 30 detik untuk Status WA), maks 10 bagian', usage: '[detik per bagian 5-120]', example: '30', needs: 'video', heavy: true, run: async (c, m) => {
    const d = Math.round(kit.numArg(c.args[0], 30, 5, 120))
    const p = await kit.probe(m.buffer)
    if (!p?.duration) throw fail('Durasi video tidak terbaca.')
    const parts = Math.ceil(p.duration / d)
    if (parts < 2) throw fail(`Video hanya ${kit.fmtTime(p.duration)}, tidak perlu dipotong ${d} detik. Coba angka lebih kecil.`)
    if (parts > 10) throw fail(`Akan menghasilkan ${parts} bagian (maks 10). Pakai durasi per bagian lebih besar, mis. ${Math.ceil(p.duration / 10)}.`)
    const files = await du.withTmp(async (dir) => {
      const inp = path.join(dir, 'in.mp4')
      fs.writeFileSync(inp, m.buffer)
      const r = await du.exec('ffmpeg', ['-y', '-i', inp, ...ENC, '-c:a', 'aac', '-b:a', '128k', '-force_key_frames', `expr:gte(t,n_forced*${d})`, '-f', 'segment', '-segment_time', String(d), '-reset_timestamps', '1', path.join(dir, 'part%02d.mp4')], { timeout: 240000 })
      const list = fs.readdirSync(dir).filter((f) => /^part\d+\.mp4$/.test(f)).sort()
      if (r.code !== 0 || !list.length) throw new Error('ffmpeg')
      return list.map((f) => fs.readFileSync(path.join(dir, f)))
    })
    for (let i = 0; i < files.length; i++) {
      await c.sock.sendMessage(c.from, { video: files[i], caption: `✂️ Bagian ${i + 1}/${files.length}` }, { quoted: c.msg })
      await new Promise((r) => setTimeout(r, 900))
    }
    return null
  } },
  vwm: { desc: 'Tambah watermark teks transparan di pojok video', usage: '<teks> [| posisi]', example: '@tokosaya | kiri-atas', needs: 'video', args: true, heavy: true, run: async (c, m) => {
    const [t, pos = 'kanan-bawah'] = kit.rest(c.body).split('|').map((s) => s.trim())
    if (!t) throw fail('Tulis teks watermark.')
    const x = /kiri/.test(pos) ? 'w*0.03' : /tengah/.test(pos) ? '(w-text_w)/2' : 'w-text_w-w*0.03'
    const y = /atas/.test(pos) ? 'h*0.03' : /tengah-tengah|pusat/.test(pos) ? '(h-text_h)/2' : 'h-text_h-h*0.03'
    const tf = path.join(os.tmpdir(), `vwm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.txt`)
    fs.writeFileSync(tf, t.slice(0, 60))
    try {
      const dt = `drawtext=fontfile='${FONT}':textfile='${tf}':fontcolor=white@0.7:fontsize=h/26:shadowcolor=black@0.6:shadowx=2:shadowy=2:x=${x}:y=${y}`
      const out = await ffm.run(m.buffer, 'mp4', (i, o) => ['-i', i, '-vf', `scale=trunc(iw/2)*2:trunc(ih/2)*2,${dt}`, ...ENC, '-c:a', 'copy', o], 180000)
      return { video: out, caption: '✅ Watermark ditambahkan\nPosisi: kiri-atas, kanan-atas, kiri-bawah, kanan-bawah, tengah-tengah' }
    } finally {
      fs.rmSync(tf, { force: true })
    }
  } }
}

module.exports = kit.multi({ name: 'vidplus', category: 'video', emoji: '🎞️', desc: 'Potong video per bagian & watermark teks', specs })
