// Fitur download/sfiledl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/sfiledl", {
  "name": "sfiledl",
  "command": [
    "sfiledownload"
  ],
  "category": "downloader",
  "desc": "Download file dari Sfile.mobi",
  "usage": ".sfiledl <url>",
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
