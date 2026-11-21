// Fitur search/apkzoic — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/apkzoic", {
  "name": "apkzoic",
  "command": [
    "apkzoic",
    "apkz"
  ],
  "category": "search",
  "desc": "Cari APK MOD di ApkZoic",
  "usage": ".apkzoic <query>",
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
