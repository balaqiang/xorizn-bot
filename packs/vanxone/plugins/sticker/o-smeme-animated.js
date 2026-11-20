// Fitur sticker/o-smeme-animated — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/smeme-animated", {
  "name": "smeme-animated",
  "command": [
    "smeme-animated",
    "smemevid"
  ],
  "category": "sticker",
  "desc": "Buat stiker meme animasi",
  "usage": ".smeme-animated <teks_atas>|<teks_bawah>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
