// Fitur download/tiktokdl2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("download/tiktokdl2", {
  "name": "tiktokdl2",
  "command": [
    "tiktokdl2",
    "ttdown2"
  ],
  "category": "downloader",
  "desc": "Download video/slide TikTok tanpa watermark",
  "usage": ".tiktok2 <url>",
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
