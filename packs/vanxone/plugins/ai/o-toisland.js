// Fitur ai/o-toisland — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/toisland", {
  "name": "toisland",
  "command": [
    "toisland",
    "island",
    "tropical"
  ],
  "category": "ai",
  "desc": "Ubah foto menjadi suasana pulau tropis",
  "usage": ".toisland (reply/kirim gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
