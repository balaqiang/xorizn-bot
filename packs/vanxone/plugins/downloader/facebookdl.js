// Fitur download/facebookdl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/facebookdl", {
  "name": "facebookdl",
  "command": [
    "facebookdl",
    "fbdown"
  ],
  "category": "downloader",
  "desc": "Download video Facebook",
  "usage": ".facebookdl <url>",
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
