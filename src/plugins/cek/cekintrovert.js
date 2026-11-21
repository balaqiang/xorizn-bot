// Fitur cek/cekintrovert — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekintrovert", {
  "name": "cekintrovert",
  "command": [
    "cekintrovert",
    "introvert"
  ],
  "category": "cek",
  "desc": "Cek tingkat introvert kamu",
  "usage": ".cekintrovert <nama>",
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
