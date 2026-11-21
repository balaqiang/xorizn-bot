// Fitur cek/cekjahat — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekjahat", {
  "name": "cekjahat",
  "command": [
    "cekjahat",
    "jahat",
    "evil"
  ],
  "category": "cek",
  "desc": "Cek seberapa jahat kamu",
  "usage": ".cekjahat <nama>",
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
