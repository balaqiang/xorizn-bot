// Fitur stalker/o-robloxplayer — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("stalker/robloxplayer", {
  "name": "robloxplayer",
  "command": [
    "robloxplayer",
    "robloxsearch",
    "searchroblox",
    "robloxfind"
  ],
  "category": "stalker",
  "desc": "Search Roblox player by username",
  "usage": ".robloxplayer <username>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
