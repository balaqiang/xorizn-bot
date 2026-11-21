// Fitur rpg/sawer — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/sawer", {
  "name": "sawer",
  "command": [
    "sawer",
    "nyawer"
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
