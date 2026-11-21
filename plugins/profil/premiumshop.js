// Fitur user/premiumshop — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("user/premiumshop", {
  "name": "premshop",
  "command": [
    "premshop",
    "premiumshop",
    "buypremium",
    "belipremium",
    "buyprem"
  ],
  "category": "profil",
  "desc": "Beli premium memakai koin",
  "usage": ".premshop | .buypremium monthly/lifetime",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
