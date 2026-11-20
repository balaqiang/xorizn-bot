// Fitur owner/ganti-rimuru-promote — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-rimuru-promote", {
  "name": "ganti-rimuru-promote.jpg",
  "command": [
    "ganti-rimuru-promote.jpg",
    "gantirimurupromote",
    "setrimurupromote"
  ],
  "category": "owner",
  "desc": "Ganti gambar rimuru-promote.jpg",
  "usage": ".ganti-rimuru-promote.jpg (reply/kirim gambar)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
