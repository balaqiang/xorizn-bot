// Video tambahan: ubah kecepatan, kompres, jadi MP3, dan lembar cuplikan (contact sheet)
const kit = require('../../lib/kit')
const io = require('../../lib/imgops')
const ffm = require('../../lib/ffm')
const sharp = require('sharp')

const fail = (m) => Object.assign(new Error(m), { userMessage: m })
const ENC = ['-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']
const tempoChain = (f) => {
  const out = []
  while (f > 2) { out.push('atempo=2.0'); f /= 2 }
  while (f < 0.5) { out.push('atempo=0.5'); f /= 0.5 }
  out.push(`atempo=${f.toFixed(4)}`)
  return out.join(',')
}

const specs = {
  vspeed: { desc: 'Ubah kecepatan video (0.25x lambat – 4x cepat), suara ikut menyesuaikan', usage: '<0.25-4>', example: '2', needs: 'video', args: true, heavy: true, run: async (c, m) => {
    const f = kit.numArg(c.args[0], NaN, 0.25, 4)
    if (!Number.isFinite(f)) throw fail('Tulis kecepatannya 0.25–4. Contoh: .vspeed 2 (2x lebih cepat), .vspeed 0.5 (slow motion)')
    const p = await kit.probe(m.buffer)
    const out = await ffm.run(m.buffer, 'mp4', (i, o) => {
      const a = ['-i', i, '-vf', `setpts=PTS/${f},scale=trunc(iw/2)*2:trunc(ih/2)*2`]
      if (p?.audio) a.push('-af', tempoChain(f), '-c:a', 'aac', '-b:a', '128k')
      else a.push('-an')
      return [...a, ...ENC, '-crf', '24', o]
    }, 240000)
    return { video: out, caption: `⏩ Kecepatan ${f}x${f < 1 ? ' (slow motion)' : ''}${p?.duration ? ` • ${kit.fmtTime(p.duration / f)}` : ''}` }
  } },
  vcompress: { desc: 'Kecilkan ukuran video (maks 720p) agar mudah dikirim', usage: '[kualitas 1-3: 1=kecil banget]', example: '2', needs: 'video', heavy: true, run: async (c, m) => {
    const q = Math.round(kit.numArg(c.args[0], 2, 1, 3))
    const crf = { 1: 34, 2: 30, 3: 26 }[q]
    const out = await ffm.run(m.buffer, 'mp4', (i, o) => ['-i', i, '-vf', "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2", ...ENC, '-crf', String(crf), '-c:a', 'aac', '-b:a', '96k', o], 300000)
    const saved = Math.round((1 - out.length / m.buffer.length) * 100)
    return { video: out.length < m.buffer.length ? out : m.buffer, caption: `🗜️ ${kit.fmtSize(m.buffer.length)} → ${kit.fmtSize(out.length)}${saved > 0 ? ` (hemat ${saved}%)` : '\nVideo sudah cukup kecil, dikirim ulang apa adanya.'}` }
  } },
  vsheet: { desc: 'Lembar cuplikan video: 9 frame berurutan lengkap dengan info (seperti contact sheet)', needs: 'video', heavy: true, run: async (c, m) => {
    const p = await kit.probe(m.buffer)
    if (!p?.video || !p.duration) throw fail('Video tidak terbaca.')
    const n = 9
    const png = await ffm.run(m.buffer, 'png', (i, o) => ['-i', i, '-vf', `fps=${n}/${Math.max(1, p.duration).toFixed(3)},scale=480:-2,tile=3x3:padding=8:margin=8:color=0x101a33`, '-frames:v', '1', o], 150000)
    const tm = await io.meta(png)
    const head = await io.textFit(`${p.video.width}×${p.video.height} • ${kit.fmtTime(p.duration)} • ${p.video.fps} fps • ${kit.fmtSize(p.size)}`, tm.w - 60, 60, { maxSize: 38, color: '#ffffff', bold: false })
    const hm = await io.meta(head)
    const out = await sharp({ create: { width: tm.w, height: tm.h + 100, channels: 3, background: '#101a33' } }).composite([{ input: png, left: 0, top: 100 }, { input: head, left: Math.round((tm.w - hm.w) / 2), top: 20 + Math.round((60 - hm.h) / 2) }]).jpeg({ quality: 92 }).toBuffer()
    return { image: out, caption: `🎞️ 9 cuplikan dari ${kit.fmtTime(p.duration)} video` }
  } }
}

module.exports = kit.multi({ name: 'vidplus2', category: 'video', emoji: '⏩', desc: 'Kecepatan video, kompres, lembar cuplikan', specs })
