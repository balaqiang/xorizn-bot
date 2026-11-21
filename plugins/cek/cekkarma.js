// Fitur cek/cekkarma — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekkarma", {
  "name": "cekkarma",
  "command": [
    "cekkarma",
    "karma"
  ],
  "category": "cek",
  "desc": "Cek tingkat karma kamu",
  "usage": ".cekkarma <nama>",
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
