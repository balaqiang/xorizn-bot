// Fitur rpg/pet — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/pet", {
  "name": "pet",
  "command": [
    "pet",
    "mypet",
    "hewanku",
    "peliharaan"
  ],
  "category": "rpg",
  "desc": "Kelola pet/hewan peliharaan",
  "usage": ".pet <feed/train/status>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
