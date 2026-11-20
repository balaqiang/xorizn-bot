// Fitur canvas/o-watercolortext — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/watercolortext", {
  "name": "watercolortext",
  "command": [
    "watercolortext",
    "watercolor",
    "wctext"
  ],
  "category": "image",
  "desc": "Buat gambar teks dengan efek watercolor",
  "usage": ".watercolortext <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
