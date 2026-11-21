// Fitur rpg/skill — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/skill", {
  "name": "skill",
  "command": [
    "skill"
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
