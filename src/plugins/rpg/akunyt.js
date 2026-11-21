// Fitur rpg/akunyt — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/akunyt", {
  "name": "akunyt",
  "command": [
    "akunyt"
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
