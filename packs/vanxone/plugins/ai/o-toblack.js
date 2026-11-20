// Fitur ai/o-toblack — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/toblack", {
  "name": "toblack",
  "command": [
    "toblack",
    "black",
    "hitamkan",
    "hitam",
    "tohitam"
  ],
  "category": "ai",
  "desc": "Ubah gambar ke skin tone lebih gelap",
  "usage": ".toblack (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
