// Fitur cek/cekgila — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekgila", {
  "name": "cekgila",
  "command": [
    "cekgila",
    "gila",
    "crazy"
  ],
  "category": "cek",
  "desc": "Cek seberapa gila kamu",
  "usage": ".cekgila <nama>",
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
