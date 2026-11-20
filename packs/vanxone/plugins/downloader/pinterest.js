const axios = require('axios')
const cheerio = require('cheerio')
const { fetchAndSend } = require('../../lib/mediadl')
const zt = require('../../lib/engine/pulse-zt')

const LINK = /https?:\/\/(?:[\w-]+\.)?pinterest\.[a-z.]{2,6}\/pin\/\S+|https?:\/\/pin\.it\/\S+/i
const HD = (u) => String(u || '').replace(/\/(?:236x|474x|564x|736x)\//, '/originals/')

// mesin 1: baca metadata halaman pin
async function viaPage(url) {
  const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 12; SM-S908B) AppleWebKit/537.36 Chrome/96.0 Mobile Safari/537.36', 'Accept-Language': 'id-ID,id;q=0.9' }, timeout: 15000 })
  const $ = cheerio.load(data)
  const leaf = $('script[data-test-id="leaf-snippet"]').text()
  const vid = $('script[data-test-id="video-snippet"]').text()
  if (!leaf && !vid) throw new Error('metadata pin tidak ditemukan')
  const info = leaf ? JSON.parse(leaf) : {}
  const video = vid ? JSON.parse(vid)?.contentUrl : ''
  return video ? { kind: 'video', url: video } : { kind: 'image', url: HD(info.image) }
}

// mesin 2: pinterestdownloader.io
async function viaApi(url) {
  const { data } = await axios.get('https://pinterestdownloader.io/frontendService/DownloaderService', { params: { url }, headers: { 'User-Agent': zt.UA }, timeout: 25000 })
  const medias = data?.medias || data?.data || []
  const big = (a) => [...a].sort((x, y) => (y.size || 0) - (x.size || 0))[0]
  const vids = medias.filter((v) => v.extension === 'mp4' || v.type === 'video')
  if (vids.length) return { kind: 'video', url: big(vids).url, quality: big(vids).quality }
  const imgs = medias.filter((v) => v.type === 'image' || /jpe?g|png/.test(v.extension))
  const pick = big(imgs.length ? imgs : medias)
  if (!pick?.url) throw new Error('media tidak ditemukan')
  return { kind: 'image', url: HD(pick.url) }
}

module.exports = {
  name: 'pinterest',
  command: ['pinterest', 'pin'],
  category: 'downloader',
  desc: 'Download video/gambar Pinterest (kualitas HD)',
  usage: '<link>',
  run: async ({ sock, msg, from, args, prefix, reply }) => {
    const url = zt.match(zt.input(msg, args), LINK)
    if (!url) return reply(`Masukkan link Pinterest.\nContoh: ${prefix}pin https://pin.it/xxxx`)
    await reply('⏳ Mengunduh dari Pinterest...')
    try {
      for (const engine of [viaPage, viaApi]) {
        try {
          const r = await engine(url)
          const cap = zt.caption('PINTEREST DOWNLOADER', [['Tipe', r.kind === 'video' ? 'Video' : 'Gambar HD'], ['Kualitas', r.quality]])
          return await zt.sendUrl(sock, from, msg, r.url, { kind: r.kind, caption: cap })
        } catch (err) {
          console.log(`[PIN] ${engine.name} gagal:`, err.message)
        }
      }
      await fetchAndSend(sock, from, msg, url, { max: 1, caption: zt.caption('PINTEREST DOWNLOADER', [['Sumber', url], ['Mesin', 'cadangan']]) })
    } catch (err) {
      await reply(`❌ ${err.message}`)
    }
  }
}
