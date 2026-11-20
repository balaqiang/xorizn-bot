// Fitur cek/cekumur — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekumur", {
  "name": "cekumur",
  "command": [
    "cekumur"
  ],
  "category": "cek",
  "desc": "Cek umur mental kamu",
  "usage": ".cekumur <nama>",
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
