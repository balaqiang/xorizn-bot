// Fitur cek/cekotaku — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekotaku", {
  "name": "cekotaku",
  "command": [
    "cekotaku",
    "otaku"
  ],
  "category": "cek",
  "desc": "Cek tingkat otaku kamu",
  "usage": ".cekotaku <nama>",
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
