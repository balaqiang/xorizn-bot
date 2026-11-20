// Fitur owner/ganti-namaowner — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-namaowner", {
  "name": "ganti-namaowner",
  "command": [
    "ganti-namaowner",
    "setnamaowner",
    "setnameowner",
    "setownername"
  ],
  "category": "owner",
  "desc": "Ganti nama owner (utama atau tambahan)",
  "usage": ".ganti-namaowner <nomor> <nama baru>",
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
