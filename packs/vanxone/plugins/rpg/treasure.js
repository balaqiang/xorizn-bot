// Fitur rpg/treasure — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/treasure", {
  "name": "treasure",
  "command": [
    "treasure",
    "chest",
    "openbox"
  ],
  "category": "rpg",
  "desc": "Buka treasure chest untuk hadiah random",
  "usage": ".treasure",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
