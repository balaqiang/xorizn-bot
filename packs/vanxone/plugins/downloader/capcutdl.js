// Fitur download/capcutdl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/capcutdl", {
  "name": "capcutdl",
  "command": [
    "capcutdl",
    "ccdl",
    "capcut",
    "cc"
  ],
  "category": "downloader",
  "desc": "Download video CapCut",
  "usage": ".ccdl <url>",
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
