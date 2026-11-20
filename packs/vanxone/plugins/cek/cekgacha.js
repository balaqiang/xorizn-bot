// Fitur cek/cekgacha — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekgacha", {
  "name": "cekgacha",
  "command": [
    "cekgacha",
    "luck"
  ],
  "category": "cek",
  "desc": "Cek hoki gacha kamu",
  "usage": ".cekgacha <nama>",
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
