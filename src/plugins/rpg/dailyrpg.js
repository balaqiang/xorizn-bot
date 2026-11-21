// Fitur rpg/dailyrpg — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("rpg/dailyrpg", {
  "name": "dailyrpg",
  "command": [
    "dailyrpg"
  ],
  "category": "rpg",
  "desc": "Klaim hadiah harian",
  "usage": ".dailyrpg",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
