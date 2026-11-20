// Fitur rpg/woodcut — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/woodcut", {
  "name": "woodcut",
  "command": [
    "woodcut",
    "chop",
    "kayu"
  ],
  "category": "rpg",
  "desc": "Menebang pohon untuk mendapatkan kayu",
  "usage": ".woodcut",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
