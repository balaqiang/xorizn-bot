// Fitur rpg/arena — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/arena", {
  "name": "arena",
  "command": [
    "arena",
    "pvp",
    "battle",
    "fight"
  ],
  "category": "rpg",
  "desc": "Bertarung di arena PvP",
  "usage": ".arena <@user>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 180,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
