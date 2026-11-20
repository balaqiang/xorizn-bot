// Fitur rpg/freelance — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/freelance", {
  "name": "freelance",
  "command": [
    "freelance",
    "desain",
    "koding"
  ],
  "category": "rpg",
  "desc": "Mengerjakan project online klien bule",
  "usage": ".freelance",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 200,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
