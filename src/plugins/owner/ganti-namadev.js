// Fitur owner/ganti-namadev — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-namadev", {
  "name": "ganti-namadev",
  "command": [
    "ganti-namadev",
    "setnamadev",
    "setnamedev",
    "gantideveloper"
  ],
  "category": "owner",
  "desc": "Ganti nama developer di config.js",
  "usage": ".ganti-namadev <nama baru>",
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
