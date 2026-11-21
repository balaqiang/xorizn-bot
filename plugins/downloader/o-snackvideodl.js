// Fitur download/o-snackvideodl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/snackvideodl", {
  "name": "snackvideodl",
  "command": [
    "snackvideodl",
    "svdl",
    "snackvideo",
    "sv"
  ],
  "category": "downloader",
  "desc": "Download video SnackVideo",
  "usage": ".svdl <url>",
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
