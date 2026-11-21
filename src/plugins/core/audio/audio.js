/**
 * Menu audio: konversi (video → MP3 / VN) dan efek suara.
 * Reply voice note, lagu, atau video. Hasil kembali jadi VN bila sumbernya VN.
 */
import { mediaFrom, toMp3, toVoiceNote, audioFilter, probe, fmtTime, fmtSize, parseTime } from '../../../features/media.js'

const MAX_SEC = 600
const PITCH = (r) => `aresample=44100,asetrate=44100*${r},aresample=44100`
const LIM = 'alimiter=limit=0.95'
const num = (v, def, min, max) => {
  const n = Number(String(v ?? '').replace(',', '.').replace(/^\+/, ''))
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def
}

/** Ambil audio dari pesan / reply (VN, lagu, video, atau dokumen audio/video). */
async function source(m, p, cmd) {
  const media = mediaFrom(m, ['audio', 'video'])
  if (!media) {
    await m.reply(`Reply voice note, lagu, atau video dengan *${p}${cmd}*`)
    return null
  }
  if (media.seconds > MAX_SEC) {
    await m.reply(`Durasi maksimal ${MAX_SEC / 60} menit.`)
    return null
  }
  await m.react('⏳')
  return { ...media, buffer: await media.src.download() }
}

async function send(m, sock, audio, ptt) {
  await sock.sendMessage(m.chat, { audio, mimetype: ptt ? 'audio/ogg; codecs=opus' : 'audio/mpeg', ptt }, { quoted: m.raw })
  await m.react('✅')
}

/** Efek sederhana: satu filter ffmpeg. */
const fx = (command, description, filter) => ({
  command: [].concat(command),
  category: 'audio',
  description,
  cooldown: 5,
  async run(m, { sock, prefix, command: cmd }) {
    const s = await source(m, prefix, cmd)
    if (!s) return
    const out = await audioFilter(s.buffer, s.mimetype, filter, { ptt: s.ptt })
    return send(m, sock, out, s.ptt)
  }
})

/** Efek dengan argumen angka. */
const fxArg = (command, description, usage, build) => ({
  command: [].concat(command),
  category: 'audio',
  description,
  usage,
  cooldown: 5,
  async run(m, { sock, prefix, command: cmd, args }) {
    const s = await source(m, prefix, cmd)
    if (!s) return
    const out = await audioFilter(s.buffer, s.mimetype, build(args), { ptt: s.ptt })
    return send(m, sock, out, s.ptt)
  }
})

