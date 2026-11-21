// Fitur cek/cekimut — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekimut", {
  "name": "cekimut",
  "command": [
    "imut",
    "cute"
  ],
  "category": "cek",
  "desc": "Cek seberapa imut kamu",
  "usage": ".cekimut <nama>",
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
