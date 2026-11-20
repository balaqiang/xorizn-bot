// Fitur cek/ceksexy — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/ceksexy", {
  "name": "ceksexy",
  "command": [
    "ceksexy",
    "sexy",
    "hot"
  ],
  "category": "cek",
  "desc": "Cek seberapa sexy kamu",
  "usage": ".ceksexy <nama>",
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
