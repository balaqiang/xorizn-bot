// Fitur rpg/pelabuhan — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/pelabuhan", {
  "name": "pelabuhan",
  "command": [
    "pelabuhan"
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
