// .stalkch — info saluran WhatsApp dari halaman publiknya (nama, pengikut, deskripsi, foto)
// Sumber ide: xDonzCode. Hanya link/kode whatsapp.com/channel — tidak membuka alamat lain.
const cheerio = require('cheerio')
const richui = require('../../lib/richui')
const { fetchPublic } = require('../../lib/safeurl')

const CODE = /^[A-Za-z0-9_-]{10,60}$/
function normalize(input) {
  const s = String(input || '').trim().replace(/^<|>$/g, '')
  const m = s.match(/whatsapp\.com\/channel\/([A-Za-z0-9_-]{10,60})/i)
  if (m) return m[1]
  return CODE.test(s) ? s : ''
}

function parse(html) {
  const $ = cheerio.load(html)
  const og = (p) => $(`meta[property="og:${p}"]`).attr('content') || ''
  let name = og('title') || $('title').text().trim()
  const raw = og('description') || $('meta[name="description"]').attr('content') || ''
  let type = ''
  let followers = ''
  let desc = ''
  const head = raw.match(/^(Channel|Community|Group)\s*[•·]\s*([\d.,]+\s?[KMB]?)\s*(followers?|pengikut)/i)
  if (head) {
    type = head[1]
    followers = head[2]
    desc = raw.slice(head[0].length).replace(/^[\s•·\-–—]+/, '')
  } else {
    const f = raw.match(/([\d.,]+\s?[KMB]?)\s*(followers?|pengikut)/i)
    if (f) followers = f[1]
    desc = raw.replace(/^(Channel|Community|Group)\s*[•·][^•·]*[•·]?\s*/i, '')
  }
  desc = desc.replace(/\s+/g, ' ').trim()
  if (/^whatsapp\b/i.test(name) && desc) name = $('h1').first().text().trim() || name
  const verified = /verified_badge|"is_verified":true|"verified":true/.test(html) || $('[aria-label*="erified" i]').length > 0
  return { name: name.trim(), desc, followers, type, verified, image: og('image') }
}

module.exports = {
  name: 'stalkch',
  command: ['stalkch', 'stalkchannel', 'chstalk'],
  category: 'channel',
  emoji: '📡',
  desc: 'Lihat info saluran WhatsApp dari link-nya',
  usage: '<link saluran>',
  run: async ({ sock, msg, from, args, text, prefix, reply }) => {
    const code = normalize(args[0])
    if (!code) return reply(`Format: ${prefix}stalkch <link saluran>\nContoh: ${prefix}stalkch https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R`)
    const url = `https://whatsapp.com/channel/${code}`
    let info
    try {
      const { buffer } = await fetchPublic(url, { maxBytes: 3 * 1024 * 1024, timeout: 20000 })
      info = parse(buffer.toString('utf8'))
    } catch (err) {
      console.log('[STALKCH]', err.message)
      return reply('❌ Gagal membaca halaman saluran. Pastikan link benar dan saluran masih ada.')
    }
    if (!info.name) return reply('❌ Saluran tidak ditemukan atau halamannya tidak memuat data.')

    let photo = null
    if (info.image) {
      try {
        const r = await fetchPublic(info.image, { maxBytes: 5 * 1024 * 1024, timeout: 20000 })
        if (/^image\//i.test(r.contentType)) photo = r.buffer
      } catch {}
    }

    const rows = [
      ['Nama', info.name],
      ['Pengikut', info.followers || '-'],
      ['Tipe', info.type || 'Channel'],
      ['Status', info.verified ? '✅ Terverifikasi' : 'Belum terverifikasi'],
      ['Link', url]
    ]
    const caption = [`📡 INFO SALURAN`, ...rows.map(([k, v]) => `${k}: ${v}`), info.desc ? `\nDeskripsi: ${info.desc.slice(0, 600)}` : ''].join('\n')
    const avatar = photo ? await richui.avatarUri(photo) : ''
    await richui.sendEntity(
      sock,
      from,
      {
        icon: '📡',
        eyebrow: 'Info Saluran',
        name: info.name,
        sub: [info.type || 'Channel', info.followers ? `${info.followers} pengikut` : ''].filter(Boolean).join(' • '),
        avatar,
        chips: info.verified ? ['✅ Terverifikasi'] : [],
        text: info.desc ? info.desc.slice(0, 500) : '',
        rows: rows.slice(1).map(([k, v]) => ({ k, v }))
      },
      { quoted: msg, buffer: photo, caption, copy: [{ label: 'Salin link', value: url }, { label: 'Salin nama', value: info.name }] }
    )
  }
}
