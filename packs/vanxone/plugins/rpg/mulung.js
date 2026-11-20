// Fitur rpg/mulung — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/mulung", {
  "name": "mulung",
  "command": [
    "scavenge",
    "kumpulsampah"
  ],
  "category": "rpg",
  "desc": "Memulung untuk mengumpulkan barang",
  "usage": ".mulung",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 300,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
