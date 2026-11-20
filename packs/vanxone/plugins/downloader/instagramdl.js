// Fitur download/instagramdl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/instagramdl", {
  "name": "instagramdl",
  "command": [
    "instagramdl"
  ],
  "category": "downloader",
  "desc": "Download video/foto Instagram",
  "usage": ".instagramdl <url>",
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
    "scrapers": [],
    "assets": []
  }
})
