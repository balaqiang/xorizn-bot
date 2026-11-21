// Fitur download/aio — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/aio", {
  "name": "aio",
  "command": [
    "allinone"
  ],
  "category": "downloader",
  "desc": "All in one downloader (IG, TikTok, FB, Twitter, YouTube, Pinterest, CapCut, dll)",
  "usage": ".aio <url>",
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
