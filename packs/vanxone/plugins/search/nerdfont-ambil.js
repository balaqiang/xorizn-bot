// Fitur search/nerdfont-ambil — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/nerdfont-ambil", {
  "name": "nerdfont-ambil",
  "command": [
    "nerdfont-ambil",
    "dafont-ambil",
    "fontambil"
  ],
  "category": "search",
  "desc": "Cari font di DaFont",
  "usage": ".nerdfont-ambil <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
