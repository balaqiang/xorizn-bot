import fs from 'node:fs'
import { toSticker, fromSticker, addExif } from '../../../features/sticker.js'
import { tmpFile } from '../../../features/media.js'

function mediaSource(m) {
  const ok = (x) => x && (['imageMessage', 'videoMessage', 'stickerMessage'].includes(x.type) || (x.type === 'documentMessage' && /^(image|video)\//.test(x.mimetype)))
  if (ok(m)) return m
  if (ok(m.quoted)) return m.quoted
  return null
}

// ---------- brat: teks → stiker (render berat, dikerjakan satu per satu) ----------
const THEMES = { black: 'black', hitam: 'black', white: 'white', putih: 'white', green: 'green', hijau: 'green' }
const MAX_CHARS = 120
let waiting = 0
let tail = Promise.resolve()

async function enqueue(job) {
  if (waiting >= 4) throw Object.assign(new Error('antrian'), { userMessage: 'Antrian pembuatan stiker teks penuh. Coba lagi sebentar lagi.' })
  waiting++
  const run = tail.then(job)
  tail = run.catch(() => {})
  try {
    return await run
  } finally {
    waiting--
  }
}

/** [tema] [blur0-3] <teks> — atau reply pesan teks. */
function bratOptions(args, m) {
  const words = [...args]
  let theme
  let blur
  while (words.length) {
    const w = words[0].toLowerCase()
    if (THEMES[w]) theme = THEMES[w]
    else if (/^blur[0-3]$/.test(w)) blur = Number(w.slice(4))
    else break
    words.shift()
  }
  const text = (words.join(' ') || m.quoted?.text || '').replace(/\s+/g, ' ').trim()
  return { theme, blur, text }
}

async function bratRun(m, { sock, args, prefix, command }, animated) {
  const opt = bratOptions(args, m)
  if (!opt.text) return m.reply(`Contoh: *${prefix}${command} halo semua* \nTema: hitam / putih / hijau, misal *${prefix}${command} hitam halo*`)
  if (opt.text.length > MAX_CHARS) return m.reply(`Teks terlalu panjang (maks ${MAX_CHARS} karakter).`)
  await m.react('⏳')
  try {
    const sticker = await enqueue(async () => {
      const { makeBratImage, makeBrat } = await import('../../../features/brat-render.js')
      if (!animated) return toSticker(await makeBratImage(opt), { mimetype: 'image/png' })
      const out = tmpFile('mp4')
      try {
        await makeBrat({ ...opt, out, format: 'mp4', hold: 1.2 })
        return toSticker(fs.readFileSync(out), { mimetype: 'video/mp4' })
      } finally {
        fs.rmSync(out, { force: true })
      }
    })
    await sock.sendMessage(m.chat, { sticker }, { quoted: m.raw })
    return m.react('✅')
  } catch (err) {
    if (err.userMessage) return m.reply(err.userMessage)
    throw err
  }
}

export default [
  {
    command: ['sticker', 's', 'stiker', 'sk'],
    category: 'sticker',
    description: 'Ubah gambar/video/gif jadi stiker. Opsi: pack|author, tambah "crop" untuk potong kotak',
    usage: '[pack|author]',
    cooldown: 3,
    async run(m, { sock, text, prefix }) {
      const src = mediaSource(m)
      if (!src || src.type === 'stickerMessage') return m.reply(`Kirim atau reply gambar / video (maks 10 detik) dengan caption *${prefix}s*`)
      if (/video/.test(src.mimetype) && Number(src.msg?.seconds || 0) > 10) return m.reply('Video maksimal 10 detik.')
      await m.react('⏳')
      const crop = /\bcrop\b/i.test(text)
      const [packname, author] = text.replace(/\bcrop\b/i, '').split('|').map((s) => s.trim())
      const buf = await src.download()
      const sticker = await toSticker(buf, { mimetype: src.mimetype, crop, packname: packname || undefined, author: author || undefined })
      await sock.sendMessage(m.chat, { sticker }, { quoted: m.raw })
      return m.react('✅')
    }
  },
  {
    command: ['brat', 'ttp', 'textsticker'],
    category: 'sticker',
    description: 'Ubah teks jadi stiker gaya brat (tema: hitam/putih/hijau)',
    usage: '[tema] <teks>',
    cooldown: 5,
    run: (m, ctx) => bratRun(m, ctx, false)
  },
  {
    command: ['bratvid', 'bratgif', 'attp', 'bratanimasi'],
    category: 'sticker',
    description: 'Stiker teks brat beranimasi (kata muncul satu per satu)',
    usage: '[tema] <teks>',
    cooldown: 10,
    run: (m, ctx) => bratRun(m, ctx, true)
  },
  {
    command: ['toimg', 'toimage', 'tovideo', 'tomp4'],
    category: 'sticker',
    description: 'Ubah stiker jadi gambar (atau video untuk stiker animasi)',
    async run(m, { sock }) {
      const src = mediaSource(m)
      if (!src || src.type !== 'stickerMessage') return m.reply('Reply stiker yang ingin diubah.')
      await m.react('⏳')
      const out = await fromSticker(await src.download())
      await sock.sendMessage(m.chat, out.type === 'video' ? { video: out.buffer, gifPlayback: true } : { image: out.buffer }, { quoted: m.raw })
      return m.react('✅')
    }
  },
  {
    command: ['take', 'wm', 'swm', 'colong'],
    category: 'sticker',
    description: 'Ganti nama pack & author stiker',
    usage: 'pack|author',
    async run(m, { sock, text, settings }) {
      if (m.quoted?.type !== 'stickerMessage') return m.reply('Reply stikernya.')
      const [packname, author] = (text || `${settings.packname}|${settings.author}`).split('|').map((s) => s.trim())
      const sticker = await addExif(await m.quoted.download(), packname, author || '')
      return sock.sendMessage(m.chat, { sticker }, { quoted: m.raw })
    }
  }
]
