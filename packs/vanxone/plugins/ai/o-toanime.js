// Fitur ai/o-toanime — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/toanime", {
  "name": "toanime",
  "command": [
    "toanime",
    "anime",
    "animefy",
    "ghibli"
  ],
  "category": "ai",
  "desc": "Ubah foto menjadi gaya anime/Ghibli Studio",
  "usage": ".toanime (reply/kirim gambar)",
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
