// Fitur cek/ceksetia — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/ceksetia", {
  "name": "ceksetia",
  "command": [
    "setia",
    "loyal"
  ],
  "category": "cek",
  "desc": "Cek tingkat kesetiaan kamu",
  "usage": ".ceksetia <nama>",
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
