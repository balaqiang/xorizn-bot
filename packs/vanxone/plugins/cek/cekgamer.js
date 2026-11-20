// Fitur cek/cekgamer — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekgamer", {
  "name": "cekgamer",
  "command": [
    "gamer",
    "pro"
  ],
  "category": "cek",
  "desc": "Cek seberapa pro gamer kamu",
  "usage": ".cekgamer <nama>",
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
