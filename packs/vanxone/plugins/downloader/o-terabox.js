// Fitur download/o-terabox — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/terabox", {
  "name": "terabox",
  "command": [
    "terabox",
    "tb",
    "tera",
    "teraboxdl",
    "tbdl"
  ],
  "category": "downloader",
  "desc": "Download video/file dari TeraBox",
  "usage": ".terabox <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
