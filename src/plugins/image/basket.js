// Fitur canvas/basket — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/basket", {
  "name": "basket",
  "command": [
    "basket"
  ],
  "category": "image",
  "desc": "Buat gambar basket dengan nama custom",
  "usage": ".basket <nama>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
