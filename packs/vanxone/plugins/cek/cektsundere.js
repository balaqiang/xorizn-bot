// Fitur cek/cektsundere — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cektsundere", {
  "name": "cektsundere",
  "command": [
    "cektsundere",
    "tsundere"
  ],
  "category": "cek",
  "desc": "Cek tingkat tsundere kamu",
  "usage": ".cektsundere <nama>",
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
