// Fitur internet/dongeng — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("internet/dongeng", {
  "name": "dongeng",
  "command": [
    "dongeng",
    "cerita",
    "dongengku"
  ],
  "category": "tools",
  "desc": "Cari dan baca dongeng dari 1000dongeng.com",
  "usage": ".dongeng <judul>",
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
