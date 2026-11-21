// Efek & editor audio (reply VN / lagu / video). Memakai ffmpeg; hasil kembali jadi VN bila sumbernya VN.
const kit = require('../../lib/kit')

const MAX_SEC = 600

// Jalankan filter ffmpeg. VN (ptt) -> keluaran opus, selain itu mp3.
async function render(media, filter, { extra = [], dur } = {}) {
  const ptt = !!media.info?.ptt
  const ext = ptt ? 'ogg' : 'mp3'
  const codec = ptt ? ['-c:a', 'libopus', '-b:a', '64k', '-application', 'voip', '-ar', '48000'] : ['-c:a', 'libmp3lame', '-b:a', '160k']
  const buf = await kit.ffm.run(media.buffer, ext, (i, o) => ['-t', String(dur || MAX_SEC), '-i', i, '-vn', '-map_metadata', '-1', ...extra, ...(filter ? ['-af', filter] : []), ...codec, o], 240000)
  return { audio: buf, ptt }
}
const PITCH = (r) => `aresample=44100,asetrate=44100*${r},aresample=44100`
const LIM = 'alimiter=limit=0.95'

function fx(desc, filter, extraDesc) {
  return { desc, usage: extraDesc?.usage, needs: 'audio', heavy: true, run: async (c, m) => render(m, typeof filter === 'function' ? filter(c) : filter) }
}

