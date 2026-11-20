// Fitur rpg/kurir — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/kurir", {
  "name": "kurir",
  "command": [
    "kurir",
    "antar",
    "paket"
  ],
  "category": "rpg",
  "desc": "Nganter paket orang, awas anjing galak!",
  "usage": ".kurir",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 120,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
