const ytultra = require('../../lib/ytultra')
const scriptmind = require('../../lib/scriptmind')
const cobaltpool = require('../../lib/cobaltpool')
const ytdlp = require('../../lib/ytdlp')
const { getUrl } = require('../../lib/downloader')
const scrapers = require('../../lib/scrapers')
const tiktokmobile = require('../../lib/tiktokmobile')

module.exports = {
  name: 'ytdebug',
  command: ['ytdebug', 'tesdownload'],
  category: 'owner',
  desc: 'Uji tiap mesin download untuk satu link YouTube / TikTok / Instagram (diagnosis)',
  usage: '<link youtube>',
  owner: true,
  run: async ({ args, prefix, reply }) => {
    const url = getUrl(args)
    if (!url) return reply(`Format: ${prefix}ytdebug https://youtu.be/xxxx`)
    await reply('🔬 Menguji semua mesin, tunggu sebentar...')
    const out = ['*DIAGNOSIS DOWNLOAD*', url, '']

    const list = scrapers.supports.tiktok(url)
      ? [['tiktok-mobile', async (u) => { const r = await tiktokmobile.scrape(u); return { items: r.isSlideshow ? r.images.map((x) => ({ kind: 'image', url: x })) : [{ kind: 'video', url: r.videoUrls[0] }] } }], ['snaptik', scrapers.snaptik]]
      : scrapers.supports.instagram(url)
        ? [['savefromins', scrapers.savefromins], ['instaloadr', scrapers.instaloadr]]
        : []
    for (const [label, fn] of list) {
      try {
        const r = await fn(url)
        out.push(`*${label}:* ✅ ${r.items.length} media • ${r.items.map((i) => `${i.kind}:${new URL(i.url).hostname}`).join(', ').slice(0, 200)}`)
      } catch (e) {
        out.push(`*${label}:* ❌ ${e.message}`)
      }
    }
    if (list.length && !/youtu/.test(url)) {
      try {
        const r = await ytdlp.probe(url)
        out.push(`*yt-dlp:* ${r.ok ? '✅' : '❌'} ${r.lines[0]}`)
      } catch (e) {
        out.push(`*yt-dlp:* ❌ ${e.message.slice(0, 120)}`)
      }
      return reply(out.join('\n'))
    }

    try {
      const r = await scriptmind.resolve(url)
      out.push(`*scriptmind:* ✅ ${r.hasSeparate ? 'audio+video' : '1 URL'} • ${new URL(r.audio).hostname}`)
    } catch (e) {
      out.push(`*scriptmind:* ❌ ${e.message}`)
    }

    try {
      const { medias } = await ytultra.fetchMedias(url)
      const a = ytultra.pick(medias, { audio: true })
      const v = ytultra.pick(medias, { audio: false })
      out.push(`*ytultra:* ✅ ${medias.length} media • audio: ${a ? 'ada' : 'TIDAK ada'} • video: ${v ? 'ada' : 'TIDAK ada'}`)
      out.push(`  contoh: ${JSON.stringify(Object.fromEntries(Object.entries(medias[0]).map(([k, x]) => [k, typeof x === 'string' ? x.slice(0, 40) : x]))).slice(0, 260)}`)
    } catch (e) {
      out.push(`*ytultra:* ❌ ${e.message}`)
    }

    try {
      const n = (await cobaltpool.pick('youtube')).length
      if (!n) out.push('*cobalt komunitas:* ❌ tidak ada instance YouTube yang tersedia')
      else {
        const r = await cobaltpool.resolve(url, { audio: true, tries: 2 })
        out.push(`*cobalt komunitas:* ✅ ${r.instance} (dari ${n} instance)`)
      }
    } catch (e) {
      out.push(`*cobalt komunitas:* ❌ ${e.message.slice(0, 160)}`)
    }

    try {
      const r = await ytdlp.probe(url)
      out.push(`*yt-dlp:* ${r.ok ? '✅' : '❌'}`, ...r.lines.map((l) => `  • ${l}`))
    } catch (e) {
      out.push(`*yt-dlp:* ❌ ${e.message.slice(0, 160)}`)
    }
    await reply(out.join('\n'))
  }
}