export default [
  {
    command: ['tomp3', 'toaudio', 'mp3'],
    category: 'audio',
    description: 'Ubah video / voice note jadi audio MP3',
    cooldown: 5,
    async run(m, { sock, prefix, command }) {
      const s = await source(m, prefix, command)
      if (!s) return
      const audio = await toMp3(s.buffer, s.mimetype, MAX_SEC)
      return send(m, sock, audio, false)
    }
  },
  {
    command: ['tovn', 'toptt', 'vn'],
    category: 'audio',
    description: 'Ubah audio / lagu / video jadi voice note',
    cooldown: 5,
    async run(m, { sock, prefix, command }) {
      const s = await source(m, prefix, command)
      if (!s) return
      const audio = await toVoiceNote(s.buffer, s.mimetype, MAX_SEC)
      return send(m, sock, audio, true)
    }
  },
  fx('bass', 'Bass boost: dentuman bass lebih kuat', `aresample=44100,equalizer=f=60:t=h:w=80:g=14,equalizer=f=140:t=h:w=100:g=8,acompressor=threshold=0.25:ratio=3,${LIM}`),
  fx('nightcore', 'Nightcore: lebih cepat dan nada lebih tinggi', PITCH(1.25)),
  fx(['slowed', 'slow'], 'Slowed + reverb: lambat dan menggema', `${PITCH(0.85)},aecho=0.8:0.85:60|120|240:0.4|0.3|0.2`),
  fx('reverb', 'Reverb: gema ruangan besar', 'aecho=0.8:0.88:60|120|240|480:0.4|0.32|0.24|0.16'),
  fx('echo', 'Echo: suara menggema berulang', 'aecho=0.8:0.9:500|1000:0.35|0.25'),
  fx(['8d', 'audio8d'], 'Efek 8D: suara berputar (pakai headset)', 'aformat=channel_layouts=stereo,apulsator=hz=0.12:mode=sine'),
  fx('robot', 'Suara robot', "afftfilt=real='hypot(re,im)*cos(0)':imag='hypot(re,im)*sin(0)':win_size=512:overlap=0.75"),
  fx(['tupai', 'chipmunk'], 'Suara tupai: tinggi dan cepat', PITCH(1.5)),
  fx(['deep', 'deepvoice'], 'Suara berat dan dalam', PITCH(0.75)),
  fx(['fast', 'cepat'], 'Percepat audio 1.5x tanpa mengubah nada', 'atempo=1.5'),
  fx('vibrato', 'Vibrato: suara bergetar', 'vibrato=f=6:d=0.6'),
  fx('tremolo', 'Tremolo: volume berdenyut', 'tremolo=f=7:d=0.8'),
  fx(['telepon', 'phone'], 'Suara seperti lewat telepon', `highpass=f=400,lowpass=f=3400,acompressor=ratio=4,${LIM}`),
  fx(['bawahair', 'underwater'], 'Suara seperti di dalam air', 'lowpass=f=700,aecho=0.8:0.8:40:0.5,vibrato=f=4:d=0.25'),
  fx(['earrape', 'blown'], 'Suara pecah dan sangat keras', 'acrusher=level_in=4:level_out=6:bits=8:mode=log:aa=1,volume=4,alimiter=limit=0.98'),
  fx(['normalize', 'normal'], 'Rata-ratakan volume', 'loudnorm=I=-16:TP=-1.5:LRA=11'),
  {
    command: ['reverse', 'areverse'],
    category: 'audio',
    description: 'Putar balik audio (maks 60 detik)',
    cooldown: 5,
    async run(m, { sock, prefix, command }) {
      const s = await source(m, prefix, command)
      if (!s) return
      const out = await audioFilter(s.buffer, s.mimetype, 'areverse', { ptt: s.ptt, maxSec: 60 })
      return send(m, sock, out, s.ptt)
    }
  },
  {
    command: ['karaoke', 'novocal'],
    category: 'audio',
    description: 'Hapus vokal (butuh audio stereo)',
    cooldown: 5,
    async run(m, { sock, prefix, command }) {
      const s = await source(m, prefix, command)
      if (!s) return
      const info = await probe(s.buffer, s.mimetype)
      if (info.audio && info.audio.channels < 2) return m.reply('Audio ini mono, vokal tidak bisa dipisahkan. Coba lagu stereo.')
      const out = await audioFilter(s.buffer, s.mimetype, `aformat=channel_layouts=stereo,pan=stereo|c0=c0-c1|c1=c1-c0,volume=1.6,${LIM}`, { ptt: s.ptt })
      return send(m, sock, out, s.ptt)
    }
  },
  fxArg('pitch', 'Ubah nada tanpa mengubah tempo (-12 s/d 12 semitone)', '<semitone>', (args) => {
    const r = 2 ** (num(args[0], 3, -12, 12) / 12)
    return `aresample=44100,asetrate=44100*${r.toFixed(5)},aresample=44100,atempo=${(1 / r).toFixed(5)}`
  }),
  fxArg('tempo', 'Ubah kecepatan tanpa mengubah nada (0.5x - 3x)', '<0.5-3>', (args) => {
    const t = num(args[0], 1.25, 0.5, 3)
    return t > 2 ? `atempo=2,atempo=${(t / 2).toFixed(4)}` : `atempo=${t}`
  }),
  fxArg(['volume', 'vol'], 'Atur volume (0.1x - 10x)', '<0.1-10>', (args) => `volume=${num(args[0], 2, 0.1, 10)},${LIM}`),
  {
    command: ['potongaudio', 'trimaudio', 'cutaudio'],
    category: 'audio',
    description: 'Potong audio dari waktu mulai sampai selesai',
    usage: '<mulai> [selesai]',
    cooldown: 5,
    async run(m, { sock, prefix, command, args }) {
      const a = parseTime(args[0])
      const b = args[1] ? parseTime(args[1]) : null
      if (a === null || (args[1] && b === null) || (b !== null && b <= a)) return m.reply(`Format: *${prefix}${command} 0:30 1:15* (waktu selesai opsional)`)
      const s = await source(m, prefix, command)
      if (!s) return
      const out = await audioFilter(s.buffer, s.mimetype, null, { ptt: s.ptt, pre: ['-ss', String(a), ...(b !== null ? ['-to', String(b)] : [])] })
      return send(m, sock, out, s.ptt)
    }
  },
  {
    command: ['audioinfo', 'infoaudio'],
    category: 'audio',
    description: 'Info audio: durasi, codec, kanal, ukuran',
    async run(m, { prefix, command }) {
      const media = mediaFrom(m, ['audio', 'video'])
      if (!media) return m.reply(`Reply audio atau video dengan *${prefix}${command}*`)
      const buf = await media.src.download()
      const info = await probe(buf, media.mimetype)
      if (!info.audio) return m.reply('Tidak ada trek audio pada file ini.')
      return m.reply(
        [
          '╭─❖ 🎧 *INFO AUDIO*',
          `│ Durasi : ${fmtTime(info.duration)}`,
          `│ Ukuran : ${fmtSize(info.size)}`,
          `│ Codec : ${info.audio.codec}`,
          `│ Sample rate : ${info.audio.rate} Hz`,
          `│ Kanal : ${info.audio.channels === 1 ? 'mono' : info.audio.channels === 2 ? 'stereo' : info.audio.channels}`,
          `│ Video : ${info.hasVideo ? 'ada' : 'tidak'}`,
          '╰──────────────'
        ].join('\n')
      )
    }
  }
]
