// Fitur owner/liatgacha — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/liatgacha", {
  "name": "liatgacha",
  "command": [
    "liatgacha",
    "lihat-gacha",
    "listgacha",
    "daftargacha",
    "lg"
  ],
  "category": "owner",
  "desc": "Melihat semua karakter yang tersedia di database gacha",
  "usage": ".liat-gacha",
  "owner": true,
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
