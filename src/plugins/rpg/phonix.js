// Fitur rpg/phonix — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/phonix", {
  "name": "fightphonix",
  "command": [
    "fightphonix"
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
