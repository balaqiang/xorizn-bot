// Fitur ai/o-tohijab — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/tohijab", {
  "name": "tohijab",
  "command": [
    "tohijab",
    "hijab",
    "hijabstyle",
    "addhijab"
  ],
  "category": "ai",
  "desc": "Tambahkan hijab ke gambar",
  "usage": ".tohijab (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
