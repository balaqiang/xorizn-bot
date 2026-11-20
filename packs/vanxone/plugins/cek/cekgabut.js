// Fitur cek/cekgabut — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekgabut", {
  "name": "cekgabut",
  "command": [
    "cekgabut",
    "gabut",
    "bored"
  ],
  "category": "cek",
  "desc": "Cek tingkat keGabutan kamu",
  "usage": ".cekgabut <nama>",
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
