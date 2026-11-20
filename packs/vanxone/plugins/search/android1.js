// Fitur search/android1 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/android1", {
  "name": "android1",
  "command": [
    "android1",
    "an1"
  ],
  "category": "search",
  "desc": "Cari dan download APK MOD dari Android1",
  "usage": ".android1 <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
