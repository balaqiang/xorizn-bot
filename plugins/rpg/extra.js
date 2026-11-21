// Fitur rpg/extra — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/extra", {
  "name": "achieve",
  "command": [
    "achieve",
    "prestasi",
    "title",
    "gelar"
  ],
  "category": "rpg",
  "desc": "Achievement dan gelar RPG tambahan berbasis data Rimuru.",
  "usage": ".achievement | .titles",
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
