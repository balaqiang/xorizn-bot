// Fitur fun/cekpacar — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/cekpacar", {
  "name": "cekpacar",
  "command": [
    "cekpacar",
    "pacar",
    "gebetan"
  ],
  "category": "fun",
  "desc": "Cek status hubungan seseorang",
  "usage": ".cekpacar atau .cekpacar @tag",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
