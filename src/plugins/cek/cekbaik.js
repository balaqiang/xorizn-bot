// Fitur cek/cekbaik — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekbaik", {
  "name": "cekbaik",
  "command": [
    "cekbaik",
    "baik",
    "kind"
  ],
  "category": "cek",
  "desc": "Cek seberapa baik kamu",
  "usage": ".cekbaik <nama>",
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
