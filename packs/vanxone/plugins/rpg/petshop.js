// Fitur rpg/petshop — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/petshop", {
  "name": "petshop",
  "command": [
    "petshop",
    "tokopet",
    "buypet",
    "belipet"
  ],
  "category": "rpg",
  "desc": "Beli pet dari toko",
  "usage": ".petshop <buy> <pet>",
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
