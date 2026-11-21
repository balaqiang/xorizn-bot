// Fitur search/android1-get — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/android1-get", {
  "name": "android1-get",
  "command": [
    "android1-get",
    "an1get",
    "an1dl"
  ],
  "category": "search",
  "desc": "Download APK dari Android1",
  "usage": ".android1-get <url>",
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
