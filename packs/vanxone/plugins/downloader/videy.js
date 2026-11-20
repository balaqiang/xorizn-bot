// Fitur download/videy — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/videy", {
  "name": "videy",
  "command": [
    "vdl",
    "videydownload"
  ],
  "category": "downloader",
  "desc": "Download video dari videy.co",
  "usage": ".videy <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
