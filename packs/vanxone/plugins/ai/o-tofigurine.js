// Fitur ai/o-tofigurine — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/tofigurine", {
  "name": "tofigure3",
  "command": [
    "tofigure3",
    "figurine3",
    "bandai3",
    "actionfigure3"
  ],
  "category": "ai",
  "desc": "Ubah foto menjadi action figure/figurine koleksi",
  "usage": ".tofigure3 (reply/kirim gambar)",
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
