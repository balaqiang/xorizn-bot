// Fitur download/likeedl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/likeedl", {
  "name": "likeedl",
  "command": [
    "likeedl",
    "lkdl",
    "likee",
    "lk"
  ],
  "category": "downloader",
  "desc": "Download video Likee",
  "usage": ".lkdl <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [
      "likee"
    ],
    "assets": []
  }
})
