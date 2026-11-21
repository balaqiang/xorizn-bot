// Fitur download/o-shopeedl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/shopeedl", {
  "name": "shopeedl",
  "command": [
    "shopeedl",
    "shopeevideo",
    "shopeevid"
  ],
  "category": "downloader",
  "desc": "Download video dari Shopee",
  "usage": ".shopeedl <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
