// Fitur rpg/dice — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/dice", {
  "name": "dice",
  "command": [
    "dice"
  ],
  "category": "rpg",
  "desc": "Lempar dadu untuk gambling",
  "usage": ".dice <1-6> <bet>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
