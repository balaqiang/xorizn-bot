// Fitur anime/topanime — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("anime/topanime", {
  "name": "topanime",
  "command": [
    "topanime",
    "top-anime",
    "waifutop"
  ],
  "category": "anime",
  "desc": "Melihat daftar karakter anime / waifu terpopuler",
  "usage": ".topanime",
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
