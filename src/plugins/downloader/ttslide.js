// Fitur download/ttslide — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("download/ttslide", {
  "name": "ttslide",
  "command": [
    "tiktokslide"
  ],
  "category": "downloader",
  "desc": "Mengambil semua gambar dari TikTok photo/slideshow",
  "usage": ".ttslide <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
