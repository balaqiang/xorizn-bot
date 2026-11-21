// Fitur owner/ganti-orbit — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-orbit", {
  "name": "ganti-orbit.jpg",
  "command": [
    "ganti-orbit.jpg",
    "gantiorbit",
    "setorbit"
  ],
  "category": "owner",
  "desc": "Ganti gambar orbit.jpg (thumbnail menu)",
  "usage": ".ganti-orbit.jpg (reply/kirim gambar)",
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
