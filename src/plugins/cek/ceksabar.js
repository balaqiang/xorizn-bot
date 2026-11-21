// Fitur cek/ceksabar — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/ceksabar", {
  "name": "ceksabar",
  "command": [
    "sabar",
    "patience"
  ],
  "category": "cek",
  "desc": "Cek tingkat kesabaran kamu",
  "usage": ".ceksabar <nama>",
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
