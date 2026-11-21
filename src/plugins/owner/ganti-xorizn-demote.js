// Fitur owner/ganti-xorizn-demote — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn-demote", {
  "name": "ganti-xorizn-demote.jpg",
  "command": [
    "ganti-xorizn-demote.jpg",
    "gantixorizndemote",
    "setxorizndemote"
  ],
  "category": "owner",
  "desc": "Ganti gambar xorizn-demote.jpg",
  "usage": ".ganti-xorizn-demote.jpg (reply/kirim gambar)",
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
