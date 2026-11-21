// Fitur sticker/tostickerpack — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("sticker/tostickerpack", {
  "name": "tostickerpack",
  "command": [
    "tostickerpack",
    "tospack",
    "spack",
    "tsp"
  ],
  "category": "sticker",
  "desc": "Ubah album foto yang di-reply jadi sticker pack WhatsApp",
  "usage": ".tostickerpack <nama pack> (reply ke pesan album foto)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
