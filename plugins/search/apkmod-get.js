// Fitur search/apkmod-get — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/apkmod-get", {
  "name": "apkmod-get",
  "command": [
    "apkmod-get",
    "apkmodget",
    "getapkmod"
  ],
  "category": "search",
  "desc": "Download APK MOD dari hasil pencarian",
  "usage": ".apkmod-get <no> <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
