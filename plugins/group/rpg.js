// Fitur group/rpg — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/rpg", {
  "name": "rpg",
  "command": [
    "rpg",
    "togglerpg"
  ],
  "category": "group",
  "desc": "Mengaktifkan atau menonaktifkan fitur RPG di grup",
  "usage": ".rpg <on/off>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
