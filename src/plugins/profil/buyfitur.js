// Fitur user/buyfitur — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("user/buyfitur", {
  "name": "buyfitur",
  "command": [
    "buyfitur",
    "belifitur",
    "purchasefeature",
    "buyfeature"
  ],
  "category": "profil",
  "desc": "Beli fitur premium (1 fitur = 3000 koin)",
  "usage": ".buyfitur [nama_fitur]",
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
