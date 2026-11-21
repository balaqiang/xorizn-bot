// Fitur search/apkmod — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/apkmod", {
  "name": "apkmod",
  "command": [
    "apkmod",
    "modapk2",
    "apkpremium"
  ],
  "category": "search",
  "desc": "Cari dan download APK MOD Premium",
  "usage": ".apkmod <query>",
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
