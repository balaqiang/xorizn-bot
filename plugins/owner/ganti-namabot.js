// Fitur owner/ganti-namabot — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-namabot", {
  "name": "ganti-namabot",
  "command": [
    "ganti-namabot",
    "setnamabot",
    "setnamebot",
    "gantibot"
  ],
  "category": "owner",
  "desc": "Ganti nama bot di config.js",
  "usage": ".ganti-namabot <nama baru>",
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
