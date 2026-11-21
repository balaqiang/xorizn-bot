// Fitur owner/d-public — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/public", {
  "name": "public2",
  "command": [
    "public2",
    "publicmode"
  ],
  "category": "owner",
  "desc": "Mengaktifkan mode public (semua user bisa akses)",
  "usage": ".public2",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
