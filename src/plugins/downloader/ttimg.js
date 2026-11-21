// Fitur download/ttimg — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("download/ttimg", {
  "name": "ttimg",
  "command": [
    "ttimg",
    "tiktokimg"
  ],
  "category": "downloader",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
