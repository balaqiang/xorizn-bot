// Fitur rpg/marketplace — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/marketplace", {
  "name": "7eleven",
  "command": [
    "7eleven",
    "foodshop",
    "marketstall",
    "buyfood"
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
