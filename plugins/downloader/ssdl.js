// Fitur downloader/ssdl — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("downloader/ssdl", {
  "name": "ssdl",
  "command": [
    "ssdl",
    "slideshare",
    "ssimg"
  ],
  "category": "downloader",
  "desc": "Ambil semua gambar slide dari link SlideShare",
  "usage": ".ssdl <link slideshare>",
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
