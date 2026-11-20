// Fitur search/apkpure — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/apkpure", {
  "name": "apkpure",
  "command": [
    "apkpure",
    "apkp"
  ],
  "category": "search",
  "desc": "Cari APK di ApkPure",
  "usage": ".apkpure <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
