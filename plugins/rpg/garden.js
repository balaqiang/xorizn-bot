// Fitur rpg/garden — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/garden", {
  "name": "garden",
  "command": [
    "garden",
    "kebun"
  ],
  "category": "rpg",
  "desc": "Berkebun dan panen tanaman",
  "usage": ".garden <plant/harvest/status>",
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
