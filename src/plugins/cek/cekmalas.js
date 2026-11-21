// Fitur cek/cekmalas — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekmalas", {
  "name": "cekmalas",
  "command": [
    "cekmalas",
    "malas",
    "lazy"
  ],
  "category": "cek",
  "desc": "Cek seberapa malas kamu",
  "usage": ".cekmalas <nama>",
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
