// Fitur download/ttmp3 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("download/ttmp3", {
  "name": "ttmusic",
  "command": [
    "ttmusic",
    "tiktokmusic"
  ],
  "category": "downloader",
  "desc": "Download video TikTok lalu konversi ke audio MP3",
  "usage": ".ttmp3 <url>",
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
