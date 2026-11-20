// Fitur owner/addgacha — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/addgacha", {
  "name": "addgacha",
  "command": [
    "addgacha",
    "add-gacha",
    "tambahgacha",
    "adddarling"
  ],
  "category": "owner",
  "desc": "Tambah karakter ke database gacha darling",
  "usage": ".add-gacha Nama Karakter | https://url.mp4",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
