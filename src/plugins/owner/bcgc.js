// Fitur owner/bcgc — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/bcgc", {
  "name": "bcgc",
  "command": [
    "bcgc",
    "broadcastgc",
    "bcgroup",
    "jedabcgc",
    "delaybcgc",
    "setjedabcgc",
    "stopbcgc",
    "stopbroadcastgc"
  ],
  "category": "owner",
  "desc": "Broadcast pesan ke semua grup dengan dukungan semua jenis media",
  "usage": ".bcgc",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
