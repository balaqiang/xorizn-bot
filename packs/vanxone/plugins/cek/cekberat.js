// Fitur cek/cekberat — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekberat", {
  "name": "cekberat",
  "command": [
    "cekberat",
    "berat",
    "weight"
  ],
  "category": "cek",
  "desc": "Cek berat badan random",
  "usage": ".cekberat <nama>",
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
