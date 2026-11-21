// Fitur rpg/mulai — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/mulai", {
  "name": "mulai",
  "command": [
    "mulai"
  ],
  "category": "rpg",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
