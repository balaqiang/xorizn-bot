// Fitur download/mediafiredl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/mediafiredl", {
  "name": "mediafiredl",
  "command": [
    "mediafiredl"
  ],
  "category": "downloader",
  "desc": "Download file dari MediaFire",
  "usage": ".mfdl <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
