// Fitur music/playncs — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("music/playncs", {
  "name": "playncs",
  "command": [
    "playncs",
    "ncssearch",
    "ncsplay"
  ],
  "category": "audio",
  "desc": "Imported from Rimuru MD V4.6",
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
