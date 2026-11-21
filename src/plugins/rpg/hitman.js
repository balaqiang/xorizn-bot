// Fitur rpg/hitman — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/hitman", {
  "name": "bunuh",
  "command": [
    "bunuh",
    "hitman"
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
