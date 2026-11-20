// Fitur game/tebakdrakor — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/tebakdrakor", {
  "name": "tebakdrakor",
  "command": [
    "tebakdrakor",
    "drakor",
    "kdrama"
  ],
  "category": "game",
  "desc": "Tebak judul drama Korea dari gambar",
  "usage": ".tebakdrakor",
  "owner": false,
  "group": false,
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
