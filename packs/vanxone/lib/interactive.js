// lib/interactive.js — pembuat tombol + pengirim pesan bertombol vanXone.
// SEMUA pesan bertombol dikirim lewat sock.sendButtons / sendMessage({ buttons | carousel }) milik vanXone
// (engine/lib/wraper-send, dipasang lib/ztsend.js); teksnya digayakan ala vanXone (lib/ztstyle.js).
const ztstyle = require('./engine/pulse-style')

const mediaToContent = (media) => {
  if (!media) return {}
  if (media.image) return { image: media.image }
  if (media.video) return { video: media.video }
  if (media.document) return { document: media.document, mimetype: media.mimetype || 'application/octet-stream', filename: media.fileName || media.filename || 'file' }
  return {}
}

const needSock = (sock) => {
  if (typeof sock.sendButtons !== 'function') throw new Error('pengirim tombol belum terpasang')
}
const idOf = (r) => (typeof r === 'string' ? r : r && r.key && r.key.id) || ''

// Kirim pesan dengan tombol single_select (list) — gaya vanXone
async function sendListMenu(sock, jid, opts) {
  needSock(sock)
  const { media, caption, footer, buttonTitle, sections, mentions = [], quoted } = opts
  const content = {
    ...mediaToContent(media),
    text: ztstyle.style(String(caption || '')),
    footer: footer || global.namaBot || '',
    contextInfo: { mentionedJid: mentions },
    buttons: [{ title: buttonTitle || 'Menu', sections: (sections || []).map((sc) => ({ title: sc.title || '', rows: (sc.rows || []).map((r) => ({ header: r.header, title: r.title, description: r.description || '', id: r.id })) })), icon: 'NONE' }]
  }
  const r = await sock.sendButtons(jid, content, { quoted })
  return { key: { id: idOf(r), remoteJid: jid } }
}

// =====================================================================
// Rich message generik (tombol quick_reply / url / copy / list) + carousel
// =====================================================================

// Pembuat tombol. id tombol = teks perintah yang akan dijalankan bot saat ditekan (mis. '.ytmp3 https://...')
// v8: di mode RICH tidak ada emoji sama sekali -> label tombol & teks pesan native dibersihkan dari emoji
const NE = (t) => {
  if (typeof t !== 'string') return t
  try {
    if (!require('./uimode').isRich()) return t
    const r = require('./fa').strip(t).replace(/[ \t]{2,}/g, ' ').replace(/^[ \t]+/gm, (m) => m).trim()
    return r || t
  } catch {
    return t
  }
}
const NEsec = (sections) =>
  Array.isArray(sections)
    ? sections.map((sc) => ({
        ...sc,
        title: NE(sc.title),
        rows: Array.isArray(sc.rows) ? sc.rows.map((r) => ({ ...r, title: NE(r.title), header: NE(r.header), description: NE(r.description) })) : sc.rows
      }))
    : sections

const btn = {
  reply: (text, id) => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: NE(text), id }) }),
  url: (text, url) => ({ name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: NE(text), url, merchant_url: url }) }),
  copy: (text, code) => ({ name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: NE(text), copy_code: code }) }),
  list: (title, sections) => ({ name: 'single_select', buttonParamsJson: JSON.stringify({ title: NE(title), sections: NEsec(sections) }) })
}



// Kirim satu pesan rich: media (opsional) + teks + footer + deretan tombol (via sock.sendButtons vanXone)
async function sendRich(sock, jid, opts) {
  needSock(sock)
  const { media, title = '', body, footer = '', buttons = [], mentions = [], quoted } = opts
  const cardreply = require('./cardreply')
  const hints = opts.hints ?? require('../config').richHints !== false
  const { labels } = cardreply.analyze(buttons)
  const content = {
    ...mediaToContent(media),
    ...(title ? { title } : {}),
    text: ztstyle.style(NE(body)) + (hints ? NE(cardreply.hintLine(labels)) : ''),
    footer: NE(footer) || global.namaBot || '',
    contextInfo: { mentionedJid: mentions },
    buttons
  }
  const r = await sock.sendButtons(jid, content, { quoted })
  const msg = { key: { id: idOf(r), remoteJid: jid } }
  if (msg.key.id) cardreply.register(msg.key.id, buttons)
  return msg
}

// Kirim carousel: cards = [{ media, title, body, footer, buttons }] (via sendButtons carousel vanXone)
async function sendCarousel(sock, jid, opts) {
  needSock(sock)
  const { body = '', footer = '', cards, quoted, mentions = [] } = opts
  const content = {
    text: body,
    footer: footer || global.namaBot || '',
    contextInfo: { mentionedJid: mentions },
    carousel: (cards || []).map((c) => ({ ...mediaToContent(c.media), title: c.title || '', body: ztstyle.style(NE(c.body || '')), footer: c.footer || '', buttons: c.buttons || [] }))
  }
  const r = await sock.sendButtons(jid, content, { quoted })
  return { key: { id: idOf(r), remoteJid: jid } }
}

// Kirim rich; kalau gagal / richMode dimatikan, kirim teks biasa + daftar perintah pengganti.
// fallbackText: teks lengkap untuk mode biasa (sertakan cara pakai perintahnya)
async function richOrText(sock, jid, msg, config, rich, fallbackText) {
  if (config.richMode !== false) {
    try {
      return await rich()
    } catch (err) {
      console.log('[RICH] gagal kirim pesan interaktif, pakai teks biasa:', err.message)
    }
  }
  return sock.sendMessage(jid, { text: fallbackText }, { quoted: msg })
}

module.exports = { sendListMenu, sendRich, sendCarousel, richOrText, btn }
