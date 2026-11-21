// Fitur cek/cekoverpower — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekoverpower", {
  "name": "cekoverpower",
  "command": [
    "cekoverpower",
    "overpower",
    "op"
  ],
  "category": "cek",
  "desc": "Cek tingkat overpower kamu",
  "usage": ".cekoverpower <nama>",
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
