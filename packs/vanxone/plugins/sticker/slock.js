// Fitur sticker/slock — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("sticker/slock", {
  "name": "slock",
  "command": [
    "slock",
    "stickerlock",
    "anticolongsticker"
  ],
  "category": "sticker",
  "desc": "Mengubah sticker biasa menjadi avatar sticker (locked)",
  "usage": ".slock",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
