import fs from 'node:fs'
import { fetchMedia, ytSearch, firstUrl, platformOf } from '../../../features/downloader.js'
import * as ytdlp from '../../../features/ytdlp.js'

const DOC_OVER = 60 * 1048576 // di atas ini dikirim sebagai dokumen

/** Kirim hasil fetchMedia ke chat. Mengembalikan jumlah media terkirim. */
async function deliver(m, sock, res, caption = '') {
  let sent = 0
  try {
    for (const [i, it] of res.items.entries()) {
      const cap = i === 0 ? caption : ''
      const src = it.file ? fs.readFileSync(it.file) : { url: it.url }
      const size = it.file ? src.length : 0
      const name = `${(res.title || 'download').replace(/[\\/:*?"<>|]+/g, '').slice(0, 60) || 'download'}`
      let msg
      if (it.kind === 'image') msg = { image: src, caption: cap }
      else if (it.kind === 'audio') msg = size > DOC_OVER ? { document: src, mimetype: 'audio/mpeg', fileName: `${name}.mp3`, caption: cap } : { audio: src, mimetype: 'audio/mpeg' }
      else msg = size > DOC_OVER ? { document: src, mimetype: 'video/mp4', fileName: `${name}.mp4`, caption: cap } : { video: src, mimetype: 'video/mp4', caption: cap }
      await sock.sendMessage(m.chat, msg, { quoted: m.raw })
      sent++
    }
  } finally {
    res.cleanup?.()
  }
  return sent
}

/** Alur umum: ambil URL → unduh → kirim → potong limit. */
async function grab(m, ctx, { audio = false, need } = {}) {
  const { sock, text, prefix, command } = ctx
  const url = firstUrl(text) || firstUrl(m.quoted?.text)
  if (!url) return m.reply(`Kirim link-nya. Contoh: *${prefix}${command} https://...*`)
  if (need && platformOf(url) !== need) return m.reply(`Link bukan dari ${need}. Pakai *${prefix}dl <link>* untuk situs lain.`)
  await m.react('⏳')
  try {
    const res = await fetchMedia(url, { audio })
    const caption = [res.title && `📌 ${res.title}`, res.author && `👤 ${res.author}`].filter(Boolean).join('\n')
    const n = await deliver(m, sock, res, caption)
    if (n) ctx.spendLimit()
    return m.react('✅')
  } catch (err) {
    await m.react('❌')
    return m.reply(`❌ ${err.message}`)
  }
}

const dl = (command, description, opts = {}) => ({
  command: [].concat(command),
  category: 'downloader',
  description,
  usage: '<link>',
  limit: 1,
  cooldown: 10,
  run: (m, ctx) => grab(m, ctx, opts)
})

export default [
  {
    command: ['play', 'song', 'lagu'],
    category: 'downloader',
    description: 'Cari lagu di YouTube lalu kirim audionya',
    usage: '<judul / link>',
    limit: 1,
    cooldown: 10,
    async run(m, ctx) {
      const { sock, text, prefix, command } = ctx
      if (!text) return m.reply(`Contoh: *${prefix}${command} sial mahalini*`)
      await m.react('🔎')
      let url = firstUrl(text)
      let info = null
      if (!url) {
        const found = await ytSearch(text, 1)
        if (!found.length) return m.reply('Lagu tidak ditemukan.')
        info = found[0]
        url = info.url
      }
      if (info) {
        await sock.sendMessage(
          m.chat,
          { image: { url: info.thumbnail }, caption: `🎵 *${info.title}*\n👤 ${info.author}\n⏱️ ${info.duration} • 👁️ ${Number(info.views || 0).toLocaleString('id-ID')}\n🔗 ${info.url}\n\n_Mengunduh audio..._` },
          { quoted: m.raw }
        ).catch(() => {})
      }
      await m.react('⏳')
      try {
        const res = await fetchMedia(url, { audio: true })
        if (await deliver(m, sock, res)) ctx.spendLimit()
        return m.react('✅')
      } catch (err) {
        await m.react('❌')
        return m.reply(`❌ ${err.message}`)
      }
    }
  },
  {
    command: ['yts', 'ytsearch', 'carivideo'],
    category: 'downloader',
    description: 'Cari video YouTube',
    usage: '<kata kunci>',
    cooldown: 5,
    async run(m, { text, prefix, command }) {
      if (!text) return m.reply(`Contoh: *${prefix}${command} tutorial masak nasi goreng*`)
      const list = await ytSearch(text, 8)
      if (!list.length) return m.reply('Tidak ada hasil.')
      const body = list.map((v, i) => `*${i + 1}. ${v.title}*\n   👤 ${v.author} • ⏱️ ${v.duration}\n   🔗 ${v.url}`).join('\n\n')
      return m.reply(`🔎 *Hasil YouTube: ${text}*\n\n${body}\n\n_Unduh: ${prefix}ytmp3 <link> / ${prefix}ytmp4 <link>_`)
    }
  },
  dl(['ytmp3', 'yta', 'ytaudio'], 'Unduh audio YouTube (MP3)', { audio: true, need: 'youtube' }),
  dl(['ytmp4', 'ytv', 'ytvideo'], 'Unduh video YouTube (maks 720p)', { need: 'youtube' }),
  dl(['tiktok', 'tt', 'ttdl', 'tiktokdl'], 'Unduh video / foto TikTok tanpa watermark', { need: 'tiktok' }),
  dl(['tiktokmp3', 'ttmp3', 'ttaudio'], 'Unduh audio / musik TikTok', { audio: true, need: 'tiktok' }),
  dl(['instagram', 'ig', 'igdl', 'reels'], 'Unduh foto / video / reels Instagram', { need: 'instagram' }),
  dl(['facebook', 'fb', 'fbdl'], 'Unduh video Facebook', { need: 'facebook' }),
  dl(['twitter', 'x', 'xdl', 'twdl'], 'Unduh video / foto X (Twitter)', { need: 'twitter' }),
  dl(['download', 'dl', 'aio'], 'Unduh dari link apa pun (YouTube, TikTok, IG, FB, X, dan lainnya)'),
  {
    command: ['ytdlp'],
    category: 'owner',
    owner: true,
    description: 'Status / pasang / perbarui yt-dlp (mesin downloader)',
    usage: '[install|update]',
    async run(m, { args }) {
      const sub = (args[0] || '').toLowerCase()
      if (sub === 'install' || sub === 'update') {
        await m.react('⏳')
        try {
          const f = sub === 'update' ? await ytdlp.update() : await ytdlp.ensure()
          return m.reply(`✅ yt-dlp siap (versi ${f.version}).`)
        } catch (err) {
          return m.reply(`❌ ${err.message}`)
        }
      }
      const s = ytdlp.status()
      return m.reply(
        [
          '╭─❖ 📥 *YT-DLP*',
          `│ Terpasang : ${s.installed ? `ya (${s.version})` : 'belum'}`,
          `│ Pasang otomatis : ${s.canInstall ? 'bisa' : 'tidak'}`,
          `│ Cookies : ${s.cookies ? 'ada' : 'tidak ada'} (src/bin/cookies.txt)`,
          `│ Proxy : ${s.proxy ? 'ada' : 'tidak'} (src/bin/proxy.txt)`,
          `│ Batas : ${s.maxMB} MB • ${s.maxMinutes} menit`,
          '╰──────────────',
          s.installed ? '' : '\nKetik *.ytdlp install* untuk memasang.'
        ].join('\n')
      )
    }
  }
]

