// Fitur rpg/blacksmith — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/blacksmith", {
  "name": "blacksmith",
  "command": [
    "blacksmith",
    "tempa",
    "forge",
    "pandai"
  ],
  "category": "rpg",
  "desc": "Tempa senjata dan armor dari material",
  "usage": ".blacksmith <item>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 120,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
