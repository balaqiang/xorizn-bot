// Fitur rpg/bansos — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/bansos", {
  "name": "bansos",
  "command": [
    "bansos"
  ],
  "category": "rpg",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": true,
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
