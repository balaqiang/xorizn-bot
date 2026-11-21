// Fitur owner/ganti-xorizn-rpg — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn-rpg", {
  "name": "ganti-xorizn-rpg.jpg",
  "command": [
    "ganti-xorizn-rpg.jpg",
    "gantirpg",
    "setxoriznrpg"
  ],
  "category": "owner",
  "desc": "Ganti gambar xorizn-rpg.jpg (thumbnail rpg)",
  "usage": ".ganti-xorizn-rpg.jpg (reply/kirim gambar)",
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
