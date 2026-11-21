// Fitur rpg/training — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/training", {
  "name": "training",
  "command": [
    "training",
    "train",
    "latihan",
    "workout"
  ],
  "category": "rpg",
  "desc": "Latihan untuk meningkatkan stats",
  "usage": ".training <attack/defense/health>",
  "owner": false,
  "group": false,
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
