// Fitur download/tiktokdl — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("download/tiktokdl", {
  "name": "tiktokdl",
  "command": [
    "ttdown"
  ],
  "category": "downloader",
  "desc": "Download video/slide TikTok tanpa watermark",
  "usage": ".tiktok <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
