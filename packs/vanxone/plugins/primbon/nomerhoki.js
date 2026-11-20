// Fitur primbon/nomerhoki — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("primbon/nomerhoki", {
  "name": "nomerhoki",
  "command": [
    "nomerhoki",
    "nomorhoki",
    "ceknomor"
  ],
  "category": "primbon",
  "desc": "Cek keberuntungan nomor HP",
  "usage": ".nomerhoki <nomor>",
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
