// Fitur cek/cektinggi — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cektinggi", {
  "name": "cektinggi",
  "command": [
    "cektinggi",
    "tinggi",
    "tall"
  ],
  "category": "cek",
  "desc": "Cek tinggi badan random",
  "usage": ".cektinggi <nama>",
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
