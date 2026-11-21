// Fitur religi/rajab — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/rajab", {
  "name": "rajab",
  "command": [
    "rajab",
    "bulanrajab"
  ],
  "category": "islam",
  "desc": "Informasi lengkap tentang Bulan Rajab (doa, amalan, keutamaan, dan peristiwa penting)",
  "usage": ".rajab",
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
