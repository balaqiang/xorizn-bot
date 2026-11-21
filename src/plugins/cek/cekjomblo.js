// Fitur cek/cekjomblo — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekjomblo", {
  "name": "cekjomblo",
  "command": [
    "jomblo",
    "single"
  ],
  "category": "cek",
  "desc": "Cek tingkat kejombloan kamu",
  "usage": ".cekjomblo <nama>",
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
