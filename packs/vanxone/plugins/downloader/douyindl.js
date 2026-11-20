// Fitur download/douyindl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/douyindl", {
  "name": "douyindl",
  "command": [
    "dydl"
  ],
  "category": "downloader",
  "desc": "Download video/audio dari Douyin (TikTok China)",
  "usage": ".douyindl <url>",
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
