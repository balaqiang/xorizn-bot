// Fitur download/ytmp4 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/ytmp4", {
  "name": "ytmp4",
  "command": [
    "youtubemp4"
  ],
  "category": "downloader",
  "desc": "Download video YouTube",
  "usage": ".ytmp4 <url>",
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
