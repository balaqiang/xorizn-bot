// Fitur canvas/fakegopay — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakegopay", {
  "name": "fakegopay",
  "command": [
    "fakegopay"
  ],
  "category": "image",
  "desc": "Membuat canvas fake gopay",
  "usage": ".fakegopay <saldo>|<coin>|<terpakai>|<bulan>",
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
