// Fitur rpg/boss — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/boss", {
  "name": "boss",
  "command": [
    "boss",
    "raidboss",
    "bigboss"
  ],
  "category": "rpg",
  "desc": "Lawan boss untuk hadiah besar",
  "usage": ".boss",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 600,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
