const yt = require('../../lib/youtube')
const card = require('../../lib/playercard')
const { sendRich, btn } = require('../../lib/interactive')
const { readiness } = require('../../lib/mediadl')

// Cache hasil pencarian supaya tombol Berikutnya/Sebelumnya cepat dan konsisten (15 menit)
const cache = new Map()
const TTL = 15 * 60 * 1000
const keyOf = (q) => q.toLowerCase().replace(/\s+/g, ' ').trim()

async function results(query) {
  const k = keyOf(query)
  const hit = cache.get(k)
  if (hit && Date.now() - hit.at < TTL) return hit.list
  const list = await yt.search(query, 8)
  cache.set(k, { list, at: Date.now() })
  if (cache.size > 100) cache.delete(cache.keys().next().value)
  return list
}

module.exports = {
  name: 'play2',
  command: ['play2', 'player', 'carimusik'],
  category: 'downloader',
  desc: 'Pemutar musik: kartu "Sedang Diputar" + tombol Putar, Video, Berikutnya, Sebelumnya',
  usage: '<judul lagu>',
  run: async ({ react, sock, msg, from, args, prefix, config, reply }) => {
    // "#3 judul" = tampilkan hasil ke-3 (dipakai tombol navigasi)
    let index = 0
    if (/^#\d{1,2}$/.test(args[0] || '')) index = Number(args.shift().slice(1)) - 1
    const query = args.join(' ').trim()
    if (!query) return reply(`Masukkan judul lagu.\nContoh: ${prefix}play2 teh hijau`)

    react('⏳')

    let list
    try {
      list = await results(query)
    } catch (err) {
      return reply(err.message)
    }
    index = ((index % list.length) + list.length) % list.length
    const item = list[index]
    const next = (index + 1) % list.length
    const prev = (index - 1 + list.length) % list.length

    // kartu pemutar; kalau gagal digambar, pakai thumbnail biasa agar fitur tetap jalan
    const art = await yt.thumbBuffer(item.id, 1280, 720)
    let image = art
    try {
      image = await card.render({ artBuffer: art, title: item.title, artist: item.channel, duration: item.duration })
    } catch (err) {
      console.log('[PLAY2] kartu gagal digambar, pakai thumbnail:', err.message)
    }

    const body = [
      `🎵 *${yt.cut(item.title, 90)}*`,
      `${yt.cut(item.channel, 40)} • ${item.duration}${item.views ? ` • ${item.views}` : ''}`,
      '',
      `Hasil ${index + 1} dari ${list.length}. Tekan *▶️ Putar* untuk mendengarkan.`,
      readiness() && `\n${readiness()}`
    ]
      .filter((l) => typeof l === 'string')
      .join('\n')

    const q = keyOf(query)
    const buttons = [
      btn.reply('▶️ Putar (Audio)', `${prefix}ytmp3 ${item.url}`),
      btn.reply('🎬 Video', `${prefix}ytmp4 ${item.url}`),
      btn.reply('⏭️ Berikutnya', `${prefix}play2 #${next + 1} ${q}`),
      btn.reply('⏮️ Sebelumnya', `${prefix}play2 #${prev + 1} ${q}`),
      btn.list('🔎 Pilih lagu lain', [
        {
          title: 'HASIL PENCARIAN',
          rows: list.map((r, i) => ({
            header: r.duration,
            title: yt.cut(r.title, 24),
            description: yt.cut(r.channel, 72),
            id: `${prefix}play2 #${i + 1} ${q}`
          }))
        }
      ])
    ]
    const fallback = `${body}\n\nPutar : ${prefix}ytmp3 ${item.url}\nVideo : ${prefix}ytmp4 ${item.url}\nLagu lain : ${prefix}play2 #${next + 1} ${q}`

    if (config.richMode !== false) {
      try {
        return await sendRich(sock, from, { media: image ? { image } : undefined, body, footer: config.footer, buttons, quoted: msg })
      } catch (err) {
        console.log('[PLAY2] pesan interaktif gagal, pakai gambar + teks:', err.message)
      }
    }
    if (image) return sock.sendMessage(from, { image, caption: fallback }, { quoted: msg })
    await sock.sendMessage(from, { text: fallback }, { quoted: msg })
  }
}
