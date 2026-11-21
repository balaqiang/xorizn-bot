// Fitur rpg/deps — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/deps", {
  "name": "deps",
  "command": [
    "deps"
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
