// Fitur rpg/polisi — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/polisi", {
  "name": "polisi",
  "command": [
    "polisi"
  ],
  "category": "rpg",
  "desc": "",
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
