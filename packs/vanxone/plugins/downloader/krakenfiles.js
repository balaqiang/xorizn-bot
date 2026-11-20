// Fitur download/krakenfiles — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("download/krakenfiles", {
  "name": "kraken",
  "command": [
    "kraken",
    "kfdl"
  ],
  "category": "downloader",
  "desc": "Download file dari KrakenFiles",
  "usage": ".krakenfiles <url>",
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
