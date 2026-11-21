// Fitur economy/nguli — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("economy/nguli", {
  "name": "rimuru-nguli",
  "command": [
    "rimuru-nguli"
  ],
  "category": "rpg",
  "desc": "Klaim upah nguli +10 limit dari Rimuru",
  "usage": ".nguli",
  "owner": false,
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
