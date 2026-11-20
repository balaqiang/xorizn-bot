// Fitur cek/cekprocastinator — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekprocastinator", {
  "name": "cekprocastinator",
  "command": [
    "cekprocastinator",
    "procrastinator",
    "nunda"
  ],
  "category": "cek",
  "desc": "Cek tingkat suka menunda",
  "usage": ".cekprocastinator <nama>",
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
