// Fitur tools/cekxl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/cekxl", {
  "name": "cekxl",
  "command": [
    "cekxl",
    "checkxl",
    "xlcheck",
    "xlcek"
  ],
  "category": "tools",
  "desc": "Cek informasi paket dan kuota nomor XL/Axis secara detail",
  "usage": ".cekxl <nomor>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
