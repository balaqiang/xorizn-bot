// Fitur ai/o-tocermin — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/tocermin", {
  "name": "tocermin",
  "command": [
    "tocermin",
    "tomirror"
  ],
  "category": "ai",
  "desc": "Ubah foto menjadi efek cermin (mirror reflection)",
  "usage": ".tocermin (reply/kirim gambar)",
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
