// Fitur rpg/gift — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/gift", {
  "name": "gift",
  "command": [
    "gift",
    "kasih",
    "hadiah"
  ],
  "category": "rpg",
  "desc": "Beri hadiah ke pasangan untuk meningkatkan love",
  "usage": ".gift <item> <jumlah>",
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
