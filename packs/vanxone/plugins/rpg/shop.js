// Fitur rpg/shop — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/shop", {
  "name": "shop",
  "command": [
    "jual"
  ],
  "category": "rpg",
  "desc": "Beli dan jual item RPG",
  "usage": ".shop <buy/sell> <item> <jumlah>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
