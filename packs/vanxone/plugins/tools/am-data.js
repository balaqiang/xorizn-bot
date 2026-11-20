// Fitur tools/am-data — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("tools/am-data", {
  "name": "am-data",
  "command": [
    "am-data",
    "alightmotion-data"
  ],
  "category": "tools",
  "desc": "Lihat data project Alight Motion dari link share",
  "usage": ".am-data <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [
      "obscura"
    ],
    "scrapers": [],
    "assets": []
  }
})
