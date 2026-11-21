// Fitur religi/ayat — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/ayat", {
  "name": "ayat",
  "command": [
    "ayat",
    "ayatpilihan",
    "suratpilihan"
  ],
  "category": "islam",
  "desc": "Kumpulan Ayat Pilihan Al-Quran (Arsy, Kursi, Ruqyah, dll)",
  "usage": ".ayat <nama ayat>",
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
