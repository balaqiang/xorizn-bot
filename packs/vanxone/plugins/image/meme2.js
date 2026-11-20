// Fitur canvas/meme2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/meme2", {
  "name": "meme2",
  "command": [
    "meme2",
    "changemymind"
  ],
  "category": "image",
  "desc": "Membuat meme change my mind",
  "usage": ".meme2 <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
