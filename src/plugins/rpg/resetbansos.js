// Fitur rpg/resetbansos — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/resetbansos", {
  "name": "resetbansos",
  "command": [
    "resetbansos"
  ],
  "category": "rpg",
  "desc": "",
  "usage": "",
  "owner": true,
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
