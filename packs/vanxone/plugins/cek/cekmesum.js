// Fitur cek/cekmesum — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekmesum", {
  "name": "cekmesum",
  "command": [
    "cekmesum",
    "mesum"
  ],
  "category": "cek",
  "desc": "Cek seberapa mesum kamu",
  "usage": ".cekmesum <nama>",
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
