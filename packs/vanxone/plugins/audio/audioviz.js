// Visual & pembersih audio: gelombang suara, spektrogram, audiogram (video), hapus bagian hening, redam noise
const kit = require('../../lib/kit')
const io = require('../../lib/imgops')
const ffm = require('../../lib/ffm')
const sharp = require('sharp')

const fail = (m) => Object.assign(new Error(m), { userMessage: m })

const clean = (m, filter) => {
  const ptt = !!m.info?.ptt
  const codec = ptt ? ['-c:a', 'libopus', '-b:a', '64k', '-application', 'voip', '-ar', '48000'] : ['-c:a', 'libmp3lame', '-b:a', '160k']
  return ffm.run(m.buffer, ptt ? 'ogg' : 'mp3', (i, o) => ['-i', i, '-vn', '-af', filter, '-map_metadata', '-1', ...codec, o], 150000).then((audio) => ({ audio, ptt }))
}

async function card(title, sub, inner, W = 1280) {
  const im = await io.meta(inner)
  const H = im.h + 230
  const head = await io.textFit(title, W - 160, 70, { maxSize: 56, color: '#ffffff' })
  const hm = await io.meta(head)
  const comps = [{ input: head, left: Math.round((W - hm.w) / 2), top: 40 + Math.round((70 - hm.h) / 2) }, { input: inner, left: Math.round((W - im.w) / 2), top: 135 }]
  const s = await io.textFit(sub, W - 160, 36, { maxSize: 28, color: '#9fb0d8', bold: false })
  const sm = await io.meta(s)
  comps.push({ input: s, left: Math.round((W - sm.w) / 2), top: H - 70 + Math.round((36 - sm.h) / 2) })
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d1530"/><stop offset="1" stop-color="#25306b"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`)
  return sharp(bg).composite(comps).png().toBuffer()
}

const specs = {
  waveform: { desc: 'Gambar gelombang suara (waveform) dari audio/VN/video + info durasi', needs: 'audio', heavy: true, run: async (c, m) => {
    const p = await kit.probe(m.buffer)
    const png = await ffm.run(m.buffer, 'png', (i, o) => ['-i', i, '-filter_complex', 'aformat=channel_layouts=mono,showwavespic=s=1120x300:colors=#4fd8ff|#b388ff:scale=sqrt', '-frames:v', '1', o], 120000)
    const out = await card('WAVEFORM', `${p?.duration ? kit.fmtTime(p.duration) : ''} • ${p?.audio ? `${p.audio.codec} ${Math.round(p.audio.rate / 1000)} kHz` : ''} • ${kit.fmtSize(m.buffer.length)}`, png)
    return { image: out, caption: '🌊 Waveform audio' }
  } },
  spektrum: { desc: 'Spektrogram frekuensi audio (warna = kekuatan suara)', needs: 'audio', heavy: true, run: async (c, m) => {
    const p = await kit.probe(m.buffer)
    const png = await ffm.run(m.buffer, 'png', (i, o) => ['-i', i, '-lavfi', 'showspectrumpic=s=1120x420:legend=0:color=intensity:scale=log', '-frames:v', '1', o], 150000)
    const out = await card('SPEKTROGRAM', `${p?.duration ? kit.fmtTime(p.duration) : ''} • kiri→kanan = waktu, bawah→atas = frekuensi`, png)
    return { image: out, caption: '🌈 Spektrogram audio' }
  } },
  audiogram: { desc: 'Ubah audio/VN jadi video bergelombang animasi (siap jadi Status), maks 90 detik', usage: '[judul]', example: 'Podcast Eps 1', needs: 'audio', heavy: true, run: async (c, m) => {
    const p = await kit.probe(m.buffer)
    const dur = Math.min(90, p?.duration || 30)
    const title = kit.rest(c.body).trim().slice(0, 40) || 'Audio'
    const W = 720
    const t = await io.textFit(title, 620, 140, { maxSize: 64, color: '#ffffff' })
    const tm = await io.meta(t)
    const sub = await io.textFit(kit.fmtTime(dur), 400, 50, { maxSize: 36, color: '#9fb0d8', bold: false })
    const sm = await io.meta(sub)
    const bg = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b0b3a"/><stop offset="1" stop-color="#4338ca"/></linearGradient></defs><rect width="${W}" height="${W}" fill="url(#g)"/><circle cx="620" cy="90" r="190" fill="#fff" fill-opacity="0.06"/><circle cx="90" cy="650" r="230" fill="#fff" fill-opacity="0.05"/></svg>`)).composite([{ input: t, left: Math.round((W - tm.w) / 2), top: 90 + Math.round((140 - tm.h) / 2) }, { input: sub, left: Math.round((W - sm.w) / 2), top: 580 }]).png().toBuffer()
    const out = await ffm.runMulti([m.buffer, bg], 'mp4', (ins, o) => [
      '-i', ins[0], '-loop', '1', '-framerate', '25', '-f', 'image2', '-i', ins[1],
      '-filter_complex', `[0:a]aformat=channel_layouts=mono,showwaves=s=640x220:mode=cline:rate=25:colors=#4fd8ff:scale=sqrt,format=yuva420p[w];[1:v][w]overlay=40:330:shortest=0,format=yuv420p[v]`,
      '-map', '[v]', '-map', '0:a', '-t', String(dur), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', o
    ], 300000)
    return { video: out, caption: `🎙️ Audiogram ${kit.fmtTime(dur)}${(p?.duration || 0) > 90 ? ' (dipotong 90 detik)' : ''}` }
  } },
  hapussenyap: { desc: 'Buang bagian hening di awal/tengah/akhir audio (cocok untuk VN panjang)', needs: 'audio', heavy: true, run: async (c, m) => {
    const before = await kit.probe(m.buffer)
    const r = await clean(m, 'silenceremove=start_periods=1:start_duration=0.1:start_threshold=-45dB:stop_periods=-1:stop_duration=0.7:stop_threshold=-45dB')
    const after = await kit.probe(r.audio)
    if (!after?.duration) throw fail('Seluruh audio terdeteksi hening.')
    return { ...r, caption: `🔇 ${kit.fmtTime(before?.duration || 0)} → ${kit.fmtTime(after.duration)}` }
  } },
  denoiseaudio: { desc: 'Redam noise latar (desis, dengung, kipas) pada audio/VN', needs: 'audio', heavy: true, run: async (c, m) => clean(m, 'highpass=f=70,afftdn=nr=18:nf=-45:tn=1,loudnorm=I=-18:TP=-1.5:LRA=11') }
}

module.exports = kit.multi({ name: 'audioviz', category: 'audio', emoji: '📈', desc: 'Waveform, spektrogram, audiogram, hapus hening, redam noise', specs })
