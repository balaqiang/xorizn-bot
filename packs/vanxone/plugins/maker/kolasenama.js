// Fitur maker/kolasenama — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("maker/kolasenama", {
  "name": "kolasenama",
  "command": [
    "kolasenama",
    "knama",
    "vcollagename",
    "vcn"
  ],
  "category": "maker",
  "desc": "Buat kolase vertikal 1:2 dengan teks di tengah",
  "usage": ".kolasenama <teks/[none]> (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
