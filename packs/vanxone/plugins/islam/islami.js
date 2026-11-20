// Fitur religi/islami — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("religi/islami", {
  "name": "islami",
  "command": [
    "islami",
    "niatsholat",
    "niatshalat",
    "berdoa",
    "gislam"
  ],
  "category": "islam",
  "desc": "Kumpulan fitur Islami (Asmaul Husna, Niat Sholat, Surah, Doa, Artikel, Kata Mutiara)",
  "usage": ".islami <fitur>",
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
