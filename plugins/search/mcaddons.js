// Fitur search/mcaddons — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/mcaddons", {
  "name": "mcaddons",
  "command": [
    "mcaddons",
    "mcmap"
  ],
  "category": "search",
  "desc": "Mencari Minecraft Bedrock addon dan map terbaru",
  "usage": ".mcaddons [atau .mcmap]",
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
