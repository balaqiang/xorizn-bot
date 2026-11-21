// Fitur ai/o-tomanga — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/tomanga", {
  "name": "tomanga",
  "command": [
    "tomanga",
    "manga",
    "mangafy",
    "mangastyle"
  ],
  "category": "ai",
  "desc": "Ubah foto menjadi gaya manga Jepang",
  "usage": ".tomanga (reply/kirim gambar)",
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
