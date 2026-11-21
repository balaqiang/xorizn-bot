// Fitur religi/puasa — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/puasa", {
  "name": "puasa",
  "command": [
    "puasa",
    "puasasunnah",
    "puasasenin",
    "puasakamis",
    "puasadawud"
  ],
  "category": "islam",
  "desc": "Panduan Puasa Sunnah Lengkap (Senin-Kamis, Dawud, Arafah, Asyura, dll)",
  "usage": ".puasa <nama puasa>",
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
