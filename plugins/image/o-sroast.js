// Fitur canvas/o-sroast — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/sroast", {
  "name": "sroast",
  "command": [
    "sroast",
    "stickerroast"
  ],
  "category": "image",
  "desc": "Buat stiker roast",
  "usage": ".sroast <teks1> | <teks2> | <teks3>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
