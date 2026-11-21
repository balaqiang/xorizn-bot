// Fitur owner/ganti-xorizn-promote — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn-promote", {
  "name": "ganti-xorizn-promote.jpg",
  "command": [
    "ganti-xorizn-promote.jpg",
    "gantixoriznpromote",
    "setxoriznpromote"
  ],
  "category": "owner",
  "desc": "Ganti gambar xorizn-promote.jpg",
  "usage": ".ganti-xorizn-promote.jpg (reply/kirim gambar)",
  "owner": true,
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
