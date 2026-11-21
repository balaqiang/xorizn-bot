// Fitur canvas/kalender — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/kalender", {
  "name": "kalender",
  "command": [
    "calendar",
    "tanggalan"
  ],
  "category": "image",
  "desc": "Melihat kalender lengkap tahun 2026 atau per bulan.",
  "usage": ".kalender [bulan/tahun]",
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
