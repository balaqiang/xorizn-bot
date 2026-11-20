// Fitur download/ytpost — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("download/ytpost", {
  "name": "ytpost",
  "command": [
    "ytpost",
    "ytcommunity",
    "ytupdate"
  ],
  "category": "downloader",
  "desc": "Ambil konten dari YouTube Community Post",
  "usage": ".ytpost <url>",
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
