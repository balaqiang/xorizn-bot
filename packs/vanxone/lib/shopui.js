// lib/shopui.js — pengirim kartu bertombol untuk fitur toko & panel (rich -> otomatis teks biasa kalau gagal)
'use strict'
const { sendRich, richOrText, btn } = require('./interactive')

// ctx = konteks plugin ({ sock, msg, from, config }); image = Buffer (opsional)
function card(ctx, { title = '', body, image, buttons = [], fallback, mentions = [], to }) {
  const { sock, msg, from, config } = ctx
  const jid = to || from
  const plain = fallback || body
  return richOrText(
    sock, jid, msg, config,
    () => sendRich(sock, jid, { media: image ? { image } : undefined, title, body, footer: config.footer, buttons, mentions, quoted: to ? undefined : msg }),
    plain
  )
}

// baris "Label : nilai" rapi
const rows = (pairs) => pairs.filter(([, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => `${k.padEnd(9)}: ${v}`).join('\n')

// target nomor WhatsApp dari teks / mention / reply
const jidOf = (num) => `${String(num).replace(/\D/g, '')}@s.whatsapp.net`

module.exports = { card, rows, jidOf, btn }
