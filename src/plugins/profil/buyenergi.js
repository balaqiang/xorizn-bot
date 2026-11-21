// Fitur user/buyenergi — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("user/buyenergi", {
  "name": "buyenergi",
  "command": [
    "buyenergi",
    "belienergi",
    "purchaseenergi",
    "buyenergy"
  ],
  "category": "profil",
  "desc": "Beli energi dengan koin (1 energi = 100 koin)",
  "usage": ".buyenergi <jumlah>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
