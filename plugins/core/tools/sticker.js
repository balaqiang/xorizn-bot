import { toSticker, fromSticker, addExif } from '../../../src/features/sticker.js'

function mediaSource(m) {
  if (['imageMessage', 'videoMessage', 'stickerMessage'].includes(m.type)) return m
  if (m.quoted && ['imageMessage', 'videoMessage', 'stickerMessage', 'documentMessage'].includes(m.quoted.type)) return m.quoted
  return null
}

export default [
  {
    command: ['sticker', 's', 'stiker', 'sk'],
    category: 'sticker',
    description: 'Ubah gambar/video/gif jadi stiker. Opsi teks: pack|author, tambah "crop" untuk potong kotak',
    usage: '[pack|author]',
    cooldown: 3,
    async run(m, { sock, text }) {
      const src = mediaSource(m)
      if (!src || src.type === 'stickerMessage') return m.reply('Kirim atau reply gambar / video (maks 8 detik) dengan caption *.s*')
      if (src.type === 'videoMessage' && Number(src.msg?.seconds || 0) > 10) return m.reply('Video maksimal 10 detik.')
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
