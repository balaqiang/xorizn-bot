// Fitur download/tiktokdldoc — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("download/tiktokdldoc", {
  "name": "tiktokdoc",
  "command": [
    "tiktokdoc"
  ],
  "category": "downloader",
  "desc": "Download video TikTok sebagai dokumen",
  "usage": ".ttdoc <url>",
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
