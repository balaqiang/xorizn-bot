// Fitur sticker/o-stickerpack — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/stickerpack", {
  "name": "stickerpack",
  "command": [
    "stickerpack",
    "stickersearch",
    "searchsticker"
  ],
  "category": "sticker",
  "desc": "Cari dan kirim sticker pack",
  "usage": ".stickerpack <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 20,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
