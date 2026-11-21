// Fitur download/ytmp3 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/ytmp3", {
  "name": "ytmp3",
  "command": [
    "youtubemp3"
  ],
  "category": "downloader",
  "desc": "Download audio YouTube",
  "usage": ".ytmp3 <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 20,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
