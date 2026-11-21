// Fitur owner/ganti-ourin-rpg — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin-rpg", {
  "name": "ganti-ourin-rpg.jpg",
  "command": [
    "ganti-ourin-rpg.jpg",
    "gantirpg",
    "setourinrpg"
  ],
  "category": "owner",
  "desc": "Ganti gambar ourin-rpg.jpg (thumbnail rpg)",
  "usage": ".ganti-ourin-rpg.jpg (reply/kirim gambar)",
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