const specs = {
  bass: fx('Bass boost: dentuman bass lebih kuat', () => `aresample=44100,equalizer=f=60:t=h:w=80:g=14,equalizer=f=140:t=h:w=100:g=8,acompressor=threshold=0.25:ratio=3,${LIM}`),
  nightcore: fx('Nightcore: lebih cepat dan nada lebih tinggi', PITCH(1.25)),
  slowed: fx('Slowed + reverb: lambat, dalam, dan menggema', `${PITCH(0.85)},aecho=0.8:0.85:60|120|240:0.4|0.3|0.2`),
  reverb: fx('Reverb: gema ruangan besar', 'aecho=0.8:0.88:60|120|240|480:0.4|0.32|0.24|0.16'),
  echo: fx('Echo: suara menggema berulang', 'aecho=0.8:0.9:500|1000:0.35|0.25'),
  '8d': fx('Efek 8D: suara berputar di kepala (pakai headset)', 'aformat=channel_layouts=stereo,apulsator=hz=0.12:mode=sine'),
  robot: fx('Suara robot', "afftfilt=real='hypot(re,im)*cos(0)':imag='hypot(re,im)*sin(0)':win_size=512:overlap=0.75"),
  chipmunk: fx('Suara tupai: tinggi dan cepat', PITCH(1.5)),
  deepvoice: fx('Suara berat dan dalam', PITCH(0.75)),
  vibrato: fx('Vibrato: suara bergetar', 'vibrato=f=6:d=0.6'),
  tremolo: fx('Tremolo: volume berdenyut', 'tremolo=f=7:d=0.8'),
  telepon: fx('Suara seperti lewat telepon', `highpass=f=400,lowpass=f=3400,acompressor=ratio=4,${LIM}`),
  bawahair: fx('Suara seperti di dalam air', 'lowpass=f=700,aecho=0.8:0.8:40:0.5,vibrato=f=4:d=0.25'),
  normalize: fx('Rata-ratakan volume (loudness normalization)', 'loudnorm=I=-16:TP=-1.5:LRA=11'),
  areverse: { desc: 'Putar balik audio (maks 60 detik)', needs: 'audio', heavy: true, run: async (c, m) => render(m, 'areverse', { dur: 60 }) },
  karaoke: { desc: 'Hapus vokal (versi karaoke, butuh audio stereo)', needs: 'audio', heavy: true, run: async (c, m) => {
    const p = await kit.probe(m.buffer)
    if (p?.audio && p.audio.channels < 2) throw Object.assign(new Error('mono'), { userMessage: 'Audio ini mono, vokal tidak bisa dipisahkan. Coba lagu stereo.' })
    return render(m, 'aformat=channel_layouts=stereo,pan=stereo|c0=c0-c1|c1=c1-c0,volume=1.6,' + LIM)
  } },
  pitch: { desc: 'Ubah nada tanpa mengubah tempo (semitone -12 s/d 12)', usage: '<semitone>', example: '+3', needs: 'audio', heavy: true, run: async (c, m) => {
    const n = kit.numArg(c.args[0], 3, -12, 12)
    const r = 2 ** (n / 12)
    return render(m, `aresample=44100,asetrate=44100*${r.toFixed(5)},aresample=44100,atempo=${(1 / r).toFixed(5)}`)
  } },
  tempo: { desc: 'Ubah kecepatan tanpa mengubah nada (0.5x - 3x)', usage: '<0.5-3>', example: '1.5', needs: 'audio', heavy: true, run: async (c, m) => {
    const t = kit.numArg(c.args[0], 1.25, 0.5, 3)
    return render(m, t > 2 ? `atempo=2,atempo=${(t / 2).toFixed(4)}` : `atempo=${t}`)
  } },
  vol: { desc: 'Atur volume (0.1x - 10x)', usage: '<0.1-10>', example: '2', needs: 'audio', heavy: true, run: async (c, m) => render(m, `volume=${kit.numArg(c.args[0], 2, 0.1, 10)},${LIM}`) },
  fadeaudio: { desc: 'Tambah fade in & fade out (detik, bawaan 3)', usage: '[detik]', needs: 'audio', heavy: true, run: async (c, m) => {
    const p = await kit.probe(m.buffer)
    const d = kit.numArg(c.args[0], 3, 0.5, 15)
    const total = Math.min(p?.duration || 0, MAX_SEC)
    return render(m, `afade=t=in:d=${d}${total > d * 2 ? `,afade=t=out:st=${(total - d).toFixed(2)}:d=${d}` : ''}`)
  } },
  trimaudio: { desc: 'Potong audio dari waktu mulai sampai selesai', usage: '<mulai> [selesai]', example: '0:30 1:15', needs: 'audio', heavy: true, run: async (c, m) => {
    const a = kit.parseTime(c.args[0])
    const b = c.args[1] ? kit.parseTime(c.args[1]) : null
    if (a === null || (c.args[1] && b === null) || (b !== null && b <= a)) throw Object.assign(new Error('waktu'), { userMessage: 'Format waktu: 30, 0:30, atau 1:02:03. Waktu selesai harus setelah waktu mulai.' })
    const ptt = !!m.info?.ptt
    const buf = await kit.ffm.run(m.buffer, ptt ? 'ogg' : 'mp3', (i, o) => ['-ss', String(a), ...(b !== null ? ['-to', String(b)] : []), '-i', i, '-vn', '-map_metadata', '-1', ...(ptt ? ['-c:a', 'libopus', '-b:a', '64k', '-ar', '48000'] : ['-c:a', 'libmp3lame', '-b:a', '160k']), o], 240000)
    return { audio: buf, ptt }
  } },
  tovn: { desc: 'Ubah audio / lagu / video jadi voice note', needs: 'audio', heavy: true, run: async (c, m) => {
    const buf = await kit.ffm.run(m.buffer, 'ogg', (i, o) => ['-t', '600', '-i', i, '-vn', '-map_metadata', '-1', '-c:a', 'libopus', '-b:a', '48k', '-ac', '1', '-ar', '48000', '-application', 'voip', o], 240000)
    return { audio: buf, ptt: true }
  } },
  audioinfo: { desc: 'Info audio: durasi, codec, bitrate, sample rate', needs: 'audio', run: async (c, m) => {
    const p = await kit.probe(m.buffer)
    if (!p || !p.audio) throw Object.assign(new Error('x'), { userMessage: 'Tidak ada trek audio pada file ini.' })
    const { panel } = require('../../lib/uitext')
    return panel('INFO AUDIO', [{ head: '🎧 *DETAIL*', lines: [
      `Durasi : ${kit.fmtTime(p.duration)}`, `Ukuran : ${kit.fmtSize(p.size)}`, `Format : ${p.format}`, `Codec : ${p.audio.codec}`,
      `Sample rate : ${p.audio.rate} Hz`, `Kanal : ${p.audio.channels === 1 ? 'mono' : p.audio.channels === 2 ? 'stereo' : p.audio.channels}`, p.audio.bitrate || p.bitrate ? `Bitrate : ${Math.round((p.audio.bitrate || p.bitrate) / 1000)} kbps` : ''
    ].filter(Boolean) }])
  } }
}

module.exports = kit.multi({ name: 'audiofx', category: 'audio', emoji: '🎧', desc: 'Efek & editor audio', specs })
