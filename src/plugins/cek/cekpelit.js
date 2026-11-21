// Fitur cek/cekpelit — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekpelit", {
  "name": "cekpelit",
  "command": [
    "pelit",
    "kikir"
  ],
  "category": "cek",
  "desc": "Cek seberapa pelit kamu",
  "usage": ".cekpelit <nama>",
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
