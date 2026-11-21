// Fitur search/apkcombo — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/apkcombo", {
  "name": "apkcombo",
  "command": [
    "apkcombo",
    "apk",
    "apksearch"
  ],
  "category": "search",
  "desc": "Cari APK di ApkCombo",
  "usage": ".apkcombo <query>",
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
