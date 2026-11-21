// Fitur group/groupstats — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("group/groupstats", {
  "name": "groupstats",
  "command": [
    "groupstats",
    "statsgrup",
    "statsgroup"
  ],
  "category": "group",
  "desc": "Menampilkan statistik dasar grup saat ini",
  "usage": ".groupstats",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
