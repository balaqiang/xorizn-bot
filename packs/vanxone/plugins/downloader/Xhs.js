// Fitur download/Xhs — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("download/Xhs", {
  "name": "xhs",
  "command": [
    "xhs"
  ],
  "category": "downloader",
  "desc": "Downloader XHS/RedNote untuk video atau gambar.",
  "usage": ".xhs <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
