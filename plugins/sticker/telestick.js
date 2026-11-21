// Fitur sticker/telestick — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("sticker/telestick", {
  "name": "telestick",
  "command": [
    "telestick",
    "tgsticker",
    "telegramsticker"
  ],
  "category": "sticker",
  "desc": "Ambil sticker pack dari Telegram dan kirim sebagai sticker pack WhatsApp",
  "usage": ".telestick <url>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
