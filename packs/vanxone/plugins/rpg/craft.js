// Fitur rpg/craft — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/craft", {
  "name": "craft",
  "command": [
    "buat",
    "create"
  ],
  "category": "rpg",
  "desc": "Craft item dari materials",
  "usage": ".craft <item>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
