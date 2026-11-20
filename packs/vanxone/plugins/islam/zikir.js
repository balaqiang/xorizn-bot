// Fitur religi/zikir — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/zikir", {
  "name": "zikir",
  "command": [
    "zikir",
    "dzikir",
    "wirid",
    "zikirpagi",
    "zikirpetang"
  ],
  "category": "islam",
  "desc": "Kumpulan Zikir Harian (Pagi, Petang, Setelah Sholat, dan Lainnya)",
  "usage": ".zikir <pagi/petang/sholat>",
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
