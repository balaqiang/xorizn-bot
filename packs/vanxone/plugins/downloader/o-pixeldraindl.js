// Fitur download/o-pixeldraindl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/pixeldraindl", {
  "name": "pixeldraindl",
  "command": [
    "pixeldraindl",
    "pddl",
    "pixeldrain",
    "pddownload"
  ],
  "category": "downloader",
  "desc": "Download file dari Pixeldrain",
  "usage": ".pixeldraindl <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
