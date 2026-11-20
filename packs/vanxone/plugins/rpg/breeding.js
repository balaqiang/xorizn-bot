// Fitur rpg/breeding — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/breeding", {
  "name": "breeding",
  "command": [
    "breeding",
    "breed",
    "kawin",
    "petbreed"
  ],
  "category": "rpg",
  "desc": "Breeding pets untuk mendapat pet baru",
  "usage": ".breeding @user",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3600,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
